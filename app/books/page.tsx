import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { books } from "../../data/books";
import "./books.css";

export default function BooksPage() {
  return (
    <main>
      <Navbar />

      <section className="booksPage premiumSection">
        <div className="booksHero premiumReveal">
          <p className="eyebrow">Books</p>
          <h1 className="display-title">Practical guides, compelling stories and ideas worth keeping.</h1>
        </div>

        <div className="booksGrid">
          {books.map((book) => (
            <article className="booksCard premiumReveal premiumRevealDelay" key={book.slug}>
              <div className="booksCover">
                <span className="eyebrow">{book.category}</span>
                <strong className="section-title">{book.title}</strong>
              </div>

              <div className="booksCardBody">
                <p className="booksStatus eyebrow">{book.status}</p>
                <h2 className="section-title">{book.title}</h2>
                <p className="body">{book.description}</p>
                <Link href={`/books/${book.slug}`}>
                  Learn More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
