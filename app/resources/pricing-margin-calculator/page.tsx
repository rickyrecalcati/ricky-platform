import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "../../../lib/seo";
import PricingMarginCalculator from "./PricingMarginCalculator";
import "./pricing-margin-calculator.css";

const faqs = [
  {
    question: "What is gross margin?",
    answer:
      "Gross margin is the percentage of revenue left after variable costs are removed. It shows how much of each sale remains before fixed costs and overheads.",
  },
  {
    question: "What is markup?",
    answer:
      "Markup measures how much profit is added on top of cost. If something costs $50 and sells for $75, the markup is 50 percent.",
  },
  {
    question: "What is the difference between margin and markup?",
    answer:
      "Margin compares profit with selling price. Markup compares profit with cost. The same sale can have a 33.3 percent margin and a 50 percent markup.",
  },
  {
    question: "How do I calculate break-even sales?",
    answer:
      "Divide monthly fixed costs by profit per sale. If fixed costs are $8,000 and profit per sale is $35, the business needs about 229 sales to break even.",
  },
  {
    question: "What is a good profit margin?",
    answer:
      "A good margin depends on the industry, cost structure and operating model. The useful question is whether the margin covers fixed costs, supports growth and leaves enough profit for the risk involved.",
  },
];

export const metadata = createPageMetadata({
  title: "Pricing & Margin Calculator",
  description:
    "Calculate true cost per sale, profitable prices, gross margin, markup, break-even sales and target profit volume with a free business calculator.",
  path: "/resources/pricing-margin-calculator",
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
  const url = absoluteUrl("/resources/pricing-margin-calculator");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#calculator`,
    name: "Pricing & Margin Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url,
    description:
      "A free client-side calculator for pricing, margin, markup, break-even sales and target profit planning.",
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

export default function PricingMarginCalculatorPage() {
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
                name: "Pricing & Margin Calculator",
                path: "/resources/pricing-margin-calculator",
              },
            ]),
          ),
        }}
      />

      <Navbar />

      <section className="pricingCalculatorPage premiumSection">
        <header className="pricingCalculatorHero premiumReveal">
          <p className="eyebrow">Free Business Tool</p>
          <h1 className="display-title">Pricing & Margin Calculator</h1>
          <p className="body-large">
            Calculate true cost per sale, set a target margin and see what each
            discount does to profit.
          </p>
        </header>

        <PricingMarginCalculator />

        <section className="calculatorFaq" aria-labelledby="calculator-faq">
          <div className="calculatorFaqHeader">
            <p className="eyebrow">FAQ</p>
            <h2 id="calculator-faq" className="section-title">
              Pricing and margin questions.
            </h2>
          </div>

          <div className="calculatorFaqGrid">
            {faqs.map((faq) => (
              <article className="calculatorFaqItem" key={faq.question}>
                <h3>{faq.question}</h3>
                <p className="body">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
