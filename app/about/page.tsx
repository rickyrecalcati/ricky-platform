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
    "Learn about Ricky Recalcati, a Sydney-based operations leader, entrepreneur, author and systems thinker.",
  path: "/about",
});

const experienceItems = [
  {
    title: "Hospitality",
    text: "Where I learned that every great customer experience begins with great systems.",
  },
  {
    title: "Operations",
    text: "Where I learned that measuring the right things changes everything.",
  },
  {
    title: "Writing",
    text: "Where I discovered that stories can teach lessons no spreadsheet ever could.",
  },
];

const timelineItems = [
  "Hospitality",
  "Operations Leadership",
  "Logistics",
  "Entrepreneurship",
  "Author",
];

const philosophyItems = [
  {
    title: "Build Better Businesses",
    text: "A business should not depend on heroic effort. It should depend on good systems.",
  },
  {
    title: "Make Smarter Decisions",
    text: "Better decisions compound quietly over time.",
  },
  {
    title: "Create More Freedom",
    text: "The point of better systems is not more work. It is more room to think, build and live.",
  },
  {
    title: "Tell Unforgettable Stories",
    text: "Stories help us understand risk, ambition, consequence and change.",
  },
];

const platformItems = [
  {
    title: "Books",
    text: "Practical guides for operators and intelligent fiction for readers who want stories with consequence.",
  },
  {
    title: "Articles",
    text: "Clear thinking on business, systems, decision-making and the lessons hidden inside daily work.",
  },
  {
    title: "Resources",
    text: "Tools, checklists and frameworks people can use, not just read once and forget.",
  },
  {
    title: "Future tools",
    text: "AI workflows and digital products that help creators and operators move from thinking to action faster.",
  },
];

const currentlyItems = [
  "Based in Sydney, Australia",
  "Writing across business, operations and fiction",
  "Improving operational systems in recycling and logistics",
  "Exploring AI workflows for creators and operators",
];

const writingWorlds = [
  {
    title: "Business and operations",
    text: "Books and resources that help readers build better businesses, make clearer decisions and apply systems in the real world.",
  },
  {
    title: "Intelligent fiction",
    text: "Stories that give readers a different kind of escape while exploring risk, ambition, consequence and change.",
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
            Practical experience. Clear thinking. Stories worth keeping.
          </h1>
          <p className="body-large">
            I have spent more than 15 years building, improving and scaling
            businesses. Along the way I discovered that the same principles
            that build great companies also shape great stories: clarity,
            systems and constant improvement.
          </p>
        </div>

        <div className="aboutPageSignal premiumReveal premiumRevealDelay" aria-label="Ricky Recalcati profile summary">
          <span className="eyebrow">Systems Thinking</span>
          <strong className="section-title">Business, better decisions and stories worth remembering.</strong>
          <p className="body">
            This platform exists to turn practical experience into books,
            articles, resources and tools people can actually use.
          </p>
        </div>
      </section>

      <section className="aboutPageExperience">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">What Shaped My Thinking</p>
          <h2 className="section-title">The lessons came from real work, not theory.</h2>
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
          <p className="eyebrow">Philosophy</p>
          <h2 className="section-title">The platform is built around applied thinking.</h2>
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
          <h2 className="section-title">This is where the work becomes useful.</h2>
          <p className="body-large">
            This website is not simply an author website. It is where Ricky
            shares books, articles, operational frameworks, AI workflows,
            practical resources and lessons learned throughout his career.
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
          <h2 className="section-title">Two different worlds. One common thread.</h2>
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
          Read what Ricky is building.
        </h2>
        <p className="body-large">
          Explore the books or join the newsletter for thoughtful, practical
          ideas on business, systems, operations and storytelling.
        </p>
        <p className="aboutPageClosingLine section-title">
          Better systems build better businesses. Better stories build better people.
        </p>
        <div className="aboutPageActions">
          <Link className="luxuryButton luxuryButtonPrimary" href="/books">
            Explore Books
          </Link>
          <Link className="luxuryButton luxuryButtonSecondary" href="/#newsletter">
            Join the Newsletter
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
