export type BookFaq = {
  question: string;
  answer: string;
};

export type BookPageContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  coverKicker: string;
  coverTagline: string;
  credibility: string[];
  whyTitle: string;
  whyBody: string;
  audienceTitle: string;
  audience: string[];
  learnTitle: string;
  learn: string[];
  faqTitle: string;
  faq: BookFaq[];
  finalLabel: string;
  finalTitle: string;
  finalBody: string;
};

export type Book = {
  slug: string;
  title: string;
  category: string;
  status: "Published" | "Coming Soon";
  format?: "Kindle";
  amazonUrl?: string;
  publicationYear: string;
  series: boolean;
  booksInSeries?: number;
  subtitle: string;
  description: string;
  page: BookPageContent;
};

export const books: Book[] = [
  {
    slug: "scaling-hospitality",
    title: "Scaling Hospitality",
    category: "Business",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0GYV4C57Y",
    publicationYear: "2026",
    series: true,
    booksInSeries: 5,
    subtitle:
      "Build resilient teams, sharper systems and more profitable hospitality businesses.",
    description:
      "Practical guidance for hospitality operators, managers and founders who want to build businesses that grow without sacrificing quality.",
    page: {
      heroEyebrow: "5 e-book series",
      heroHeadline:
        "Build the systems, standards and leadership habits that let a hospitality business grow without losing its soul.",
      heroDescription:
        "Scaling Hospitality combines operational systems, leadership frameworks and real-world experience from more than fifteen years in hospitality and operations.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "5 e-book series for growth, consistency and calm leadership",
      credibility: [
        "Built from real hospitality operations",
        "Systems for growing teams",
        "Practical frameworks, not theory",
        "Written for owners and operators",
      ],
      whyTitle: "Hospitality growth should feel intentional, not accidental.",
      whyBody:
        "Many hospitality businesses reach a point where talent, instinct and hard work are no longer enough. The owner is still solving every problem, standards live in people's heads, and the guest experience depends too heavily on who is on shift. This book helps leaders build the structure that growth demands while preserving the care, warmth and personality that made the business matter in the first place.",
      audienceTitle: "For operators who want growth with discipline.",
      audience: [
        "Hospitality owners preparing to grow beyond one location.",
        "Restaurant managers who need consistent service without being everywhere at once.",
        "Cafe operators rebuilding culture, process and accountability after rapid growth.",
        "Operations managers and entrepreneurs who want a calmer, more profitable business before they scale.",
      ],
      learnTitle: "A clear operating lens for the next stage of your business.",
      learn: [
        "How to turn founder instinct into repeatable operating standards.",
        "Where hospitality growth usually breaks, and how to spot the warning signs early.",
        "How to hire, train and lead teams that can protect the guest experience.",
        "The financial rhythms, meeting cadences and decision habits that keep growth grounded.",
        "How to create scalable consistency without losing the human warmth of hospitality.",
        "What to document first when your business depends too heavily on memory and heroics.",
      ],
      faqTitle: "Questions before you read.",
      faq: [
        {
          question: "Is this book only for restaurant owners?",
          answer:
            "No. It is written for hospitality businesses broadly, including cafes, restaurants, bars, venues and service-led concepts that rely on consistent teams and guest experience.",
        },
        {
          question: "Do I need to be scaling right now?",
          answer:
            "No. The strongest time to build the systems is before growth starts stretching the business. The book is useful whether you are preparing, expanding or stabilizing.",
        },
        {
          question: "Is it strategy or practical execution?",
          answer:
            "Both, with a bias toward practical execution. The goal is to help owners make better decisions and translate them into habits their teams can actually use.",
        },
        {
          question: "Where can I buy it?",
          answer:
            "Scaling Hospitality is available through Amazon Kindle.",
        },
      ],
      finalLabel: "Available Now",
      finalTitle:
        "Start building a hospitality business that scales with confidence.",
      finalBody:
        "Get the series on Amazon Kindle or join the newsletter for more practical operating ideas from Ricky Recalcati.",
    },
  },
  {
    slug: "the-forgotten-cipher",
    title: "The Forgotten Cipher",
    category: "Fiction",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0H64ZBYYV",
    publicationYear: "2026",
    series: false,
    subtitle: "Some secrets were buried for a reason.",
    description:
      "A historical thriller where cryptography, hidden history and impossible secrets collide.",
    page: {
      heroEyebrow: "Historical Thriller",
      heroHeadline: "Some secrets were buried for a reason.",
      heroDescription:
        "A cinematic, intelligent thriller built around hidden history, consequence and suspense.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "A historical thriller",
      credibility: [
        "Historical thriller",
        "Cinematic suspense",
        "Dark and intelligent",
        "Published on Kindle",
      ],
      whyTitle: "A story about secrets, consequence and the cost of knowing.",
      whyBody:
        "The Forgotten Cipher is being developed as an elegant historical thriller where tension comes from consequence, not spectacle.",
      audienceTitle: "For readers who like intelligent suspense.",
      audience: [
        "Readers of historical thrillers.",
        "Readers who enjoy cryptography and hidden history.",
        "Fiction readers who prefer atmosphere, intelligence and consequence.",
        "Readers following Ricky Recalcati's upcoming fiction releases.",
      ],
      learnTitle: "What to expect from the story.",
      learn: [
        "A historical mystery shaped by buried information.",
        "A suspenseful story with a dark, cinematic tone.",
        "A plot driven by intelligence, secrets and consequence.",
      ],
      faqTitle: "Questions before release.",
      faq: [
        {
          question: "Is The Forgotten Cipher available now?",
          answer: "Yes. The Forgotten Cipher is available on Amazon Kindle.",
        },
        {
          question: "What genre is it?",
          answer: "It is a historical thriller.",
        },
      ],
      finalLabel: "Published",
      finalTitle: "Read The Forgotten Cipher on Kindle.",
      finalBody:
        "Get the book on Amazon Kindle or join the newsletter for future fiction updates.",
    },
  },
  {
    slug: "the-second-act",
    title: "The Second Act",
    category: "Personal Growth",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0H421SGPW",
    publicationYear: "2026",
    series: true,
    booksInSeries: 5,
    subtitle: "It's never too late to build the life you actually want.",
    description:
      "Practical guidance and inspiration for building a meaningful next chapter in life.",
    page: {
      heroEyebrow: "5 e-book series",
      heroHeadline: "It's never too late to build the life you actually want.",
      heroDescription:
        "A hopeful, warm and practical guide for people creating a more meaningful next chapter.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "5 e-book series for the next chapter",
      credibility: [
        "Personal growth",
        "Hopeful and practical",
        "Reflective guidance",
        "Published on Kindle",
      ],
      whyTitle: "A practical book for rebuilding with intention.",
      whyBody:
        "The Second Act is being developed for readers who want to reflect clearly, make better choices and build a life that feels more aligned.",
      audienceTitle: "For readers ready for a meaningful next chapter.",
      audience: [
        "Readers navigating a life transition.",
        "People interested in practical personal growth.",
        "Readers who want hopeful guidance without empty motivation.",
        "People building a more intentional second act.",
      ],
      learnTitle: "What to expect from the book.",
      learn: [
        "Practical reflections for making a meaningful change.",
        "Clear prompts for better decisions.",
        "A warm and grounded approach to personal growth.",
      ],
      faqTitle: "Questions before release.",
      faq: [
        {
          question: "Is The Second Act available now?",
          answer: "Yes. The Second Act is available on Amazon Kindle.",
        },
        {
          question: "What is the tone of the book?",
          answer: "Hopeful, warm, reflective and practical.",
        },
      ],
      finalLabel: "Published",
      finalTitle: "Read The Second Act on Kindle.",
      finalBody:
        "Get the series on Amazon Kindle or join the newsletter for future personal growth resources.",
    },
  },
];

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}
