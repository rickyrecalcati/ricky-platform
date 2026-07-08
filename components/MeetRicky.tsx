import Link from "next/link";
import "./MeetRicky.css";

const platformPillars = [
  "Build better businesses",
  "Make smarter decisions",
  "Create more freedom",
  "Discover unforgettable stories",
];

export default function MeetRicky() {
  return (
    <section className="meetRicky premiumSection" aria-labelledby="meet-ricky-title">
      <div className="meetRickyContent premiumReveal">
        <p className="eyebrow">Meet Ricky</p>
        <h2 id="meet-ricky-title" className="section-title">
          Operator, author and systems thinker.
        </h2>

        <div className="meetRickyText">
          <p className="body-large">
            Ricky Recalcati is an operations leader, author and systems thinker
            based in Sydney.
          </p>
          <p className="body-large">
            Over the past 15+ years he has helped businesses improve operations,
            build better systems and make smarter decisions.
          </p>
          <p className="body-large">
            Today he writes practical business books, intelligent fiction and
            shares the frameworks, tools and lessons that have shaped his career.
          </p>
        </div>

        <ul className="meetRickyPillars" aria-label="The platform exists to help people">
          {platformPillars.map((pillar) => (
            <li className="body" key={pillar}>
              {pillar}
            </li>
          ))}
        </ul>

        <div className="meetRickyActions">
          <Link className="luxuryButton luxuryButtonPrimary" href="/about">
            About Ricky
          </Link>
          <Link className="luxuryButton luxuryButtonSecondary" href="/books">
            Browse Books
          </Link>
        </div>
      </div>

      <div className="meetRickyPhotoSpace premiumReveal premiumRevealDelay" aria-hidden="true" />
    </section>
  );
}
