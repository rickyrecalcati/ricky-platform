import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ArticleCard from "../../components/ArticleCard";
import { articles } from "../../data/articles";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../lib/seo";
import "./articles.css";

export const metadata = createPageMetadata({
  title: "Articles",
  description:
    "Read Ricky Recalcati's essays on business systems, operations, finance, life and better decision-making.",
  path: "/articles",
});

export default function ArticlesPage() {
  const categories = [...new Set(articles.map((article) => article.category))];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Articles", path: "/articles" },
            ]),
          ),
        }}
      />
      <Navbar />

      <section className="articlesPage premiumSection">
        <div className="articlesHero premiumReveal">
          <p className="eyebrow">Articles</p>
          <h1 className="display-title">
            Clear thinking on business, systems and better decisions.
          </h1>
          <p className="body-large">
            Practical essays on operations, systems, decision-making and the
            lessons behind sustainable work.
          </p>
        </div>

        <div className="articlesCategoryStrip" aria-label="Article categories">
          {categories.map((category) => (
            <span className="eyebrow" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="articlesGrid">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
