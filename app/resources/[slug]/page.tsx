import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import { getResourceBySlug, resources } from "../../../data/resources";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  resourceJsonLd,
  stringifyJsonLd,
} from "../../../lib/seo";
import "./resource.css";

type ResourcePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return createPageMetadata({
    title: resource.title,
    description: resource.description,
    path: `/resources/${resource.slug}`,
  });
}

function ResourceList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="resourceDetailPanel">
      <h2 className="section-title">{title}</h2>
      <ul>
        {items.map((item) => (
          <li className="body" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <section className="resourceDetailPanel">
      <h2 className="section-title">{title}</h2>
      <div className="resourceRelatedList">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(resourceJsonLd(resource)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
              { name: resource.title, path: `/resources/${resource.slug}` },
            ]),
          ),
        }}
      />
      <Navbar />

      <article className="resourceDetail">
        <header className="resourceDetailHero premiumReveal">
          <div>
            <p className="eyebrow">{resource.category}</p>
            <h1 className="display-title">{resource.title}</h1>
            <p className="body-large">{resource.heroDescription}</p>
          </div>

          <aside className="resourceDownloadPanel" aria-label="Resource access">
            <p className="eyebrow">Free • {resource.fileType}</p>
            <p className="body">
              Resources are always free. No login, newsletter signup or pop-up
              required.
            </p>
            {resource.fileUrl ? (
              <a
                className="luxuryButton luxuryButtonPrimary"
                href={resource.fileUrl}
                download
              >
                Get Resource
              </a>
            ) : (
              <span className="resourceComingSoon">Coming Soon</span>
            )}
          </aside>
        </header>

        <section className="resourceDescription">
          <p className="body-large">{resource.description}</p>
        </section>

        <div className="resourceDetailGrid">
          <ResourceList title="Who It Is For" items={resource.whoFor} />
          <ResourceList title="What Is Included" items={resource.included} />
          <ResourceList title="Works Well With" items={resource.worksWellWith} />
          <RelatedLinks title="Related Books" links={resource.relatedBooks} />
          <RelatedLinks title="Related Articles" links={resource.relatedArticles} />
        </div>
      </article>

      <Footer />
    </main>
  );
}
