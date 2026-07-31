import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ResourceCategoryGroup from "../../components/ResourceCategoryGroup";
import {
  getResourcesByCategory,
  resourceCategories,
} from "../../data/resources";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  itemListJsonLd,
  stringifyJsonLd,
} from "../../lib/seo";
import "./resources.css";

export const metadata = createPageMetadata({
  title: "Resources",
  description:
    "Download free practical resources, templates and worksheets for business systems, decision-making, investing and personal growth.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            itemListJsonLd(
              "Free resources by Ricky Recalcati",
              "/resources",
              resourceCategories.flatMap((category) =>
                getResourcesByCategory(category).map((resource) => ({
                  name: resource.title,
                  path: `/resources/${resource.slug}`,
                  description: resource.description,
                })),
              ),
            ),
          ),
        }}
      />
      <Navbar />

      <section className="resourcesPage premiumSection">
        <div className="resourcesHero premiumReveal">
          <p className="eyebrow">Resources</p>
          <h1 className="display-title">
            Free tools for clearer reviews, planning and reflection.
          </h1>
          <p className="body-large">
            A free library of templates, checklists and worksheets you can use
            without a login, a gate or a pop-up.
          </p>
        </div>

        <div className="resourcesLibrary">
          {resourceCategories.map((category) => {
            const categoryResources = getResourcesByCategory(category);

            return (
              <ResourceCategoryGroup
                category={category}
                key={category}
                resources={categoryResources}
              />
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
