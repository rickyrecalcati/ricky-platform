import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero";
import MeetRicky from "../components/MeetRicky";
import FeaturedBooks from "../components/FeaturedBooks";
import About from "../components/About";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MeetRicky />
      <FeaturedBooks />
      <About />
      <Newsletter />
      <Footer />
    </main>
  );
}
