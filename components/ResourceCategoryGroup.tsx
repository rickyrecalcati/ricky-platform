"use client";

import { useId, useState } from "react";
import type { Resource, ResourceCategory } from "../data/resources";
import ResourceCard from "./ResourceCard";

type ResourceCategoryGroupProps = {
  category: ResourceCategory;
  resources: Resource[];
};

const INITIAL_RESOURCE_COUNT = 3;

export default function ResourceCategoryGroup({
  category,
  resources,
}: ResourceCategoryGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();
  const hasMoreResources = resources.length > INITIAL_RESOURCE_COUNT;
  const visibleResources = expanded
    ? resources
    : resources.slice(0, INITIAL_RESOURCE_COUNT);

  return (
    <section className="resourceCategoryGroup">
      <div className="resourceCategoryHeader">
        <div>
          <p className="eyebrow">{category}</p>
          {hasMoreResources ? (
            <span>
              Showing {visibleResources.length} of {resources.length} resources
            </span>
          ) : (
            <span>{resources.length} resources</span>
          )}
        </div>
      </div>

      <div className="resourcesGrid" id={gridId}>
        {visibleResources.map((resource) => (
          <ResourceCard resource={resource} key={resource.slug} />
        ))}
      </div>

      {hasMoreResources ? (
        <button
          aria-controls={gridId}
          aria-expanded={expanded}
          className="resourcesExploreButton"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {expanded ? "Show fewer" : "Explore more"}
        </button>
      ) : null}
    </section>
  );
}
