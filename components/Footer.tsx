import Link from "next/link";
import NewsletterSignupForm from "./NewsletterSignupForm";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footerTop">

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

        <div className="footerLinks">

          <div>
            <h3 className="eyebrow">Explore</h3>

            <Link href="/books">Books</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/about">About</Link>

          </div>

          <div>

            <h3 className="eyebrow">Books</h3>

            <Link href="/books/scaling-hospitality">Scaling Hospitality</Link>
            <Link href="/books/no-robots-required">No Robots Required</Link>
            <Link href="/books/the-second-act">The Second Act</Link>

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
