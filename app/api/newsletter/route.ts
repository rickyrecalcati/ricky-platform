import { Resend } from "resend";
import { getLatestBalanceSheetIssue } from "../../../data/articles";
import WelcomeEmail from "../../../emails/WelcomeEmail";
import { absoluteUrl } from "../../../lib/seo";

type NewsletterRequestBody = {
  email?: unknown;
  source?: unknown;
  company?: unknown;
};

type NewsletterStatus = "success" | "duplicate" | "error";
type NewsletterErrorCode =
  | "invalid_json"
  | "spam_detected"
  | "invalid_email"
  | "missing_resend_api_key"
  | "resend_contact_lookup_error"
  | "resend_contact_lookup_exception"
  | "resend_contact_error"
  | "resend_contact_exception";
type ContactCreateResult = Awaited<ReturnType<Resend["contacts"]["create"]>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_MESSAGE = "Something went wrong. Please try again.";
const SUCCESS_MESSAGE = "You're subscribed to Balance Sheet.";
const DUPLICATE_MESSAGE = "You're already subscribed to Balance Sheet.";
const RESEND_FROM = "Ricky Recalcati <balancesheet@updates.rickyrecalcati.com>";
const NEWSLETTER_LOG_PREFIX = "[newsletter]";

function errorMessage(code: NewsletterErrorCode) {
  if (process.env.NODE_ENV === "production") {
    return ERROR_MESSAGE;
  }

  return `${ERROR_MESSAGE} [${code}]`;
}

function jsonResponse(
  body: {
    ok: boolean;
    status: NewsletterStatus;
    message: string;
    code?: NewsletterErrorCode;
  },
  init?: ResponseInit,
) {
  return Response.json(body, init);
}

function logNewsletterEvent(
  stage: string,
  details: Record<string, string | number | boolean | null | undefined> = {},
) {
  console.info(`${NEWSLETTER_LOG_PREFIX} ${stage}`, JSON.stringify(details));
}

function logNewsletterError(
  stage: string,
  details: Record<string, string | number | boolean | null | undefined> = {},
) {
  console.error(`${NEWSLETTER_LOG_PREFIX} ${stage}`, JSON.stringify(details));
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function normalizeEmail(email: unknown) {
  if (typeof email !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return null;
  }

  return normalizedEmail;
}

function safeEmailSummary(email: string) {
  const [localPart, domain = "unknown"] = email.split("@");
  const firstCharacter = localPart.charAt(0) || "?";

  return `${firstCharacter}***@${domain}`;
}

function normalizeSource(source: unknown, request: Request) {
  if (typeof source === "string" && source.trim()) {
    return source.trim().slice(0, 180);
  }

  const referrer = request.headers.get("referer");

  if (referrer) {
    try {
      const url = new URL(referrer);
      return `${url.pathname}${url.hash || ""}`.slice(0, 180);
    } catch {
      return "newsletter";
    }
  }

  return "newsletter";
}

function isDuplicateContactError(error: {
  name?: string;
  message?: string;
  statusCode?: number | null;
}) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.statusCode === 409 ||
    message.includes("already exists") ||
    message.includes("already been added") ||
    message.includes("duplicate")
  );
}

function isContactPropertyValidationError(error: {
  name?: string;
  statusCode?: number | null;
}) {
  return error.name === "validation_error" && error.statusCode === 422;
}

function isNotFoundError(error: { name?: string; statusCode?: number | null }) {
  return error.name === "not_found" || error.statusCode === 404;
}

function latestBalanceSheetUrl() {
  const latestIssue = getLatestBalanceSheetIssue();

  if (!latestIssue) {
    return absoluteUrl("/articles");
  }

  return absoluteUrl(`/articles/${latestIssue.slug}`);
}

async function sendWelcomeEmail(resend: Resend, email: string) {
  const latestIssueUrl = latestBalanceSheetUrl();
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: email,
    subject: "Welcome to Balance Sheet",
    react: WelcomeEmail({
      latestBalanceSheetUrl: latestIssueUrl,
    }),
    tags: [
      {
        name: "newsletter",
        value: "balance_sheet",
      },
      {
        name: "email_type",
        value: "welcome",
      },
    ],
  });

  if (error) {
    logNewsletterError("welcome_email_failed", {
      name: error.name,
      statusCode: error.statusCode,
    });

    return false;
  }

  logNewsletterEvent("welcome_email_sent", {
    email: safeEmailSummary(email),
  });

  return true;
}

