import Link from "next/link";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero premiumSection">
      <div className="heroContent premiumReveal">
        <p className="heroTag eyebrow">BUSINESS • FICTION • FINANCE • LIFE</p>

        <h1 className="display-title">
          Ideas that help people build better businesses, make smarter
          decisions, and discover unforgettable stories.
        </h1>

        <p className="heroText body-large">
          Practical books, proven frameworks and thought-provoking stories to
          help you grow in business and in life.
        </p>

        <div className="heroButtons">
          <Link className="primaryButton luxuryButton luxuryButtonPrimary" href="/books">
            Explore Books
          </Link>
          <Link className="secondaryButton luxuryButton luxuryButtonSecondary" href="#newsletter">
            Free Resources
          </Link>
        </div>
      </div>

      <div className="bookStage premiumReveal premiumRevealDelay">
        <div
          className="bookMockup"
          aria-label="Scaling Hospitality featured series book cover"
          role="img"
          tabIndex={0}
        >
          <span className="heroBookBadge eyebrow">Featured Series</span>
          <div className="bookCover">
            <div className="bookCoverTop">
              <span className="bookCategory eyebrow">Business</span>
              <span className="bookAuthor eyebrow">Ricky Recalcati</span>
            </div>

            <div className="bookTitleBlock">
              <h2 className="section-title">
                Scaling
                <br />
                Hospitality
              </h2>
              <div className="bookRule"></div>
              <p className="body">Growth, consistency and calm leadership for hospitality operators.</p>
            </div>

            <div className="bookSeriesLabel eyebrow">5 e-book series</div>
          </div>
        </div>
      </div>
    </section>
  );
}
