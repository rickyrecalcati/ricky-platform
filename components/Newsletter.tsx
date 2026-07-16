import NewsletterSignupForm from "./NewsletterSignupForm";
import "./Newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter premiumSection" id="newsletter">
      <div className="newsletterCard premiumReveal">

        <p className="newsletterTag eyebrow">
          Join Balance Sheet
        </p>

        <h2 className="section-title">
          Every Monday, get a clear review of business, markets and investing.
        </h2>

        <div className="newsletterEditorial">
          <p className="newsletterText body-large">
            Every Monday you&apos;ll receive one carefully written issue that
            cuts through the noise. Instead of trying to keep up with hundreds
            of headlines, you&apos;ll get the stories that mattered, why they
            matter, and the lessons worth carrying into the week ahead.
          </p>

          <p className="newsletterText body-large">
            Whether you&apos;re building a business, investing for the long term
            or simply trying to make better decisions, Balance Sheet is designed
            to save you time while helping you think more clearly.
          </p>
        </div>

        <p className="newsletterEmphasis body">
          One email. Every Monday. Always free.
        </p>

        <NewsletterSignupForm
          className="newsletterForm"
          messageClassName="newsletterMessage body"
          sourceAnchor="newsletter"
        />

        <p className="newsletterAssurance body">
          Free. No spam. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
}
