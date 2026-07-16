import Link from "next/link";
import ResourceCard from "./ResourceCard";
import { resources } from "../data/resources";
import "./FreeResources.css";

const featuredResources = resources.slice(0, 3);

export default function FreeResources() {
  return (
    <section className="freeResources premiumSection" aria-labelledby="free-resources-title">
      <div className="freeResourcesHeader premiumReveal">
        <div>
          <p className="eyebrow">Free Resources</p>
          <h2 id="free-resources-title" className="section-title">
            Useful tools for the work in front of you.
          </h2>
          <p className="body-large">
            Templates, worksheets and checklists for reviews, planning,
            operations and personal reflection.
          </p>
        </div>

        <Link className="luxuryButton luxuryButtonSecondary" href="/resources">
          Browse all resources
        </Link>
      </div>

      <div className="freeResourcesGrid">
        {featuredResources.map((resource) => (
          <ResourceCard resource={resource} key={resource.slug} />
        ))}
      </div>
    </section>
  );
}
