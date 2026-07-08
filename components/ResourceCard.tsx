import Link from "next/link";
import type { Resource } from "../data/resources";
import "./ResourceCard.css";

type ResourceCardProps = {
  resource: Resource;
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      className="resourceCardLink premiumReveal premiumRevealDelay"
      href={`/resources/${resource.slug}`}
      aria-label={`Get ${resource.title}`}
    >
      <article className="resourceCard">
        <div className="resourceCardMeta">
          <span className="eyebrow">{resource.category}</span>
          <span>Free • {resource.fileType}</span>
        </div>

        <h3 className="section-title">{resource.title}</h3>
        <p className="body">{resource.description}</p>

        <span className="resourceCardCta">Get Resource</span>
      </article>
    </Link>
  );
}
