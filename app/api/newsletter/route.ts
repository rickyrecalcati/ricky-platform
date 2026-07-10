import { createClient } from "@supabase/supabase-js";

type NewsletterRequestBody = {
  email?: unknown;
  source?: unknown;
  company?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(
  body: {
    ok: boolean;
    status: "success" | "duplicate" | "error";
    message: string;
  },
  init?: ResponseInit,
) {
  return Response.json(body, init);
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
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

function isDuplicateError(error: { code?: string; message?: string }) {
  return (
    error.code === "23505" ||
    error.message?.toLowerCase().includes("duplicate") === true
  );
}

export async function POST(request: Request) {
  let body: NewsletterRequestBody;

  try {
    body = (await request.json()) as NewsletterRequestBody;
  } catch {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 400 },
    );
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return jsonResponse({
      ok: true,
      status: "success",
      message: "You’re on the list. Welcome.",
    });
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 400 },
    );
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }

  const { data: existingSubscriber, error: lookupError } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }

  if (existingSubscriber) {
    return jsonResponse({
      ok: true,
      status: "duplicate",
      message: "You’re already subscribed.",
    });
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email,
      source: normalizeSource(body.source, request),
      status: "active",
    });

  if (insertError) {
    if (isDuplicateError(insertError)) {
      return jsonResponse({
        ok: true,
        status: "duplicate",
        message: "You’re already subscribed.",
      });
    }

    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }

  return jsonResponse({
    ok: true,
    status: "success",
    message: "You’re on the list. Welcome.",
  });
}
