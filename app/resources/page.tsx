import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ResourceCard from "../../components/ResourceCard";
import {
  getResourcesByCategory,
  resourceCategories,
} from "../../data/resources";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../lib/seo";
import "./resources.css";

export const metadata = createPageMetadata({
  title: "Resources",
  description:
    "Download free practical resources, templates and worksheets for business systems, decision-making, AI workflows and personal growth.",
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
      <Navbar />

      <section className="resourcesPage premiumSection">
        <div className="resourcesHero premiumReveal">
          <p className="eyebrow">Resources</p>
          <h1 className="display-title">
            Practical tools for clearer work, better decisions and calmer growth.
          </h1>
          <p className="body-large">
            A free library of templates, checklists and worksheets built to help
            people act immediately. No login. No gate. No pop-ups.
          </p>
        </div>

        <div className="resourcesLibrary">
          {resourceCategories.map((category) => {
            const categoryResources = getResourcesByCategory(category);

            return (
              <section className="resourceCategoryGroup" key={category}>
                <div className="resourceCategoryHeader">
                  <p className="eyebrow">{category}</p>
                  <span>{categoryResources.length} resources</span>
                </div>

                <div className="resourcesGrid">
                  {categoryResources.map((resource) => (
                    <ResourceCard resource={resource} key={resource.slug} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
