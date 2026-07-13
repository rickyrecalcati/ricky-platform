import Link from "next/link";
import { getLatestBalanceSheetIssue } from "../data/articles";
import "./BalanceSheetFeature.css";

export default function BalanceSheetFeature() {
  const issue = getLatestBalanceSheetIssue();

  if (!issue) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(issue.date));

  return (
    <section
      className="balanceSheetFeature premiumSection"
      aria-labelledby="balance-sheet-feature-title"
    >
      <Link
        className="balanceSheetFeatureCard premiumReveal"
        href={`/articles/${issue.slug}`}
      >
        <div className="balanceSheetFeatureMeta">
          <span className="eyebrow">Balance Sheet</span>
          <span>Issue #{String(issue.issueNumber ?? 0).padStart(3, "0")}</span>
          <time dateTime={issue.date}>{formattedDate}</time>
          <span>{issue.readingTime}</span>
        </div>

        <div className="balanceSheetFeatureBody">
          <div>
            <h2 id="balance-sheet-feature-title" className="section-title">
              {issue.headline ?? issue.title}
            </h2>
            <p className="body">{issue.excerpt}</p>
          </div>

          <span className="balanceSheetFeatureCta">
            Read this week&apos;s Balance Sheet
          </span>
        </div>
      </Link>
    </section>
  );
}
