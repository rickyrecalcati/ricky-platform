import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ArticleCategoryFilters from "../../components/ArticleCategoryFilters";
import { articles } from "../../data/articles";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  itemListJsonLd,
  stringifyJsonLd,
} from "../../lib/seo";
import "./articles.css";

export const metadata = createPageMetadata({
  title: "Articles",
  description:
    "Read Ricky Recalcati's essays on business systems, operations, finance, life and better decision-making.",
  path: "/articles",
});

type ArticlesPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

function getCategoryParam(category?: string | string[]) {
  if (Array.isArray(category)) {
    return category[0]?.toLowerCase() ?? "";
  }

  return category?.toLowerCase() ?? "";
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const activeCategory = getCategoryParam(params?.category);
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            itemListJsonLd(
              "Articles by Ricky Recalcati",
              "/articles",
              articles.map((article) => ({
                name: article.title,
                path: `/articles/${article.slug}`,
                description: article.metaDescription ?? article.excerpt,
              })),
            ),
          ),
        }}
      />
      <Navbar />

      <section className="articlesPage premiumSection">
        <div className="articlesHero premiumReveal">
          <p className="eyebrow">Articles</p>
          <h1 className="display-title">
            Clear writing on business, operations and judgement.
          </h1>
          <p className="body-large">
            Essays on company building, investing, service, leadership and the
            habits behind durable work.
          </p>
        </div>

        <ArticleCategoryFilters
          activeCategory={activeCategory}
          articles={articles}
          categories={categories}
        />
      </section>

      <Footer />
    </main>
  );
}
