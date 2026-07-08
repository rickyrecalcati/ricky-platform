import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ResourceCard from "../../components/ResourceCard";
import {
  getResourcesByCategory,
  resourceCategories,
} from "../../data/resources";
import "./resources.css";

export default function ResourcesPage() {
  return (
    <main>
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
