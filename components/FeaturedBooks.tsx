import Link from "next/link";
import { books } from "../data/books";
import "./FeaturedBooks.css";

function bookCardLabel(book: (typeof books)[number]) {
  if (book.series && book.booksInSeries) {
    return `${book.booksInSeries}-ebook series`;
  }

  return "Book";
}

export default function FeaturedBooks() {
  const featuredBooks = books.filter((book) => book.series);

  return (
    <section className="featuredBooks premiumSection">
      <div className="featuredHeader premiumReveal">
        <p className="eyebrow">Featured Books</p>
        <h2 className="section-title">Series for operators, creators and long-term builders.</h2>
      </div>

      <div className="bookGrid">
        {featuredBooks.map((book) => (
          <article className="bookCard premiumReveal premiumRevealDelay" key={book.title}>
            <div className="miniCover">
              <span className="eyebrow">{book.category}</span>
              <strong className="section-title">{book.title}</strong>
            </div>

            <div className="bookCardBody">
              <p className="bookCategoryLabel eyebrow">{book.category}</p>
              <p className="featuredBookFormat premiumBookFormat eyebrow">
                {bookCardLabel(book)}
              </p>
              <p className="body">{book.description}</p>
              <Link href={`/books/${book.slug}`}>
                {book.series ? "Explore Series" : "Learn More"} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
