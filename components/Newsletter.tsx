"use client";

import { FormEvent, useState } from "react";
import { trackNewsletterSignup } from "../lib/analytics";
import "./Newsletter.css";

type FormState = "idle" | "submitting" | "success" | "alreadySubscribed" | "error";

const formMessages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  success: "You’re on the list. Welcome.",
  alreadySubscribed: "You’re already subscribed.",
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
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
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

      const result = (await response.json()) as {
        status?: "success" | "duplicate" | "error";
      };

      if (response.ok && result.status === "success") {
        setFormState("success");
        trackNewsletterSignup(source);
        setEmail("");
        return;
      }

      if (response.ok && result.status === "duplicate") {
        setFormState("alreadySubscribed");
        return;
      }

      setFormState("error");
    } catch {
      setFormState("error");
    }
  }

  const isSubmitting = formState === "submitting";
  const message =
    formState === "success" || formState === "alreadySubscribed" || formState === "error"
      ? formMessages[formState]
      : null;

  return (
    <section className="newsletter premiumSection" id="newsletter">
      <div className="newsletterCard premiumReveal">

        <p className="newsletterTag eyebrow">
          Balance Sheet
        </p>

        <h2 className="section-title">
          Every Monday, get a clear review of markets, business and investing.
        </h2>

        <p className="newsletterText body-large">
          Get a clear review of the previous week — including what mattered,
          what may have been overlooked and what I&apos;m watching next.
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

        {message ? (
          <p className="newsletterMessage body" role="status">
            {message}
          </p>
        ) : null}

      </div>
    </section>
  );
}
