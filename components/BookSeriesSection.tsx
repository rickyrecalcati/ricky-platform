import type { BookSeriesVolume } from "../data/books";

type BookSeriesSectionProps = {
  eyebrow: string;
  title: string;
  books: BookSeriesVolume[];
};

export default function BookSeriesSection({
  eyebrow,
  title,
  books,
}: BookSeriesSectionProps) {
  return (
    <section className="bookDetailDarkSection">
      <div className="bookDetailSectionIntro">
        <p className="bookDetailSectionLabel eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="bookDetailSeriesGrid">
        {books.map((seriesBook) => (
          <article className="bookDetailSeriesItem" key={seriesBook.label}>
            <p className="eyebrow">{seriesBook.label}</p>
            <h3 className="section-title">{seriesBook.title}</h3>
            {seriesBook.subtitle ? (
              <p className="bookDetailSeriesSubtitle body">
                {seriesBook.subtitle}
              </p>
            ) : null}
            <p className="body">{seriesBook.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
