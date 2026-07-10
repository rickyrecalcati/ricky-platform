import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { articles } from "../data/articles";
import "./LatestArticles.css";

const latestArticles = [...articles]
  .sort((firstArticle, secondArticle) => {
    return (
      new Date(secondArticle.date).getTime() -
      new Date(firstArticle.date).getTime()
    );
  })
  .slice(0, 3);

export default function LatestArticles() {
  return (
    <section className="latestArticles premiumSection" aria-labelledby="latest-articles-title">
      <div className="latestArticlesHeader premiumReveal">
        <div>
          <p className="eyebrow">Latest Articles</p>
          <h2 id="latest-articles-title" className="section-title">
            Clear thinking for better work and better decisions.
          </h2>
        </div>

        <Link className="luxuryButton luxuryButtonSecondary" href="/articles">
          View all articles
        </Link>
      </div>

      <div className="latestArticlesGrid">
        {latestArticles.map((article) => (
          <ArticleCard article={article} key={article.slug} />
        ))}
      </div>
    </section>
  );
}
