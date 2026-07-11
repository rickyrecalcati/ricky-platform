import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import BookSeriesSection from "../../../components/BookSeriesSection";
import TrackedAmazonLink from "../../../components/TrackedAmazonLink";
import { books, getBookBySlug } from "../../../data/books";
import {
  bookJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../../lib/seo";
import "./book-page.css";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function AmazonBookLink({ bookTitle, href }: { bookTitle: string; href: string }) {
  return (
    <TrackedAmazonLink
      bookTitle={bookTitle}
      className="bookDetailButton bookDetailButtonPrimary"
      href={href}
    >
      Read on Amazon Kindle
    </TrackedAmazonLink>
  );
}

export function generateStaticParams() {
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return createPageMetadata({
    title: book.series ? `${book.title} Series` : book.title,
    description: book.description,
    path: `/books/${book.slug}`,
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const { page } = book;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(bookJsonLd(book)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Books", path: "/books" },
              { name: book.title, path: `/books/${book.slug}` },
            ]),
          ),
        }}
      />
      <Navbar />

      <section className="bookDetailHero">
        <div className="bookDetailHeroContent">
          <div className="bookDetailMeta">
            <p className="bookDetailEyebrow eyebrow">{page.heroEyebrow}</p>
            {book.status === "Published" ? (
              <span className="bookDetailStatusBadge eyebrow">{book.status}</span>
            ) : null}
          </div>
          <h1 className="display-title">{book.title}</h1>
          <h2 className="bookDetailHeroHeadline section-title">
            {page.heroHeadline}
          </h2>
          <p className="bookDetailHeroText body-large">
            {page.heroDescription}
          </p>

          <div className="bookDetailHeroActions">
            {book.amazonUrl ? (
              <AmazonBookLink bookTitle={book.title} href={book.amazonUrl} />
            ) : null}
          </div>
        </div>

        <div className="bookDetailCoverStage" aria-label={`${book.title} book cover placeholder`}>
          <div className="bookDetailBookCover">
            <span className="eyebrow">{page.coverKicker}</span>
            <strong className="section-title">{book.title}</strong>
            <small className="body">{page.coverTagline}</small>
          </div>
        </div>
      </section>

      <section className="bookDetailCredibility" aria-label={`${book.title} credibility`}>
        {page.credibility.map((item) => (
          <p className="eyebrow" key={item}>{item}</p>
        ))}
      </section>

      <section className="bookDetailCreamSection bookDetailStory">
        <div>
          <p className="bookDetailSectionLabel eyebrow">Why I Wrote This Book</p>
          <h2 className="section-title">{page.whyTitle}</h2>
        </div>
        <p className="body-large">{page.whyBody}</p>
      </section>

      {page.seriesBooks ? (
        <BookSeriesSection
          books={page.seriesBooks}
          eyebrow={page.seriesSectionEyebrow ?? "The Five Books"}
          title={page.seriesSectionTitle ?? "A practical path through the series."}
        />
      ) : null}

      <section className="bookDetailDarkSection">
        <div className="bookDetailSectionIntro">
          <p className="bookDetailSectionLabel eyebrow">Who This Book Is For</p>
          <h2 className="section-title">{page.audienceTitle}</h2>
        </div>

        <div className="bookDetailAudienceGrid">
          {page.audience.map((item) => (
            <article key={item} className="bookDetailAudienceItem">
              <span />
              <p className="body">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bookDetailCreamSection bookDetailLearn">
        <div className="bookDetailSectionIntro">
          <p className="bookDetailSectionLabel eyebrow">What You&apos;ll Learn</p>
          <h2 className="section-title">{page.learnTitle}</h2>
        </div>

        <div className="bookDetailLearnGrid">
          {page.learn.map((item) => (
            <article key={item} className="bookDetailLearnItem">
              <p className="body">{item}</p>
            </article>
          ))}
        </div>
      </section>

      {page.relatedResources ? (
        <section className="bookDetailRelatedResources">
          <div className="bookDetailSectionIntro">
            <p className="bookDetailSectionLabel eyebrow">Related Resources</p>
            <h2 className="section-title">Free tools to put the ideas to work.</h2>
          </div>

          <div className="bookDetailResourceGrid">
            {page.relatedResources.map((resource) => (
              <Link className="bookDetailResourceLink" href={resource.href} key={resource.href}>
                <span className="eyebrow">Free Resource</span>
                <strong className="section-title">{resource.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bookDetailFaq">
        <div className="bookDetailSectionIntro">
          <p className="bookDetailSectionLabel eyebrow">FAQ</p>
          <h2 className="section-title">{page.faqTitle}</h2>
        </div>

        <div className="bookDetailFaqList">
          {page.faq.map((item) => (
            <article key={item.question} className="bookDetailFaqItem">
              <h3 className="section-title">{item.question}</h3>
              <p className="body">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bookDetailFinalCta" id="buy">
        <p className="bookDetailSectionLabel eyebrow">{page.finalLabel}</p>
        <h2 className="section-title">{page.finalTitle}</h2>
        <p className="body-large">{page.finalBody}</p>
        <div className="bookDetailHeroActions">
          {book.amazonUrl ? (
            <AmazonBookLink bookTitle={book.title} href={book.amazonUrl} />
          ) : null}
        </div>
      </section>

      <Newsletter />

      <Footer />
    </main>
  );
}
