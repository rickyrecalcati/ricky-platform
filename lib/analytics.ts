"use client";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: EventParams,
    ) => void;
  }
}

function currentPage() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.hash}`;
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackAmazonBookClick(bookTitle: string, page = currentPage()) {
  trackEvent("amazon_book_click", {
    book_title: bookTitle,
    page,
  });
}

export function trackNewsletterSignup(source: string, page = currentPage()) {
  trackEvent("newsletter_signup", {
    source,
    page,
  });
}

export function trackResourceDownload(
  resourceTitle: string,
  page = currentPage(),
) {
  trackEvent("resource_download", {
    resource_title: resourceTitle,
    page,
  });
}

export function trackArticleComplete(
  articleTitle: string,
  params: EventParams = {},
) {
  trackEvent("article_complete", {
    article_title: articleTitle,
    ...params,
  });
}
