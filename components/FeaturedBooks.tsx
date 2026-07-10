import Link from "next/link";
import { books } from "../data/books";
import "./FeaturedBooks.css";

export default function FeaturedBooks() {
  return (
    <section className="featuredBooks premiumSection">
      <div className="featuredHeader premiumReveal">
        <p className="eyebrow">Featured Books</p>
        <h2 className="section-title">Practical guides, inspiring stories and timeless ideas.</h2>
      </div>

      <div className="bookGrid">
        {books.map((book) => (
          <article className="bookCard premiumReveal premiumRevealDelay" key={book.title}>
            <div className="miniCover">
              <span className="eyebrow">{book.category}</span>
              <strong className="section-title">{book.title}</strong>
            </div>

            <div className="bookCardBody">
              <p className="bookCategoryLabel eyebrow">{book.category}</p>
              <h3 className="section-title">{book.title}</h3>
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
