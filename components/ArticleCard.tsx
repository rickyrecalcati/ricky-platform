import Link from "next/link";
import type { Article } from "../data/articles";
import "./ArticleCard.css";

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      className="articleCardLink premiumReveal premiumRevealDelay"
      href={`/articles/${article.slug}`}
      aria-label={`Read ${article.title}`}
    >
      <article className="articleCard">
        <div className="articleCardMeta">
          <span className="articleCardCategory eyebrow">{article.category}</span>
          <span>{article.readingTime}</span>
        </div>

        <h2 className="section-title">{article.title}</h2>
        <p className="body">{article.excerpt}</p>

        <div className="articleCardFooter">
          <time dateTime={article.date}>
            {new Intl.DateTimeFormat("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(article.date))}
          </time>
          <span>Read article</span>
        </div>
      </article>
    </Link>
  );
}
