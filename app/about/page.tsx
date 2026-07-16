import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  personJsonLd,
  stringifyJsonLd,
} from "../../lib/seo";
import "./about.css";

export const metadata = createPageMetadata({
  title: "About Ricky Recalcati",
  description:
    "Learn about Ricky Recalcati, a Sydney-based operations leader and author writing about business, operations, investing and decision making.",
  path: "/about",
});

const experienceItems = [
  {
    title: "Hospitality",
    text: "Where I learned how much the guest experience depends on preparation, standards and the way a team works under pressure.",
  },
  {
    title: "Operations leadership",
    text: "Where I moved from doing the work to improving how the work was planned, measured and led across teams.",
  },
  {
    title: "Recycling and logistics",
    text: "Where I work on collection networks, contractor performance, reporting and day-to-day operating discipline.",
  },
];

const timelineItems = [
  "Hospitality",
  "Operations Leadership",
  "Logistics",
  "Recycling",
  "Entrepreneurship",
  "Author",
];

const philosophyItems = [
  {
    title: "Reduce confusion",
    text: "Leadership should make the work easier to understand. If people are guessing what matters, the problem usually starts higher up.",
  },
  {
    title: "Support growth properly",
    text: "Growth only helps when the operation underneath it can carry the weight. Otherwise, scale just exposes the weak points faster.",
  },
  {
    title: "Stay close to the work",
    text: "The best decisions usually come from understanding what actually happens on the floor, in the truck, with the customer or inside the team.",
  },
  {
    title: "Keep solutions usable",
    text: "A simple fix that people use is worth more than a polished framework that never leaves the meeting room.",
  },
];

const platformItems = [
  {
    title: "Books",
    text: "Short, useful books on operations, AI, leadership and personal growth.",
  },
  {
    title: "Articles",
    text: "Long-form essays on business, leadership, investing and how good operators think.",
  },
  {
    title: "Business Breakdown",
    text: "A Wednesday series studying companies, operating models and the details competitors struggle to copy.",
  },
  {
    title: "Balance Sheet",
    text: "A Monday note on markets, business and investing, written for readers who prefer context over noise.",
  },
  {
    title: "Resources",
    text: "Free templates, checklists and worksheets built for people who want to put ideas into motion.",
  },
];

const currentlyItems = [
  "Based in Sydney, Australia",
  "Writing across business, operations, investing and personal growth",
  "Improving collection networks, reporting and contractor performance",
  "Exploring useful AI workflows for operators, creators and small teams",
];

