import Link from "next/link";
import QuoteRotator from "./QuoteRotator";
import "./MeetRicky.css";

const platformPillars = [
  "Build stronger companies",
  "Improve judgement",
  "Create more room to think",
  "Use experience well",
];

export default function MeetRicky() {
  return (
    <section className="meetRicky premiumSection" aria-labelledby="meet-ricky-title">
      <div className="meetRickyContent premiumReveal">
        <p className="eyebrow">Meet Ricky</p>
        <h2 id="meet-ricky-title" className="section-title">
          Operator, author and practical thinker.
        </h2>

        <div className="meetRickyText">
          <p className="body-large">
            Ricky Recalcati is an operations leader and author based in Sydney.
          </p>
          <p className="body-large">
            Over more than 15 years across hospitality, logistics and recycling,
            he has learned how clearer routines, sharper measures and steady
            leadership change the way a business feels to run.
          </p>
          <p className="body-large">
            Today he writes business books and useful field notes from the work
            that shaped his career.
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

      <div className="meetRickyQuotePanel premiumReveal premiumRevealDelay">
        <QuoteRotator />
      </div>
    </section>
  );
}
