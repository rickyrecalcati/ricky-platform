import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="heroContent">
        <p className="heroTag">BUSINESS • FICTION • FINANCE • LIFE</p>

        <h1>
          Ideas that help people build better businesses, make smarter
          decisions, and discover unforgettable stories.
        </h1>

        <p className="heroText">
          Practical books, proven frameworks and thought-provoking stories to
          help you grow in business and in life.
        </p>

        <div className="heroButtons">
          <button className="primaryButton">Explore Books</button>
          <button className="secondaryButton">Free Resources</button>
        </div>
      </div>

      <div className="bookStage">
        <div className="bookMockup">
          <div className="bookSpine"></div>

          <div className="bookCover">
            <div className="bookAuthor">RICKY RECALCATI</div>

            <div className="bookTitleBlock">
              <h2>
                Scaling
                <br />
                Hospitality
              </h2>
              <div className="bookRule"></div>
              <p>Build a business that runs smoothly.</p>
            </div>

            <div className="bookCategory">BUSINESS</div>
          </div>

          <div className="bookPages"></div>
        </div>
      </div>
    </section>
  );
}