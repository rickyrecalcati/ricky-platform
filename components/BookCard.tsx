import Link from "next/link";
import type { Book } from "../data/books";
import "./BookCard.css";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const formatLabel = book.series && book.booksInSeries
    ? `${book.booksInSeries}-Book Series`
    : "Standalone Novel";
  const ctaLabel = book.series ? "Explore Series" : "Learn More";

  return (
    <Link
      className="bookCardLink premiumReveal premiumRevealDelay"
      href={`/books/${book.slug}`}
      aria-label={`${ctaLabel} for ${book.title}`}
    >
      <article className="premiumBookCard">
        <div className="premiumBookCover">
          <div className="premiumBookCoverTop">
            <span className="bookBadge bookBadgeDark eyebrow">{book.category}</span>
            <span className="bookBadge bookBadgeLight eyebrow">{book.status}</span>
          </div>

          <strong className="section-title">{book.title}</strong>
        </div>

        <div className="premiumBookBody">
          <div className="premiumBookKicker">
            <span className="premiumBookFormat eyebrow">{formatLabel}</span>
            <span className="premiumBookYear">{book.publicationYear}</span>
          </div>

          <h2 className="section-title">{book.title}</h2>
          <p className="body">{book.description}</p>

          <span className="premiumBookCta">{ctaLabel} →</span>
        </div>
      </article>
    </Link>
  );
}
