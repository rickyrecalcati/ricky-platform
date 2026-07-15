"use client";

import { FormEvent, useState } from "react";
import { trackNewsletterSignup } from "../lib/analytics";
import "./Newsletter.css";

type FormState = "idle" | "submitting" | "success" | "alreadySubscribed" | "error";
type NewsletterResponse = {
  status?: "success" | "duplicate" | "error";
  message?: string;
  code?: string;
};

const formMessages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  success: "You're subscribed to Balance Sheet.",
  alreadySubscribed: "You're already subscribed to Balance Sheet.",
  error: "Something went wrong. Please try again.",
};

function getNewsletterSource() {
  if (typeof window === "undefined") {
    return "newsletter";
  }

  return `${window.location.pathname}#newsletter`;
}

export default function Newsletter() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setFormMessage("");
    const source = getNewsletterSource();

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          company: honeypot,
        }),
      });

      const responseText = await response.text();
      let result: NewsletterResponse = {};

      try {
        result = responseText ? (JSON.parse(responseText) as NewsletterResponse) : {};
      } catch {
        result = {
          status: "error",
          message: formMessages.error,
          code: "invalid_response",
        };
      }

      if (response.ok && result.status === "success") {
        setFormState("success");
        setFormMessage(result.message ?? formMessages.success);
        trackNewsletterSignup(source);
        setEmail("");
        return;
      }

      if (response.ok && result.status === "duplicate") {
        setFormState("alreadySubscribed");
        setFormMessage(result.message ?? formMessages.alreadySubscribed);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("[newsletter] non-success response", JSON.stringify({
          httpStatus: response.status,
          apiStatus: result.status,
          code: result.code,
          message: result.message,
        }));
      }

      setFormState("error");
      setFormMessage(result.message ?? formMessages.error);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[newsletter] network error", error);
      }

      setFormState("error");
      setFormMessage(formMessages.error);
    }
  }

  const isSubmitting = formState === "submitting";
  const message =
    formState === "success" || formState === "alreadySubscribed" || formState === "error"
      ? formMessage || formMessages[formState]
      : null;

  return (
    <section className="newsletter premiumSection" id="newsletter">
      <div className="newsletterCard premiumReveal">

        <p className="newsletterTag eyebrow">
          Join Balance Sheet
        </p>

        <h2 className="section-title">
          Every Monday, get a clear review of business, markets and investing.
        </h2>

        <div className="newsletterEditorial">
          <p className="newsletterText body-large">
            Every Monday you&apos;ll receive one carefully written issue that
            cuts through the noise. Instead of trying to keep up with hundreds
            of headlines, you&apos;ll get the stories that mattered, why they
            matter, and the lessons worth carrying into the week ahead.
          </p>

          <p className="newsletterText body-large">
            Whether you&apos;re building a business, investing for the long term
            or simply trying to make better decisions, Balance Sheet is designed
            to save you time while helping you think more clearly.
          </p>
        </div>

        <p className="newsletterEmphasis body">
          One email. Every Monday. Always free.
        </p>

        <form className="newsletterForm" onSubmit={handleSubmit}>
          <input
            aria-hidden="true"
            autoComplete="off"
            className="newsletterHoneypot"
            name="company"
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            type="text"
            value={honeypot}
          />
          <input
            type="email"
            aria-label="Email address"
            autoComplete="email"
            disabled={isSubmitting}
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (formState !== "idle") {
                setFormState("idle");
                setFormMessage("");
              }
            }}
            placeholder="Your email address"
            required
            value={email}
          />

          <button className="luxuryButton luxuryButtonPrimary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        <p className="newsletterAssurance body">
          Free. No spam. Unsubscribe anytime.
        </p>

        {message ? (
          <p className="newsletterMessage body" role="status">
            {message}
          </p>
        ) : null}

      </div>
    </section>
  );
}
