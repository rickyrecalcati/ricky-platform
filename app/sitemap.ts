import type { MetadataRoute } from "next";
import { articles } from "../data/articles";
import { books } from "../data/books";
import { resources } from "../data/resources";
import { absoluteUrl } from "../lib/seo";

const STATIC_CONTENT_LAST_MODIFIED = new Date("2026-07-15");
const BOOK_CONTENT_LAST_MODIFIED = new Date("2026-07-15");
const RESOURCE_CONTENT_LAST_MODIFIED = new Date("2026-07-15");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/books"),
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/articles"),
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/resources"),
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const bookRoutes = books.map((book) => ({
    url: absoluteUrl(`/books/${book.slug}`),
    lastModified: BOOK_CONTENT_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: new Date(article.dateModified ?? article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const resourceRoutes = resources.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    lastModified: RESOURCE_CONTENT_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...bookRoutes, ...articleRoutes, ...resourceRoutes];
}
