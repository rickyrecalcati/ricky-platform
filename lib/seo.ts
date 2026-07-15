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

type ItemListEntry = {
  name: string;
  path: string;
  description?: string;
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
    inLanguage: "en-AU",
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
      "Investing",
      "Personal growth",
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

export function itemListJsonLd(
  name: string,
  path: string,
  items: ItemListEntry[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#item-list`,
    name,
    url: absoluteUrl(path),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
      description: item.description,
    })),
  };
}

export function bookJsonLd(book: Book) {
  const url = absoluteUrl(`/books/${book.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": book.series ? ["Book", "CreativeWorkSeries"] : "Book",
    "@id": `${url}#book`,
    name: book.title,
    url,
    description: book.description,
    image: absoluteUrl(ogImagePath),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    datePublished: book.publicationYear,
    bookFormat: book.format ? `https://schema.org/${book.format}` : undefined,
    genre: book.category,
    numberOfItems: book.series ? book.booksInSeries : undefined,
    offers: book.amazonUrl
      ? {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: book.amazonUrl,
        }
      : undefined,
    sameAs: book.amazonUrl ? [book.amazonUrl] : undefined,
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(`/articles/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.metaDescription ?? article.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: article.date,
    dateModified: article.dateModified ?? article.date,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    image: absoluteUrl(ogImagePath),
    articleSection: article.category,
    keywords: article.tags,
    inLanguage: "en-AU",
    isPartOf: article.series
      ? {
          "@type": "Periodical",
          name: article.series,
        }
      : undefined,
    issueNumber: article.issueNumber,
  };
}

export function resourceJsonLd(resource: Resource) {
  const url = absoluteUrl(`/resources/${resource.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": resource.fileUrl ? "DigitalDocument" : "CreativeWork",
    "@id": `${url}#resource`,
    name: resource.title,
    url,
    description: resource.description,
    image: absoluteUrl(ogImagePath),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    creator: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    isAccessibleForFree: true,
    learningResourceType: resource.fileType,
    genre: resource.category,
    encodingFormat: resource.fileType === "PDF" ? "application/pdf" : undefined,
    contentUrl: resource.fileUrl ? absoluteUrl(resource.fileUrl) : undefined,
    inLanguage: "en-AU",
  };
}
