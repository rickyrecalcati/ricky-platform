"use client";

import { useEffect, useRef } from "react";
import { trackArticleComplete } from "../lib/analytics";

type ArticleCompletionTrackerProps = {
  articleTitle: string;
  issueNumber?: number;
  series?: string;
};

export default function ArticleCompletionTracker({
  articleTitle,
  issueNumber,
  series,
}: ArticleCompletionTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    function handleScroll() {
      if (hasTracked.current) {
        return;
      }

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollProgress = window.scrollY / scrollableHeight;

      if (scrollProgress >= 0.9) {
        hasTracked.current = true;
        trackArticleComplete(articleTitle, {
          issue_number: issueNumber,
          series,
        });
        window.removeEventListener("scroll", handleScroll);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleTitle, issueNumber, series]);

  return null;
}
