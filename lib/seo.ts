import type { Metadata } from "next";
import type { Article } from "../data/articles";
import type { Book } from "../data/books";
import type { Resource } from "../data/resources";

export const siteUrl = "https://www.rickyrecalcati.com";
export const siteName = "Ricky Recalcati";
export const defaultTitle =
  "Ricky Recalcati | Books, Articles and Practical Resources";
export const defaultDescription =
  "Books, articles and practical resources on business systems, better decisions, operations and intelligent fiction from Ricky Recalcati.";
export const ogImagePath = "/opengraph-image";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  authors,
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl(ogImagePath);
  const pageTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title: {
      absolute: pageTitle,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteName} editorial platform`,
        },
      ],
      locale: "en_AU",
      type,
      ...(type === "article"
        ? {
            publishedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      creator: "@rickyrecalcati",
    },
  };
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Ricky Recalcati",
    url: siteUrl,
    homeLocation: {
      "@type": "Place",
      name: "Sydney, Australia",
    },
    jobTitle: "Operations leader, entrepreneur and author",
    sameAs: [
      "https://x.com/rickyrecalcati",
      "https://medium.com/@r.recalcati9",
    ],
    knowsAbout: [
      "Operations",
      "Hospitality",
      "Business systems",
      "Decision-making",
      "Writing",
      "AI workflows",
    ],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function bookJsonLd(book: Book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${absoluteUrl(`/books/${book.slug}`)}#book`,
    name: book.title,
    url: absoluteUrl(`/books/${book.slug}`),
    description: book.description,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    datePublished: book.publicationYear,
    bookFormat: book.format ? `https://schema.org/${book.format}` : undefined,
    genre: book.category,
    isPartOf: book.series
      ? {
          "@type": "BookSeries",
          name: book.title,
          numberOfItems: book.booksInSeries,
        }
      : undefined,
    offers: book.amazonUrl
      ? {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: book.amazonUrl,
        }
      : undefined,
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/articles/${article.slug}`)}#article`,
    headline: article.title,
    description: article.metaDescription ?? article.excerpt,
    url: absoluteUrl(`/articles/${article.slug}`),
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    image: absoluteUrl(ogImagePath),
    articleSection: article.category,
    keywords: article.tags,
  };
}

export function resourceJsonLd(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/resources/${resource.slug}`)}#resource`,
    name: resource.title,
    url: absoluteUrl(`/resources/${resource.slug}`),
    description: resource.description,
    creator: {
      "@id": `${siteUrl}/#person`,
    },
    isAccessibleForFree: true,
    learningResourceType: resource.fileType,
  };
}
