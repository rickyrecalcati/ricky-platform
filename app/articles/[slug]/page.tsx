import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import Newsletter from "../../../components/Newsletter";
import ArticleCompletionTracker from "../../../components/ArticleCompletionTracker";
import { articles, getArticleBySlug } from "../../../data/articles";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../../lib/seo";
import "./article.css";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return createPageMetadata({
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.date,
    authors: [article.author],
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(article.date));

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(articleJsonLd(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Articles", path: "/articles" },
              { name: article.title, path: `/articles/${article.slug}` },
            ]),
          ),
        }}
      />
      <ArticleCompletionTracker
        articleTitle={article.title}
        issueNumber={article.issueNumber}
        series={article.series}
      />
      <Navbar />

      <article className="articleDetail">
        <header className="articleDetailHero premiumReveal">
          {article.series === "Balance Sheet" ? (
            <div className="articleSeriesHeader" aria-label="Balance Sheet issue">
              <span className="eyebrow">{article.series}</span>
              <span>
                Issue #{String(article.issueNumber ?? 0).padStart(3, "0")}
              </span>
              {article.weekCovered ? <span>{article.weekCovered}</span> : null}
            </div>
          ) : (
            <p className="eyebrow">{article.category}</p>
          )}
          <h1 className="display-title">{article.title}</h1>
          <p className="body-large">{article.excerpt}</p>

          {article.seriesDescription ? (
            <p className="articleSeriesDescription body">
              {article.seriesDescription}
            </p>
          ) : null}

          <div className="articleDetailMeta">
            <span>{article.author}</span>
            <time dateTime={article.date}>{formattedDate}</time>
            <span>{article.readingTime}</span>
          </div>

          {article.tags ? (
            <div className="articleDetailTags" aria-label="Article tags">
              {article.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="articleDetailBody">
          {article.pullQuote ? (
            <blockquote className="articlePullQuote">
              <p>{article.pullQuote}</p>
            </blockquote>
          ) : null}

          {article.sections.map((section) => (
            <section className="articleDetailSection" key={section.heading}>
              <h2 className="section-title">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p className="body" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              {section.points ? (
                <ul>
                  {section.points.map((point) => (
                    <li className="body" key={point}>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.table ? (
                <div className="articleDetailTableWrap">
                  <table>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th scope="col" key={header}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, cellIndex) => (
                            <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.callout ? (
                <div className="articleDetailCallout">
                  <p>{section.callout}</p>
                </div>
              ) : null}

              {section.quote ? (
                <blockquote className="articleDetailQuote">
                  <p>{section.quote}</p>
                </blockquote>
              ) : null}
            </section>
          ))}
        </div>

        {article.series === "Balance Sheet" ? (
          <section className="articleDisclaimer" aria-label="Financial disclaimer">
            <p>
              This publication is for general information and commentary only.
              It does not constitute personal financial advice, investment
              advice or a recommendation to buy or sell any asset. Always
              conduct your own research and consider seeking advice appropriate
              to your circumstances.
            </p>
          </section>
        ) : null}

        {article.sources ? (
          <section className="articleSources" aria-label="Sources">
            <p className="eyebrow">Sources</p>
            <ol>
              {article.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {article.relatedContent ? (
          <section className="articleRelatedContent" aria-label="Related reading">
            <p className="eyebrow">Related Reading</p>
            <h2 className="section-title">Go deeper into the systems.</h2>
            <div className="articleRelatedGrid">
              {article.relatedContent.map((item) => (
                <Link
                  className="articleRelatedCard"
                  href={item.href}
                  key={item.href}
                >
                  <span>{item.title}</span>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="articleDetailCta" aria-label="Next steps">
          <p className="eyebrow">Keep Reading</p>
          <h2 className="section-title">Books and essays for clearer work.</h2>
          <p className="body-large">
            Explore Ricky&apos;s books or join Balance Sheet for practical
            ideas on business, systems and better decisions.
          </p>
          <div className="articleDetailActions">
            <Link className="luxuryButton luxuryButtonPrimary" href="/books">
              Explore Books
            </Link>
            <a className="luxuryButton luxuryButtonSecondary" href="#newsletter">
              Join Balance Sheet
            </a>
          </div>
        </section>
      </article>

      <Newsletter />
      <Footer />
    </main>
  );
}
