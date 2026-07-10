"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { quotes } from "../data/quotes";
import "./QuoteRotator.css";

const ROTATION_INTERVAL_MS = 8000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

export default function QuoteRotator() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeQuote = quotes[activeQuoteIndex];

  useEffect(() => {
    if (prefersReducedMotion || isPaused || quotes.length <= 1) {
      return;
    }

    const rotation = window.setInterval(() => {
      setActiveQuoteIndex((currentIndex) => (currentIndex + 1) % quotes.length);
    }, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(rotation);
    };
  }, [isPaused, prefersReducedMotion]);

  return (
    <figure
      aria-label="Rotating quotes from Ricky Recalcati"
      className="quoteRotator"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
    >
      <span className="quoteRotatorMark" aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className="quoteRotatorText" key={activeQuote.text}>
        {activeQuote.text}
      </blockquote>
      <figcaption className="quoteRotatorAttribution eyebrow">
        {activeQuote.attribution}
      </figcaption>
    </figure>
  );
}
