import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import Newsletter from "../../../components/Newsletter";
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
    title: article.title,
    description: article.excerpt,
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
      <Navbar />

      <article className="articleDetail">
        <header className="articleDetailHero premiumReveal">
          <p className="eyebrow">{article.category}</p>
          <h1 className="display-title">{article.title}</h1>
          <p className="body-large">{article.excerpt}</p>

          <div className="articleDetailMeta">
            <span>{article.author}</span>
            <time dateTime={article.date}>{formattedDate}</time>
            <span>{article.readingTime}</span>
          </div>
        </header>

        <div className="articleDetailBody">
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
            </section>
          ))}
        </div>

        <section className="articleDetailCta" aria-label="Next steps">
          <p className="eyebrow">Keep Reading</p>
          <h2 className="section-title">Books and essays for clearer work.</h2>
          <p className="body-large">
            Explore Ricky&apos;s books or join the newsletter for practical
            ideas on business, systems and better decisions.
          </p>
          <div className="articleDetailActions">
            <Link className="luxuryButton luxuryButtonPrimary" href="/books">
              Explore Books
            </Link>
            <a className="luxuryButton luxuryButtonSecondary" href="#newsletter">
              Join Newsletter
            </a>
          </div>
        </section>
      </article>

      <Newsletter />
      <Footer />
    </main>
  );
}
