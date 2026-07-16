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

const BALANCE_SHEET_FILTER = "balance-sheet";
const BUSINESS_BREAKDOWN_FILTER = "business-breakdown";

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
    if (!selectedCategory) {
      return articles;
    }

    if (selectedCategory === BALANCE_SHEET_FILTER) {
      return articles.filter((article) => article.series === "Balance Sheet");
    }

    if (selectedCategory === BUSINESS_BREAKDOWN_FILTER) {
      return articles.filter(
        (article) => article.series === "Business Breakdown",
      );
    }

    return articles.filter(
      (article) => article.category.toLowerCase() === selectedCategory,
    );
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

        <div className="articlesSeriesFilter">
          <span className="articlesWeeklyLabel eyebrow">Weekly</span>
          <button
            aria-pressed={selectedCategory === BALANCE_SHEET_FILTER}
            className={`eyebrow articlesCategoryPill articlesCategoryPillSeries${
              selectedCategory === BALANCE_SHEET_FILTER
                ? " articlesCategoryPillActive"
                : ""
            }`}
            onClick={() => updateCategory(BALANCE_SHEET_FILTER)}
            type="button"
          >
            Balance Sheet
          </button>
        </div>

        <div className="articlesSeriesFilter">
          <span className="articlesWeeklyLabel eyebrow">Weekly</span>
          <button
            aria-pressed={selectedCategory === BUSINESS_BREAKDOWN_FILTER}
            className={`eyebrow articlesCategoryPill articlesCategoryPillSeries${
              selectedCategory === BUSINESS_BREAKDOWN_FILTER
                ? " articlesCategoryPillActive"
                : ""
            }`}
            onClick={() => updateCategory(BUSINESS_BREAKDOWN_FILTER)}
            type="button"
          >
            Business Breakdown
          </button>
        </div>

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
