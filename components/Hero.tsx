import Image from "next/image";
import Link from "next/link";
import NewsletterSignupForm from "./NewsletterSignupForm";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero premiumSection">
      <div className="heroContent premiumReveal">
        <p className="heroTag eyebrow">BUSINESS • OPERATIONS • INVESTING</p>

        <h1 className="display-title">
          Writing for operators, founders and readers who think long term.
        </h1>

        <p className="heroText body-large">
          Books, essays and free tools on operations, leadership, investing and
          considered decision making.
        </p>

        <div className="heroButtons">
          <Link className="primaryButton luxuryButton luxuryButtonPrimary" href="/books">
            Explore Books
          </Link>
          <Link className="secondaryButton luxuryButton luxuryButtonSecondary" href="#newsletter">
            Free Resources
          </Link>
        </div>

        <div className="heroNewsletter" aria-label="Subscribe to Balance Sheet">
          <p className="heroNewsletterLabel eyebrow">Join Balance Sheet</p>
          <NewsletterSignupForm
            buttonText="Subscribe"
            className="heroNewsletterForm"
            messageClassName="heroNewsletterMessage body"
            placeholder="Your email address"
            sourceAnchor="hero-newsletter"
          />
        </div>
      </div>

      <div className="bookStage premiumReveal premiumRevealDelay">
        <Link
          href="/books/the-accidental-manager"
          className="bookMockup"
          aria-label="Explore The Accidental Manager featured book"
        >
          <span className="heroBookBadge eyebrow">Featured Book</span>
          <div className="bookCover">
            <Image
              src="/books/the-accidental-manager-cover.png"
              alt="The Accidental Manager by Ricky Recalcati book cover"
              fill
              priority
              sizes="(max-width: 620px) 82vw, (max-width: 1000px) 330px, 350px"
              className="bookCoverImage"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
