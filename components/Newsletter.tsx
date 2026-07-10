"use client";

import { FormEvent, useState } from "react";
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

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: getNewsletterSource(),
          company: honeypot,
        }),
      });

      const result = (await response.json()) as {
        status?: "success" | "duplicate" | "error";
      };

      if (response.ok && result.status === "success") {
        setFormState("success");
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
          Newsletter
        </p>

        <h2 className="section-title">
          Join thousands of readers building better businesses, making smarter
          decisions and discovering new ideas.
        </h2>

        <p className="newsletterText body-large">
          Get occasional emails with new books, articles, free resources and
          practical ideas. No spam. Just useful thinking.
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
