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
  | "missing_resend_segment_id"
  | "resend_contact_error"
  | "resend_contact_exception"
  | "resend_rate_limit"
  | "resend_segment_error"
  | "resend_segment_exception";
type ContactCreateResult = Awaited<ReturnType<Resend["contacts"]["create"]>>;
type ContactSegmentResult = Awaited<
  ReturnType<Resend["contacts"]["segments"]["add"]>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_MESSAGE = "Something went wrong. Please try again.";
const RATE_LIMIT_MESSAGE = "Too many attempts. Please wait a minute and try again.";
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

function resendErrorMessage(
  code: NewsletterErrorCode,
  error: { name?: string; statusCode?: number | null },
) {
  if (process.env.NODE_ENV === "production") {
    return ERROR_MESSAGE;
  }

  return `${ERROR_MESSAGE} [${code}:${error.name ?? "unknown"}:${
    error.statusCode ?? "unknown"
  }]`;
}

function rateLimitMessage() {
  if (process.env.NODE_ENV === "production") {
    return RATE_LIMIT_MESSAGE;
  }

  return `${RATE_LIMIT_MESSAGE} [resend_rate_limit]`;
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

function getResendSegmentId() {
  const segmentId =
    process.env.RESEND_SEGMENT_ID?.trim() ||
    process.env.RESEND_AUDIENCE_ID?.trim();

  return segmentId || null;
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

function isRateLimitError(error: { name?: string; statusCode?: number | null }) {
  return error.statusCode === 429 || error.name === "rate_limit_exceeded";
}

function isAlreadyInSegmentError(error: {
  message?: string;
  statusCode?: number | null;
}) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.statusCode === 409 ||
    message.includes("already in segment") ||
    message.includes("already exists") ||
    message.includes("duplicate")
  );
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
  segmentId: string,
) {
  return resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [
      {
        id: segmentId,
      },
    ],
  });
}

function resendRateLimitResponse() {
  logNewsletterError("resend_rate_limited");

  return jsonResponse(
    {
      ok: false,
      status: "error",
      message: rateLimitMessage(),
      code: "resend_rate_limit",
    },
    { status: 429 },
  );
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
  const segmentId = getResendSegmentId();

  if (!segmentId) {
    logNewsletterError("missing_resend_segment_id");

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: errorMessage("missing_resend_segment_id"),
        code: "missing_resend_segment_id",
      },
      { status: 503 },
    );
  }

  logNewsletterEvent("creating_contact", {
    source,
  });

  let contactResult: ContactCreateResult;

  try {
    contactResult = await createBalanceSheetContact(
      resend,
      email,
      segmentId,
    );
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
    if (isRateLimitError(contactResult.error)) {
      return resendRateLimitResponse();
    }

    if (isDuplicateContactError(contactResult.error)) {
      let segmentResult: ContactSegmentResult;

      try {
        segmentResult = await resend.contacts.segments.add({
          email,
          segmentId,
        });
      } catch (error) {
        logNewsletterError("segment_add_exception", {
          errorName: error instanceof Error ? error.name : "unknown",
        });

        return jsonResponse(
          {
            ok: false,
            status: "error",
            message: errorMessage("resend_segment_exception"),
            code: "resend_segment_exception",
          },
          { status: 502 },
        );
      }

      if (segmentResult.error) {
        if (isRateLimitError(segmentResult.error)) {
          return resendRateLimitResponse();
        }

        if (!isAlreadyInSegmentError(segmentResult.error)) {
          logNewsletterError("segment_add_failed", {
            name: segmentResult.error.name,
            statusCode: segmentResult.error.statusCode,
          });

          return jsonResponse(
            {
              ok: false,
              status: "error",
              message: errorMessage("resend_segment_error"),
              code: "resend_segment_error",
            },
            { status: 502 },
          );
        }
      }

      logNewsletterEvent("contact_already_exists", {
        email: safeEmailSummary(email),
        segmentAdded: !segmentResult.error,
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
        message: resendErrorMessage("resend_contact_error", contactResult.error),
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
