import "./Newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletterCard">

        <p className="newsletterTag">
          Newsletter
        </p>

        <h2>
          Join thousands of readers building better businesses, making smarter
          decisions and discovering new ideas.
        </h2>

        <p className="newsletterText">
          Get occasional emails with new books, articles, free resources and
          practical ideas. No spam. Just useful thinking.
        </p>

        <form className="newsletterForm">
          <input
            type="email"
            placeholder="Your email address"
          />

          <button>
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}