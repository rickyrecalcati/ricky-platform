import Link from "next/link";
import "./FeaturedBooks.css";

const books = [
  {
    category: "Business",
    title: "Scaling Hospitality",
    href: "/books/scaling-hospitality",
    description:
      "Practical systems, frameworks and operational habits that help hospitality businesses reduce chaos, improve consistency and scale sustainably.",
  },
  {
    category: "Fiction",
    title: "The Forgotten Cipher",
    href: "#",
    description:
      "A historical thriller where cryptography, hidden history and impossible secrets collide.",
  },
  {
    category: "Life",
    title: "The Second Act",
    href: "#",
    description:
      "Practical guidance and inspiration for building a meaningful next chapter in life.",
  },
];

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
              <Link href={book.href}>Learn More →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
