"use client";

import { FormEvent, useState } from "react";
import { trackNewsletterSignup } from "../lib/analytics";
import "./NewsletterSignupForm.css";

type FormState = "idle" | "submitting" | "success" | "alreadySubscribed" | "error";
type NewsletterResponse = {
  status?: "success" | "duplicate" | "error";
  message?: string;
  code?: string;
};

type NewsletterSignupFormProps = {
  className: string;
  messageClassName: string;
  sourceAnchor: string;
  buttonText?: string;
  placeholder?: string;
};

const formMessages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  success: "You're subscribed to Balance Sheet.",
  alreadySubscribed: "You're already subscribed to Balance Sheet.",
  error: "Something went wrong. Please try again.",
};

function getNewsletterSource(sourceAnchor: string) {
  if (typeof window === "undefined") {
    return sourceAnchor;
  }

  return `${window.location.pathname}#${sourceAnchor}`;
}

export default function NewsletterSignupForm({
  buttonText = "Subscribe",
  className,
  messageClassName,
  placeholder = "Your email address",
  sourceAnchor,
}: NewsletterSignupFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setFormMessage("");
    const source = getNewsletterSource(sourceAnchor);

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
    <>
      <form className={className} onSubmit={handleSubmit}>
        <input
          aria-hidden="true"
          autoComplete="off"
          className="newsletterSignupHoneypot"
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
          placeholder={placeholder}
          required
          value={email}
        />

        <button className="luxuryButton luxuryButtonPrimary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Subscribing..." : buttonText}
        </button>
      </form>

      {message ? (
        <p className={messageClassName} role="status">
          {message}
        </p>
      ) : null}
    </>
  );
}