async function createBalanceSheetContact(
  resend: Resend,
  email: string,
  source: string,
) {
  const contactWithProperties = await resend.contacts.create({
    email,
    unsubscribed: false,
    // If the Resend account has matching custom contact properties, keep
    // this metadata available for future segmentation and Broadcasts.
    properties: {
      newsletter: "balance_sheet",
      source,
    },
  });

  if (
    contactWithProperties.error &&
    isContactPropertyValidationError(contactWithProperties.error)
  ) {
    logNewsletterEvent("contact_property_retry_without_metadata", {
      statusCode: contactWithProperties.error.statusCode,
    });

    return resend.contacts.create({
      email,
      unsubscribed: false,
    });
  }

  return contactWithProperties;
}

export async function POST(request: Request) {
  logNewsletterEvent("route_invoked", {
    method: request.method,
  });

  let body: NewsletterRequestBody;

  try {
    body = (await request.json()) as NewsletterRequestBody;
  } catch {
    logNewsletterError("invalid_json");

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("invalid_json"),
        code: "invalid_json",
      },
      { status: 400 },
    );
  }

  if (typeof body.company === "string" && body.company.trim()) {
    logNewsletterEvent("honeypot_completed");

    return jsonResponse({
      ok: true,
      status: "success",
      message: SUCCESS_MESSAGE,
      code: "spam_detected",
    });
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    logNewsletterEvent("invalid_email");

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("invalid_email"),
        code: "invalid_email",
      },
      { status: 400 },
    );
  }

  logNewsletterEvent("email_validated", {
    email: safeEmailSummary(email),
  });

  const resend = getResendClient();

  if (!resend) {
    logNewsletterError("missing_resend_api_key");

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("missing_resend_api_key"),
        code: "missing_resend_api_key",
      },
      { status: 503 },
    );
  }

  const source = normalizeSource(body.source, request);
  let existingContactResult: Awaited<ReturnType<typeof resend.contacts.get>>;

  try {
    existingContactResult = await resend.contacts.get({ email });
  } catch (error) {
    logNewsletterError("contact_lookup_exception", {
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("resend_contact_lookup_exception"),
        code: "resend_contact_lookup_exception",
      },
      { status: 502 },
    );
  }

  if (existingContactResult.data) {
    logNewsletterEvent("contact_already_exists", {
      email: safeEmailSummary(email),
    });

    return jsonResponse({
      ok: true,
      status: "duplicate",
      message: DUPLICATE_MESSAGE,
    });
  }

  if (
    existingContactResult.error &&
    !isNotFoundError(existingContactResult.error)
  ) {
    logNewsletterError("contact_lookup_failed", {
      name: existingContactResult.error.name,
      statusCode: existingContactResult.error.statusCode,
    });

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("resend_contact_lookup_error"),
        code: "resend_contact_lookup_error",
      },
      { status: 502 },
    );
  }

  logNewsletterEvent("contact_not_found");

  let contactResult: ContactCreateResult;

  try {
    contactResult = await createBalanceSheetContact(resend, email, source);
  } catch (error) {
    logNewsletterError("contact_create_exception", {
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("resend_contact_exception"),
        code: "resend_contact_exception",
      },
      { status: 502 },
    );
  }

  if (contactResult.error) {
    if (isDuplicateContactError(contactResult.error)) {
      logNewsletterEvent("contact_already_exists", {
        email: safeEmailSummary(email),
      });

      return jsonResponse({
        ok: true,
        status: "duplicate",
        message: DUPLICATE_MESSAGE,
      });
    }

    logNewsletterError("contact_create_failed", {
      name: contactResult.error.name,
      statusCode: contactResult.error.statusCode,
    });

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("resend_contact_error"),
        code: "resend_contact_error",
      },
      { status: 502 },
    );
  }

  logNewsletterEvent("contact_created", {
    email: safeEmailSummary(email),
  });

  await sendWelcomeEmail(resend, email);

  return jsonResponse({
    ok: true,
    status: "success",
    message: SUCCESS_MESSAGE,
  });
}
