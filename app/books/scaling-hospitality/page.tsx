import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import "./scaling-hospitality.css";

const credibilityItems = [
  "Built from real hospitality operations",
  "Systems for growing teams",
  "Practical frameworks, not theory",
  "Written for owners and operators",
];

const audienceItems = [
  "Restaurant, cafe and venue owners preparing to grow beyond one location.",
  "Hospitality leaders who need consistent service without being everywhere at once.",
  "Operators rebuilding culture, process and accountability after rapid growth.",
  "Founders who want a calmer, more profitable business before they scale.",
];

const learningItems = [
  "How to turn founder instinct into repeatable operating standards.",
  "Where hospitality growth usually breaks, and how to spot the warning signs early.",
  "How to hire, train and lead teams that can protect the guest experience.",
  "The financial rhythms, meeting cadences and decision habits that keep growth grounded.",
  "How to create scalable consistency without losing the human warmth of hospitality.",
  "What to document first when your business depends too heavily on memory and heroics.",
];

const faqItems = [
  {
    question: "Is this book only for restaurant owners?",
    answer:
      "No. It is written for hospitality businesses broadly, including cafes, restaurants, bars, venues and service-led concepts that rely on consistent teams and guest experience.",
  },
  {
    question: "Do I need to be scaling right now?",
    answer:
      "No. The strongest time to build the systems is before growth starts stretching the business. The book is useful whether you are preparing, expanding or stabilizing.",
  },
  {
    question: "Is it strategy or practical execution?",
    answer:
      "Both, with a bias toward practical execution. The goal is to help owners make better decisions and translate them into habits their teams can actually use.",
  },
  {
    question: "Where can I buy it?",
    answer:
      "Scaling Hospitality is available through Amazon. A sample is also available so readers can preview the tone and approach before buying.",
  },
];

export default function ScalingHospitalityPage() {
  return (
    <main>
      <Navbar />

      <section className="scalingHero">
        <div className="scalingHeroContent">
          <p className="scalingEyebrow eyebrow">Business Book</p>
          <h1 className="display-title">Scaling Hospitality</h1>
          <h2 className="scalingHeroHeadline section-title">Build the systems, standards and leadership habits that let a hospitality business grow without losing its soul.</h2>
          <p className="scalingHeroText body-large">
            A premium practical guide for owners and operators who are ready to move beyond daily chaos, protect the guest experience and create a business that can perform with consistency.
          </p>

          <div className="scalingHeroActions">
            <a className="scalingButton scalingButtonPrimary" href="#buy">
              Buy on Amazon
            </a>
            <a className="scalingButton scalingButtonSecondary" href="#sample">
              Read Sample
            </a>
          </div>
        </div>

        <div className="scalingCoverStage" aria-label="Scaling Hospitality book cover placeholder">
          <div className="scalingBookCover">
            <span className="eyebrow">Ricky Recalcati</span>
            <strong className="section-title">Scaling Hospitality</strong>
            <small className="body">Systems for growth, consistency and calm leadership</small>
          </div>
        </div>
      </section>

      <section className="scalingCredibility" aria-label="Book credibility">
        {credibilityItems.map((item) => (
          <p className="eyebrow" key={item}>{item}</p>
        ))}
      </section>

      <section className="scalingCreamSection scalingStory">
        <div>
          <p className="scalingSectionLabel eyebrow">Why I Wrote This Book</p>
          <h2 className="section-title">Hospitality growth should feel intentional, not accidental.</h2>
        </div>
        <p className="body-large">
          Many hospitality businesses reach a point where talent, instinct and hard work are no longer enough. The owner is still solving every problem, standards live in people&apos;s heads, and the guest experience depends too heavily on who is on shift. This book was written to help leaders build the structure that growth demands while preserving the care, warmth and personality that made the business matter in the first place.
        </p>
      </section>

      <section className="scalingDarkSection">
        <div className="scalingSectionIntro">
          <p className="scalingSectionLabel eyebrow">Who This Book Is For</p>
          <h2 className="section-title">For operators who want growth with discipline.</h2>
        </div>

        <div className="scalingAudienceGrid">
          {audienceItems.map((item) => (
            <article key={item} className="scalingAudienceItem">
              <span />
              <p className="body">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scalingCreamSection scalingLearn" id="sample">
        <div className="scalingSectionIntro">
          <p className="scalingSectionLabel eyebrow">What You&apos;ll Learn</p>
          <h2 className="section-title">A clear operating lens for the next stage of your business.</h2>
        </div>

        <div className="scalingLearnGrid">
          {learningItems.map((item) => (
            <article key={item} className="scalingLearnItem">
              <p className="body">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scalingBonus">
        <div>
          <p className="scalingSectionLabel eyebrow">Free Bonus</p>
          <h2 className="section-title">The Scaling Hospitality Operator&apos;s Checklist</h2>
          <p className="body-large">
            Readers receive a concise implementation checklist designed to turn the book&apos;s ideas into an immediate review of standards, team rhythms, leadership habits and growth readiness.
          </p>
        </div>
        <a className="scalingButton scalingButtonSecondary" href="#newsletter">
          Get the Bonus
        </a>
      </section>

      <section className="scalingFaq">
        <div className="scalingSectionIntro">
          <p className="scalingSectionLabel eyebrow">FAQ</p>
          <h2 className="section-title">Questions before you read.</h2>
        </div>

        <div className="scalingFaqList">
          {faqItems.map((item) => (
            <article key={item.question} className="scalingFaqItem">
              <h3 className="section-title">{item.question}</h3>
              <p className="body">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scalingFinalCta" id="buy">
        <p className="scalingSectionLabel eyebrow">Available Now</p>
        <h2 className="section-title">Start building a hospitality business that scales with confidence.</h2>
        <p className="body-large">
          Get the book, read the sample or join the newsletter for more practical operating ideas from Ricky Recalcati.
        </p>
        <div className="scalingHeroActions">
          <a className="scalingButton scalingButtonPrimary" href="https://www.amazon.com/">
            Buy on Amazon
          </a>
          <a className="scalingButton scalingButtonSecondary" href="#sample">
            Read Sample
          </a>
        </div>
      </section>

      <div id="newsletter">
        <Newsletter />
      </div>

      <Footer />
    </main>
  );
}
