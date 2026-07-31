import Link from "next/link";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../../lib/seo";
import CompoundInterestCalculator from "./CompoundInterestCalculator";
import "./compound-interest-calculator.css";

const faqs = [
  {
    question: "What is compound interest?",
    answer:
      "Compound interest is growth earned on both the original investment and the growth already produced. Over long periods, the second part can become more important than the first.",
  },
  {
    question: "How does a compound interest calculator work?",
    answer:
      "It estimates future value by applying an assumed return over repeated periods, adding regular contributions and accounting for fees and inflation where selected.",
  },
  {
    question: "What is the difference between nominal and real returns?",
    answer:
      "Nominal returns are the headline returns before inflation. Real returns adjust for inflation and are closer to the change in purchasing power.",
  },
  {
    question: "Why do fees matter so much over time?",
    answer:
      "Fees reduce the balance while it is compounding. The cost is not only the fee paid today, but also the future growth that money can no longer earn.",
  },
  {
    question: "Are projected investment returns guaranteed?",
    answer:
      "No. This calculator uses assumptions entered by the user. Markets vary, returns are uncertain and projections should be treated as planning estimates, not promises.",
  },
];

export const metadata = createPageMetadata({
  title: "Compound Interest Calculator | Investment Growth Calculator",
  description:
    "Calculate how an initial investment and regular contributions could grow over time. See the impact of compound returns, fees, inflation and delayed investing.",
  path: "/resources/compound-interest-calculator",
});

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function softwareJsonLd() {
  const url = absoluteUrl("/resources/compound-interest-calculator");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#calculator`,
    name: "Compound Interest Calculator",
    alternateName: [
      "Investment Growth Calculator",
      "Compound Investment Calculator",
      "Investment Return Calculator",
      "Monthly Investment Calculator",
      "Future Value Calculator",
    ],
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url,
    description:
      "A free client-side calculator for estimating investment growth, contributions, fees, inflation and the cost of waiting.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    },
    creator: {
      "@id": "https://www.rickyrecalcati.com/#person",
    },
    isAccessibleForFree: true,
  };
}

export default function CompoundInterestCalculatorPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(softwareJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Resources", path: "/resources" },
              {
                name: "Compound Interest Calculator",
                path: "/resources/compound-interest-calculator",
              },
            ]),
          ),
        }}
      />

      <Navbar />

      <section className="compoundCalculatorPage premiumSection">
        <header className="compoundHero premiumReveal">
          <p className="eyebrow">Free Investing Tool</p>
          <h1 className="display-title">Compound Interest Calculator</h1>
          <p className="body-large">
            Estimate how your investments could grow over time through regular
            contributions and compound returns. Understand the impact of fees
            and see the cost of delaying your investment plan.
          </p>
          <p className="compoundDisclaimer">
            Editable examples only. This tool is for education and planning, not
            financial advice or a forecast.
          </p>
        </header>

        <CompoundInterestCalculator />

        <section className="compoundEducation" aria-labelledby="compound-education">
          <div className="compoundEducationIntro">
            <p className="eyebrow">How To Read The Numbers</p>
            <h2 id="compound-education" className="section-title">
              Compounding rewards money that stays in the game.
            </h2>
            <p className="body-large">
              Compound growth is simple to describe and easy to underestimate.
              Money earns a return. The return remains invested. The next return
              is earned on a larger base. Nothing dramatic has to happen in any
              single year for the long-term result to become meaningful.
            </p>
          </div>

          <div className="compoundArticleGrid">
            <article>
              <span className="compoundPrincipleNumber">01</span>
              <div>
                <h3>Contributions create the base.</h3>
                <p className="body">
                  Contributions do the early heavy lifting. Returns do more of
                  the work later, once the portfolio is large enough for growth
                  on growth to matter.
                </p>
              </div>
            </article>

            <article>
              <span className="compoundPrincipleNumber">02</span>
              <div>
                <h3>Fees reduce more than the amount deducted.</h3>
                <p className="body">
                  Fees lower the balance that remains invested, which means
                  future returns are earned on a smaller amount.
                </p>
              </div>
            </article>

            <article>
              <span className="compoundPrincipleNumber">03</span>
              <div>
                <h3>Inflation changes the meaning of the result.</h3>
                <p className="body">
                  A portfolio may be worth more dollars in the future while
                  buying less than expected. The inflation-adjusted result
                  estimates purchasing power in today&apos;s dollars.
                </p>
              </div>
            </article>

            <article>
              <span className="compoundPrincipleNumber">04</span>
              <div>
                <h3>Waiting has a cost.</h3>
                <p className="body">
                  Delaying an investment plan removes the earliest years from
                  the compounding timeline. Those quiet early years can become
                  surprisingly important later.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="compoundFaq" aria-labelledby="compound-faq">
          <div className="compoundFaqHeader">
            <p className="eyebrow">FAQ</p>
            <h2 id="compound-faq" className="section-title">
              Compound interest questions.
            </h2>
          </div>

          <div className="compoundFaqGrid">
            {faqs.map((faq) => (
              <article className="compoundFaqItem" key={faq.question}>
                <h3>{faq.question}</h3>
                <p className="body">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="compoundLinks" aria-labelledby="compound-links">
          <div>
            <p className="eyebrow">Keep Exploring</p>
            <h2 id="compound-links" className="section-title">
              Build the habit around the number.
            </h2>
          </div>
          <div className="compoundLinkGrid">
            <Link href="/resources" className="compoundTextLink">
              Resources library
            </Link>
            <Link
              href="/resources/investment-thesis-template"
              className="compoundTextLink"
            >
              Investment Thesis Template
            </Link>
            <Link
              href="/articles/the-wealth-gap-isnt-about-income-its-about-ownership"
              className="compoundTextLink"
            >
              Ownership and long-term wealth
            </Link>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
