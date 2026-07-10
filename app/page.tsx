import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero";
import MeetRicky from "../components/MeetRicky";
import FeaturedBooks from "../components/FeaturedBooks";
import LatestArticles from "../components/LatestArticles";
import FreeResources from "../components/FreeResources";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedBooks />
      <LatestArticles />
      <FreeResources />
      <MeetRicky />
      <Newsletter />
      <Footer />
    </main>
  );
}
