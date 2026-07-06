import "./About.css";

export default function About() {
  return (
    <section className="about">
      <div className="aboutContent">
        <p className="aboutTag">About Ricky</p>

        <h2>
          Operations leader, entrepreneur and author building ideas for better
          business and better living.
        </h2>

        <p>
          For more than 15 years, Ricky Recalcati has worked across hospitality,
          logistics and operations, helping businesses improve systems, reduce
          complexity and grow sustainably.
        </p>

        <p>
          His books combine practical business experience with curiosity across
          leadership, finance, personal growth and storytelling.
        </p>

        <a href="#" className="aboutButton">
          Read My Story →
        </a>
      </div>

      <div className="aboutPortrait">
        <span>Portrait</span>
      </div>
    </section>
  );
}