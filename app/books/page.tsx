import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { books } from "../../data/books";
import "./books.css";

export default function BooksPage() {
  return (
    <main>
      <Navbar />

      <section className="booksPage">
        <div className="booksHero">
          <p>Books</p>
          <h1>Practical guides, compelling stories and ideas worth keeping.</h1>
        </div>

        <div className="booksGrid">
          {books.map((book) => (
            <article className="booksCard" key={book.slug}>
              <div className="booksCover">
                <span>{book.category}</span>
                <strong>{book.title}</strong>
              </div>

              <div className="booksCardBody">
                <p className="booksStatus">{book.status}</p>
                <h2>{book.title}</h2>
                <p>{book.description}</p>
                <Link href={book.slug === "scaling-hospitality" ? "/books/scaling-hospitality" : "#"}>
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
