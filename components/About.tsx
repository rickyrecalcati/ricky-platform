import "./About.css";

export default function About() {
  return (
    <section className="about premiumSection">
      <div className="aboutContent premiumReveal">
        <p className="aboutTag eyebrow">About Ricky</p>

        <h2 className="section-title">
          Operations leader, entrepreneur and author building ideas for better
          business and better living.
        </h2>

        <p className="body-large">
          For more than 15 years, Ricky Recalcati has worked across hospitality,
          logistics and operations, helping businesses improve systems, reduce
          complexity and grow sustainably.
        </p>

        <p className="body-large">
          His books combine practical business experience with curiosity across
          leadership, finance, personal growth and storytelling.
        </p>

        <a href="#" className="aboutButton">
          Read My Story →
        </a>
      </div>

      <div className="aboutPortrait premiumReveal premiumRevealDelay">
        <span className="eyebrow">Portrait</span>
      </div>
    </section>
  );
}
