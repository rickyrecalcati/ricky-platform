import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import "./about.css";

const experienceItems = [
  {
    title: "Hospitality",
    text: "Ricky's career started in hospitality, where he learned that exceptional customer experiences are built on great systems, not luck.",
  },
  {
    title: "Operations leadership",
    text: "He later moved into operations leadership, managing multi-site businesses, improving processes, leading teams and lifting performance through practical systems.",
  },
  {
    title: "Recycling",
    text: "Today he works in the recycling industry, helping improve collection networks, contractor performance, reporting and operational efficiency.",
  },
  {
    title: "Writing",
    text: "Alongside his professional career, Ricky writes books across practical business and operations, and intelligent fiction.",
  },
];

const philosophyItems = [
  "Better systems create better businesses.",
  "Better decisions create better lives.",
  "Knowledge becomes valuable only when it is applied.",
  "Good stories can stay with people for years.",
];

const platformItems = [
  {
    title: "Books",
    text: "Practical business and operations books, alongside intelligent fiction designed to give readers a different kind of escape.",
  },
  {
    title: "Articles",
    text: "Thoughtful pieces on systems, leadership, operations, decisions and the habits behind sustainable work.",
  },
  {
    title: "Frameworks",
    text: "Operational frameworks shaped by lessons from hospitality, logistics, recycling and real business pressure.",
  },
  {
    title: "AI workflows",
    text: "Practical ways to use AI to think, plan, document and improve work without adding unnecessary noise.",
  },
  {
    title: "Resources",
    text: "Checklists, guides and tools designed to help useful ideas become applied practice.",
  },
  {
    title: "Career lessons",
    text: "Clear lessons from more than 15 years building, improving and scaling businesses across different industries.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <section className="aboutPageHero premiumSection">
        <div className="aboutPageHeroContent premiumReveal">
          <p className="eyebrow">About Ricky</p>
          <h1 className="display-title">
            Practical experience. Clear thinking. Stories worth keeping.
          </h1>
          <p className="body-large">
            Ricky Recalcati is an operations leader, entrepreneur and author
            based in Sydney. He has spent more than 15 years building,
            improving and scaling businesses across hospitality, logistics and
            recycling. This platform is where he shares practical systems,
            operational frameworks, AI workflows, useful resources and books
            shaped by curiosity and real experience.
          </p>
        </div>

        <div className="aboutPageSignal premiumReveal premiumRevealDelay" aria-label="Ricky Recalcati profile summary">
          <span className="eyebrow">Sydney Based</span>
          <strong className="section-title">Operator, entrepreneur and author.</strong>
          <p className="body">
            His work sits at the intersection of systems thinking, better
            decisions, business growth and storytelling.
          </p>
        </div>
      </section>

      <section className="aboutPageExperience">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">A career shaped by real operating environments.</h2>
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

      <section className="aboutPagePhilosophy premiumSection">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Philosophy</p>
          <h2 className="section-title">Useful ideas should survive contact with real work.</h2>
        </div>

        <div className="aboutPagePrinciples" aria-label="Ricky Recalcati philosophy">
          {philosophyItems.map((item) => (
            <p className="section-title" key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="aboutPagePlatform">
        <div className="aboutPageSectionIntro">
          <p className="eyebrow">Author Platform</p>
          <h2 className="section-title">More than an author website.</h2>
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

      <section className="aboutPageFinalCta">
        <p className="eyebrow">Start Here</p>
        <h2 className="section-title">
          Read what Ricky is building.
        </h2>
        <p className="body-large">
          Explore the books or join the newsletter for thoughtful, practical
          ideas on business, systems, operations and storytelling.
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
