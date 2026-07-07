import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import { books, getBookBySlug } from "../../../data/books";
import "./book-page.css";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return books.map((book) => ({
    slug: book.slug,
  }));
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
      <Navbar />

      <section className="bookDetailHero">
        <div className="bookDetailHeroContent">
          <p className="bookDetailEyebrow eyebrow">{page.heroEyebrow}</p>
          <h1 className="display-title">{book.title}</h1>
          <h2 className="bookDetailHeroHeadline section-title">
            {page.heroHeadline}
          </h2>
          <p className="bookDetailHeroText body-large">
            {page.heroDescription}
          </p>

          <div className="bookDetailHeroActions">
            <a className="bookDetailButton bookDetailButtonPrimary" href={page.primaryCta.href}>
              {page.primaryCta.label}
            </a>
            <a className="bookDetailButton bookDetailButtonSecondary" href={page.secondaryCta.href}>
              {page.secondaryCta.label}
            </a>
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

      <section className="bookDetailCreamSection bookDetailLearn" id="sample">
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

      <section className="bookDetailBonus">
        <div>
          <p className="bookDetailSectionLabel eyebrow">{page.bonusLabel}</p>
          <h2 className="section-title">{page.bonusTitle}</h2>
          <p className="body-large">{page.bonusBody}</p>
        </div>
        <a className="bookDetailButton bookDetailButtonSecondary" href={page.bonusCta.href}>
          {page.bonusCta.label}
        </a>
      </section>

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
          <a className="bookDetailButton bookDetailButtonPrimary" href={page.primaryCta.href}>
            {page.primaryCta.label}
          </a>
          <a className="bookDetailButton bookDetailButtonSecondary" href={page.secondaryCta.href}>
            {page.secondaryCta.label}
          </a>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </main>
  );
}
