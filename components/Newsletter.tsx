import "./Newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter premiumSection" id="newsletter">
      <div className="newsletterCard premiumReveal">

        <p className="newsletterTag eyebrow">
          Newsletter
        </p>

        <h2 className="section-title">
          Join thousands of readers building better businesses, making smarter
          decisions and discovering new ideas.
        </h2>

        <p className="newsletterText body-large">
          Get occasional emails with new books, articles, free resources and
          practical ideas. No spam. Just useful thinking.
        </p>

        <form className="newsletterForm">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Your email address"
          />

          <button className="luxuryButton luxuryButtonPrimary" type="submit">
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}
