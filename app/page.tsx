import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero";
import MeetRicky from "../components/MeetRicky";
import FeaturedBooks from "../components/FeaturedBooks";
import BalanceSheetFeature from "../components/BalanceSheetFeature";
import LatestArticles from "../components/LatestArticles";
import FreeResources from "../components/FreeResources";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import {
  createPageMetadata,
  personJsonLd,
  stringifyJsonLd,
  websiteJsonLd,
} from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Ricky Recalcati | Books, Articles and Practical Resources",
  description:
    "Explore Ricky Recalcati's books, articles and free resources on business, operations, investing, AI and personal growth.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(personJsonLd()) }}
      />
      <Navbar />
      <Hero />
      <FeaturedBooks />
      <BalanceSheetFeature />
      <LatestArticles />
      <FreeResources />
      <MeetRicky />
      <Newsletter />
      <Footer />
    </main>
  );
}