const writingWorlds = [
  {
    title: "Operations and leadership",
    text: "What happens when teams, processes, customers, contractors and growth all meet in the real world.",
  },
  {
    title: "Investing and decision making",
    text: "How long-term thinking, ownership and small choices shape the results people eventually live with.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(personJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />
      <Navbar />

      <section className="aboutPageHero premiumSection">
        <div className="aboutPageHeroContent premiumReveal">
          <p className="eyebrow">About Ricky</p>
          <h1 className="display-title">
            I write about the work behind businesses that run well.
          </h1>
          <p className="body-large">
            Most of my work has been about helping businesses operate with less
            confusion and more consistency. Sometimes that means clearer
            routines. Sometimes it means stronger teams, cleaner reporting,
            steadier leadership or simply making a decision with incomplete
            information and owning the result.
          </p>
          <p className="body-large">
            RickyRecalcati.com is where I share the lessons I have found useful
            across hospitality, operations, logistics, recycling, investing and
            personal growth.
          </p>
        </div>

        <div className="aboutPageSignal premiumReveal premiumRevealDelay" aria-label="Ricky Recalcati profile summary">
          <span className="eyebrow">Based in Sydney</span>
          <strong className="section-title">Operations leader, entrepreneur and author.</strong>
          <p className="body">
            Around 15 years of hands-on and leadership work across hospitality,
            recycling, logistics and contractor management.
          </p>
        </div>
      </section>

      <section className="aboutPageExperience">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Background</p>
          <h2 className="section-title">The lessons came from the floor, not a playbook.</h2>
          <p className="body-large">
            My career started in hospitality, close to customers and close to
            the pressure of service. Over time, the work moved into broader
            operational leadership: running teams, fixing broken processes,
            managing growth and trying to make performance more consistent
            without adding unnecessary noise.
          </p>
          <p className="body-large">
            That work has since stretched across recycling, logistics and
            contractor management. Different industries, same pattern. The
            details change, but the hard problems often come back to how the
            work is designed, how people communicate and what leaders choose to
            measure.
          </p>
        </div>

        <div className="aboutPageCardGrid">
          {experienceItems.map((item) => (
            <article className="aboutPageCard" key={item.title}>
              <span className="aboutPageRule" />
              <h3 className="section-title">{item.title}</h3>
              <p className="body">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutPageTimeline" aria-label="Ricky Recalcati career timeline">
        <div className="aboutPageTimelineTrack">
          {timelineItems.map((item) => (
            <div className="aboutPageTimelineItem" key={item}>
              <span />
              <p className="eyebrow">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="aboutPagePhilosophy premiumSection">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">How I Think About Business</p>
          <h2 className="section-title">Good operations should make the work feel less chaotic.</h2>
          <p className="body-large">
            I do not think most businesses need more theatre around leadership.
            They need fewer unclear handovers, fewer duplicated reports, fewer
            meetings that create no decision and fewer processes that only one
            person understands.
          </p>
          <p className="body-large">
            Useful improvement usually begins by watching how the work actually
            happens. From there, the aim is to remove friction, set standards
            people can follow and build enough rhythm that the business does not
            depend on constant heroics.
          </p>
        </div>

        <div className="aboutPagePrinciples" aria-label="Ricky Recalcati philosophy">
          {philosophyItems.map((item) => (
            <article key={item.title}>
              <h3 className="section-title">{item.title}</h3>
              <p className="body">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutPagePlatform">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">The Platform</p>
          <h2 className="section-title">Why this site exists.</h2>
          <p className="body-large">
            I built this site to collect the parts of my work that might be
            useful to someone else: books, articles, Business Breakdown,
            Balance Sheet and free resources. Some pieces are about operations.
            Some are about leadership, investing, decision making or personal
            growth.
          </p>
          <p className="body-large">
            The common thread is usefulness. If something appears here, it
            should help a reader think more carefully, run something more
            calmly or make a choice with a little more discipline.
          </p>
        </div>

        <div className="aboutPagePlatformGrid">
          {platformItems.map((item) => (
            <article className="aboutPagePlatformItem" key={item.title}>
              <h3 className="section-title">{item.title}</h3>
              <p className="body">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutPageWriting premiumSection">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Writing</p>
          <h2 className="section-title">The subjects are connected by how people make things work.</h2>
        </div>

        <div className="aboutPageWritingGrid">
          {writingWorlds.map((item) => (
            <article className="aboutPageWritingItem" key={item.title}>
              <h3 className="section-title">{item.title}</h3>
              <p className="body">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutPageCurrently">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Currently</p>
          <h2 className="section-title">What Ricky is focused on now.</h2>
        </div>

        <div className="aboutPageCurrentlyList">
          {currentlyItems.map((item) => (
            <p className="body-large" key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="aboutPageFinalCta">
        <p className="eyebrow">Start Here</p>
        <h2 className="section-title">
          Start with the work that is useful to you.
        </h2>
        <p className="body-large">
          Read the books, browse the articles, download a resource or join
          Balance Sheet. Take what helps and leave the rest.
        </p>
        <p className="aboutPageClosingLine section-title">
          The point is simple: share what I have learned from real work, and
          make it useful enough to return to.
        </p>
        <div className="aboutPageActions">
          <Link className="luxuryButton luxuryButtonPrimary" href="/books">
            Explore Books
          </Link>
          <Link className="luxuryButton luxuryButtonSecondary" href="/#newsletter">
            Join Balance Sheet
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
