import Link from "next/link";
import NewsletterSignupForm from "./NewsletterSignupForm";
import "./Footer.css";

type FooterProps = {
  hideNewsletter?: boolean;
};

export default function Footer({ hideNewsletter = false }: FooterProps) {
  return (
    <footer className={hideNewsletter ? "footer footerWithoutNewsletter" : "footer"}>

      <div className="footerTop">

        {!hideNewsletter ? (
          <div className="footerBrand">

            <div className="footerNewsletter" id="footer-newsletter">
              <p className="footerNewsletterTag eyebrow">Join Balance Sheet</p>
              <h2 className="section-title">
                A clear Monday review of business, markets and investing.
              </h2>
              <NewsletterSignupForm
                buttonText="Subscribe"
                className="footerNewsletterForm"
                messageClassName="footerNewsletterMessage body"
                placeholder="Your email address"
                sourceAnchor="footer-newsletter"
              />
            </div>

          </div>
        ) : (
          <div className="footerBrand footerLatestBook">
            <p className="footerNewsletterTag eyebrow">Latest Book</p>
            <h2 className="section-title">No One Taught Me This at Work</h2>
            <p className="body">
              The unwritten rules of building a career, working with people and
              getting ahead.
            </p>
            <Link href="/books/no-one-taught-me-this-at-work">
              Explore the book →
            </Link>
          </div>
        )}

        <div className="footerLinks">

          <div>
            <h3 className="eyebrow">Explore</h3>

            <Link href="/books">Books</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/about">About</Link>

          </div>

          <div>

            <h3 className="eyebrow">Connect</h3>

            <a href="https://x.com/rickyrecalcati" rel="noopener noreferrer" target="_blank">X</a>
            <a href="https://medium.com/@r.recalcati9" rel="noopener noreferrer" target="_blank">Medium</a>

          </div>

        </div>

      </div>

      <div className="footerBottom">

        <span>© {new Date().getFullYear()} Ricky Recalcati. All rights reserved.</span>

      </div>

    </footer>
  );
}
