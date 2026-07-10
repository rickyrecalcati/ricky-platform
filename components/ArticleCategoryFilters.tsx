"use client";

import { startTransition, useMemo, useOptimistic } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Article } from "../data/articles";
import ArticleCard from "./ArticleCard";

type ArticleCategoryFiltersProps = {
  activeCategory: string;
  articles: Article[];
  categories: string[];
};

function normalizeCategory(category: string) {
  return category.toLowerCase();
}

export default function ArticleCategoryFilters({
  activeCategory,
  articles,
  categories,
}: ArticleCategoryFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.toLowerCase() ?? activeCategory;
  const [selectedCategory, setSelectedCategory] = useOptimistic(urlCategory);

  const filteredArticles = useMemo(() => {
    return selectedCategory
      ? articles.filter(
          (article) => article.category.toLowerCase() === selectedCategory,
        )
      : articles;
  }, [articles, selectedCategory]);

  function updateCategory(category: string) {
    const nextCategory = selectedCategory === category ? "" : category;
    startTransition(() => {
      setSelectedCategory(nextCategory);
      router.push(nextCategory ? `${pathname}?category=${nextCategory}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <>
      <div className="articlesCategoryStrip" aria-label="Article categories">
        <button
          aria-pressed={!selectedCategory}
          className={`eyebrow articlesCategoryPill${
            !selectedCategory ? " articlesCategoryPillActive" : ""
          }`}
          onClick={() => updateCategory("")}
          type="button"
        >
          All
        </button>

        {categories.map((category) => {
          const normalizedCategory = normalizeCategory(category);
          const isActive = selectedCategory === normalizedCategory;

          return (
            <button
              aria-pressed={isActive}
              className={`eyebrow articlesCategoryPill${
                isActive ? " articlesCategoryPillActive" : ""
              }`}
              key={category}
              onClick={() => updateCategory(normalizedCategory)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredArticles.length ? (
        <div className="articlesGrid">
          {filteredArticles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      ) : (
        <div className="articlesEmptyState">
          <p className="eyebrow">No Articles Found</p>
          <h2 className="section-title">Nothing is published in this category yet.</h2>
          <p className="body">
            Reset the filter to view all articles across business, operations,
            finance and life.
          </p>
        </div>
      )}
    </>
  );
}
