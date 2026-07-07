import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import BookCard from "../../components/BookCard";
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
            <BookCard book={book} key={book.slug} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
