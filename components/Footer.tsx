import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footerTop">

        <div className="footerBrand">

          <h2>Ricky Recalcati</h2>

          <p>
            Books, ideas and practical resources for people building
            better businesses, making smarter decisions and living with purpose.
          </p>

        </div>

        <div className="footerLinks">

          <div>
            <h3>Explore</h3>

            <a href="#">Books</a>
            <a href="#">Library</a>
            <a href="#">Resources</a>
            <a href="#">About</a>

          </div>

          <div>

            <h3>Books</h3>

            <a href="#">Scaling Hospitality</a>
            <a href="#">The Forgotten Cipher</a>
            <a href="#">The Second Act</a>

          </div>

          <div>

            <h3>Follow</h3>

            <a href="#">Amazon</a>
            <a href="#">Medium</a>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>

          </div>

        </div>

      </div>

      <div className="footerBottom">

        <span>© {new Date().getFullYear()} Ricky Recalcati</span>

        <span>Built with Next.js</span>

      </div>

    </footer>
  );
}