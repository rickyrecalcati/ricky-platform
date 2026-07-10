import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import BookCard from "../../components/BookCard";
import { books } from "../../data/books";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../lib/seo";
import "./books.css";

export const metadata = createPageMetadata({
  title: "Books",
  description:
    "Explore Ricky Recalcati's practical business series, personal growth books and intelligent fiction.",
  path: "/books",
});

export default function BooksPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Books", path: "/books" },
            ]),
          ),
        }}
      />
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
