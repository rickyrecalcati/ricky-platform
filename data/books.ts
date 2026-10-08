export type BookFaq = {
  question: string;
  answer: string;
};

export type BookSeriesVolume = {
  label: string;
  title: string;
  subtitle: string;
  description: string;
};

export type BookRelatedResource = {
  title: string;
  href: string;
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
  seriesSectionEyebrow?: string;
  seriesSectionTitle?: string;
  seriesBooks?: BookSeriesVolume[];
  relatedResources?: BookRelatedResource[];
};

export type Book = {
  slug: string;
  title: string;
  category: string;
  status: "Published" | "Coming Soon";
  format?: "Kindle" | "Kindle + Paperback";
  amazonUrl?: string;
  coverImage?: string;
  featured?: boolean;
  publicationYear: string;
  series: boolean;
  booksInSeries?: number;
  cardCtaLabel?: string;
  subtitle: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  page: BookPageContent;
};

const bookCatalog: Book[] = [
  {
    slug: "no-one-taught-me-this-at-work",
    title: "No One Taught Me This at Work",
    category: "Career Development",
    status: "Published",
    format: "Kindle + Paperback",
    amazonUrl: "https://www.amazon.com/dp/B0HM61JQP9",
    coverImage: "/books/no-one-taught-me-this-at-work-cover.jpg",
    publicationYear: "2026",
    series: false,
    cardCtaLabel: "Learn More",
    subtitle:
      "The Unwritten Rules of Building a Career, Working With People and Getting Ahead",
    description:
      "A practical guide to the parts of working life nobody formally explains, from building trust and communicating clearly to earning opportunities and choosing what comes next.",
    metaTitle:
      "No One Taught Me This at Work by Ricky Recalcati | Career Development Book",
    metaDescription:
      "Learn the unwritten rules of work, communication and career development in No One Taught Me This at Work, a practical book by Ricky Recalcati.",
    page: {
      heroEyebrow: "E-book & Paperback",
      heroHeadline:
        "The lessons that usually arrive after the mistake, the missed opportunity or the difficult conversation.",
      heroDescription:
        "No One Taught Me This at Work explains the unwritten rules behind reliable work, professional trust, clearer communication and a career you choose deliberately. It is available now in Kindle and paperback editions.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "The unwritten rules of working life",
      credibility: [
        "E-book & Paperback",
        "Five practical parts",
        "34 focused chapters",
        "Available in paperback and Kindle",
      ],
      whyTitle: "Work asks people to understand rules that nobody stops to explain.",
      whyBody:
        "Most careers are shaped by lessons that sit outside a job description. Doing good work matters, but so do reliability, judgement, communication, commercial awareness and the ability to handle difficult conversations. I wrote this book because many of those lessons are learned through avoidable mistakes or years of watching how workplaces really operate. It brings them into the open through recognisable situations, practical examples and questions readers can use in the work they are dealing with now.",
      audienceTitle: "For people who want to understand work, not simply endure it.",
      audience: [
        "People beginning their careers who want a more honest picture of how workplaces operate.",
        "Experienced employees whose effort is not translating into recognition, trust or opportunity.",
        "Professionals preparing for promotion, a pay conversation or a change of direction.",
        "New managers and team leaders learning how responsibility changes the work they need to do.",
      ],
      learnTitle: "Better judgement for the situations no induction manual covers.",
      learn: [
        "Why doing good work is only part of building a credible professional reputation.",
        "How to manage commitments, difficult colleagues and uncomfortable conversations without creating more friction.",
        "How to communicate clearly, contribute in meetings and present ideas people can assess.",
        "How businesses make money and why commercial understanding improves everyday decisions.",
        "How to approach promotions, salary discussions, loyalty and the decision to leave.",
        "How to delegate, make decisions with incomplete information and build a career that fits your life.",
      ],
      relatedResources: [
        {
          title: "Annual Review Workbook",
          href: "/resources/annual-review-workbook",
        },
        {
          title: "Manager Handover Template",
          href: "/resources/manager-handover-template",
        },
        {
          title: "Weekly Business Review",
          href: "/resources/weekly-business-review",
        },
      ],
      faqTitle: "Questions before you read.",
      faq: [
        {
          question: "Who is this book for?",
          answer:
            "It is written for people at any career stage who want to understand the unwritten expectations behind reliable work, professional relationships, recognition and advancement.",
        },
        {
          question: "Is it only for people seeking a promotion?",
          answer:
            "No. The book covers advancement, but it also deals with everyday work: keeping commitments, disagreeing well, handling difficult colleagues, communicating clearly and deciding what kind of career you actually want.",
        },
        {
          question: "Is this a management book?",
          answer:
            "Not exclusively. The final section examines what changes as responsibility grows, but most of the book is useful before someone has a management title.",
        },
        {
          question: "Which formats are available?",
          answer:
            "No One Taught Me This at Work is available now in both Kindle and paperback editions through Amazon.",
        },
      ],
      finalLabel: "Available Now",
      finalTitle: "Buy No One Taught Me This at Work on Amazon.",
      finalBody:
        "Get the standalone book in paperback or Kindle.",
    },
  },
  {
    slug: "the-digital-estate",
    title: "The Digital Estate",
    category: "Estate Planning",
    status: "Published",
    format: "Kindle + Paperback",
    amazonUrl: "https://www.amazon.com/dp/B0HG799DK8",
    coverImage: "/books/the-digital-estate-cover.jpg",
    publicationYear: "2026",
    series: false,
    cardCtaLabel: "Learn More",
    subtitle:
      "What Happens to Your Passwords, Photos, Money and Online Life When You Die?",
    description:
      "A practical guide to organising your online accounts, digital assets and instructions so the people you trust are not left searching, guessing or locked out.",
    metaTitle:
      "The Digital Estate by Ricky Recalcati | Digital Estate Planning Book",
    metaDescription:
      "Organise passwords, photos, financial accounts and online assets with The Digital Estate, a practical digital estate planning guide by Ricky Recalcati.",
    page: {
      heroEyebrow: "E-book & Paperback",
      heroHeadline:
        "Make the invisible parts of your life easier for the people you leave behind.",
      heroDescription:
        "The Digital Estate is a practical guide to finding, organising and protecting the accounts, assets, memories and instructions that now live behind screens. It is available now in Kindle and paperback editions.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "A practical guide to the life you keep online",
      credibility: [
        "E-book & Paperback",
        "A practical 30-day plan",
        "Passwords, photos and money",
        "Available in paperback and Kindle",
      ],
      whyTitle: "Your family should not have to reconstruct your digital life.",
      whyBody:
        "Most of us have built a second life behind passwords: email accounts, photo libraries, financial records, subscriptions, cloud files, devices and online businesses. Very little of it appears in a traditional filing cabinet, and much of it may be difficult to find when somebody else needs to step in. I wrote The Digital Estate to turn that vague problem into a manageable plan. It helps you decide what exists, where it can be found, who should handle it and what should happen next, without creating an unsafe master list of passwords or asking your family to guess at your intentions.",
      audienceTitle: "For anyone whose important life no longer fits in a filing cabinet.",
      audience: [
        "People who want to organise their own digital affairs before a crisis forces the issue.",
        "Partners and parents who share finances, photos, devices or online accounts with their family.",
        "Business owners whose domains, payment systems, cloud files and customer records depend too heavily on memory.",
        "Anyone already trying to make sense of a loved one's online life after death or incapacity.",
      ],
      learnTitle: "A clear plan for what exists, who can act and what should happen.",
      learn: [
        "How to build a useful inventory of devices, accounts, digital assets and important records.",
        "How to plan access without storing every password in one vulnerable document.",
        "How to prepare email, two-factor authentication, recovery methods and trusted contacts.",
        "How to handle photos, personal files, subscriptions and social accounts with privacy in mind.",
        "How to document financial accounts, cryptocurrency, domains and online business systems.",
        "How to complete a practical 30-day plan that another person could actually follow.",
      ],
      faqTitle: "Questions before you read.",
      faq: [
        {
          question: "Who is The Digital Estate for?",
          answer:
            "It is for anyone with important accounts, devices, financial records, photos or business systems online. It is equally useful for people planning ahead and those already helping with a loved one's affairs.",
        },
        {
          question: "Does the book tell me to write down all my passwords?",
          answer:
            "No. The book focuses on building a secure map of what exists, where access instructions are stored and who is authorised to act. It does not recommend keeping every credential in an exposed master list.",
        },
        {
          question: "Is this legal or financial advice?",
          answer:
            "No. Laws, platform policies and estate arrangements vary. The book helps you organise the practical digital layer and identify questions that may need professional legal or financial advice.",
        },
        {
          question: "Which formats are available?",
          answer:
            "The Digital Estate is available now in both Kindle and paperback editions through Amazon.",
        },
      ],
      finalLabel: "Available Now",
      finalTitle: "Buy The Digital Estate on Amazon.",
      finalBody:
        "Get the standalone book in paperback or Kindle.",
    },
  },
  {
    slug: "the-accidental-manager",
    title: "The Accidental Manager",
    category: "Personal Development",
    status: "Published",
    format: "Kindle + Paperback",
    amazonUrl: "https://www.amazon.com/dp/B0HFX7XC5Z",
    coverImage: "/books/the-accidental-manager-cover.png",
    featured: true,
    publicationYear: "2026",
    series: false,
    cardCtaLabel: "Learn More",
    subtitle: "A practical book for people learning to lead while doing the job.",
    description:
      "A practical management book for people who became responsible for a team before anyone taught them how to manage one.",
    metaTitle:
      "The Accidental Manager by Ricky Recalcati | Practical Leadership Book",
    metaDescription:
      "A practical leadership book for people who became managers without formal training, covering trust, feedback, delegation and accountability.",
    page: {
      heroEyebrow: "E-book & Paperback",
      heroHeadline:
        "A practical guide for people who became managers before they were taught how to manage.",
      heroDescription:
        "The Accidental Manager is for people moving from doing the work to leading the work, with clear guidance on expectations, feedback, delegation, trust and difficult conversations.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "Practical leadership for new and accidental managers",
      credibility: [
        "E-book & Paperback",
        "Practical management guidance",
        "Written for new leaders",
        "Available in paperback and Kindle",
      ],
      whyTitle: "Most people are asked to manage before they are taught how.",
      whyBody:
        "Many managers do not step into leadership after a neat training program. They are promoted because they were reliable, capable or experienced, then suddenly find themselves responsible for people, standards, conversations and decisions that feel very different from the work they used to do. The Accidental Manager is written for that moment. It helps new and informal managers think more deliberately about expectations, trust, delegation, feedback and accountability without pretending leadership is about having every answer.",
      audienceTitle: "For people learning management while doing the job.",
      audience: [
        "New managers moving from individual contributor to team leader.",
        "Supervisors, shift leaders and operators who are responsible for people without formal management training.",
        "Business owners who need clearer routines for expectations, feedback and accountability.",
        "Experienced team members who want to lead without copying bad management habits they have seen before.",
      ],
      learnTitle: "A grounded way to lead people and manage the work.",
      learn: [
        "How management changes when you stop only doing the work and start shaping the work.",
        "How to set expectations without becoming rigid or unclear.",
        "How to delegate responsibility while staying close enough to support the outcome.",
        "How to give feedback before small problems become difficult conversations.",
        "How to build trust through consistency, fairness and follow-through.",
        "How to manage accountability without pretending leadership requires certainty.",
      ],
      relatedResources: [
        {
          title: "Weekly Business Review",
          href: "/resources/weekly-business-review",
        },
        {
          title: "Business Health Scorecard",
          href: "/resources/business-health-scorecard",
        },
        {
          title: "Manager Handover Template",
          href: "/resources/manager-handover-template",
        },
      ],
      faqTitle: "Questions before you read.",
      faq: [
        {
          question: "Who is this book for?",
          answer:
            "It is written for people who have become responsible for a team, shift, department or business area without being formally trained to manage people.",
        },
        {
          question: "Is it only for first-time managers?",
          answer:
            "No. It is also useful for supervisors, operators, founders and experienced managers who want a more deliberate approach to expectations, feedback and accountability.",
        },
        {
          question: "Is The Accidental Manager available now?",
          answer:
            "Yes. The Accidental Manager is available through Amazon in paperback and Kindle.",
        },
      ],
      finalLabel: "Available Now",
      finalTitle: "Buy The Accidental Manager on Amazon.",
      finalBody:
        "Get the standalone book in paperback or Kindle.",
    },
  },
  {
    slug: "no-robots-required",
    title: "No Robots Required",
    category: "AI",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0H1LPJ3P1",
    coverImage: "/books/no-robots-required-cover.png",
    featured: true,
    publicationYear: "2026",
    series: true,
    booksInSeries: 5,
    cardCtaLabel: "Learn More",
    subtitle: "The practical AI series for people who do not come from tech.",
    description:
      "A practical five-book introduction to artificial intelligence, written in plain English for people who want to use AI confidently without needing a technical background.",
    page: {
      heroEyebrow: "5 e-book series",
      heroHeadline:
        "The practical AI series for people who do not come from tech.",
      heroDescription:
        "AI is everywhere, but most people were never given a clear starting point. No Robots Required makes artificial intelligence understandable, practical and useful in everyday life.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "5 e-book series for practical AI confidence",
      credibility: [
        "Plain-English AI guidance",
        "No technical background required",
        "Practical examples and exercises",
        "Available on Kindle",
      ],
      whyTitle: "AI should feel useful before it feels impressive.",
      whyBody:
        "AI is everywhere, but most people were never given a clear starting point. No Robots Required is a five-book series designed to make artificial intelligence understandable, practical and useful for ordinary people. The series takes readers from the basic question of what AI is through to using it confidently at work, at home and in everyday life. Each book is short, practical and written in plain English, with real examples and simple exercises that can be applied immediately. No technical background is required. No coding experience is required. Only curiosity.",
      audienceTitle: "For readers who want practical AI knowledge without jargon.",
      audience: [
        "Curious beginners.",
        "Professionals who want to use AI with confidence.",
        "Managers and small-business owners looking for practical applications.",
        "Students, parents and older readers who feel left behind by technology.",
      ],
      learnTitle: "A plain-English path from curiosity to confident use.",
      learn: [
        "Understand what AI is and what it is not.",
        "Use ChatGPT and similar tools confidently.",
        "Write better prompts and review AI output critically.",
        "Apply AI at work and at home to save time on repetitive tasks.",
        "Recognise common mistakes, limitations and responsible uses.",
        "Stay informed without becoming a technical expert.",
      ],
      seriesSectionEyebrow: "The Five Books",
      seriesSectionTitle: "A practical path through the series.",
      seriesBooks: [
        {
          label: "Book 1",
          title: "What Is AI?",
          subtitle: "A Beginner's Guide",
          description:
            "A simple introduction to what artificial intelligence is, how it works and why it matters.",
        },
        {
          label: "Book 2",
          title: "Talking to AI",
          subtitle: "Your First Steps",
          description:
            "Learn how to communicate with AI tools and write clearer, more useful prompts.",
        },
        {
          label: "Book 3",
          title: "AI at Work & Home",
          subtitle: "",
          description:
            "Practical ways to use AI to save time, organise work and simplify everyday tasks.",
        },
        {
          label: "Book 4",
          title: "How AI Actually Thinks",
          subtitle: "",
          description:
            "A plain-English explanation of how AI produces answers, where it performs well and where it can fail.",
        },
        {
          label: "Book 5",
          title: "The Future of AI",
          subtitle: "And Your Place In It",
          description:
            "Understand how AI may reshape work and society and how to adapt without fear or hype.",
        },
      ],
      relatedResources: [],
      faqTitle: "Questions before you read.",
      faq: [
        {
          question: "Do I need technical experience?",
          answer:
            "No. The series is written for readers who want practical AI knowledge without coding, jargon or a technical background.",
        },
        {
          question: "Is it only about ChatGPT?",
          answer:
            "No. ChatGPT is part of the series, but the broader focus is understanding AI, using it well and thinking clearly about where it helps.",
        },
        {
          question: "Where can I buy it?",
          answer:
            "No Robots Required is available through Amazon Kindle.",
        },
      ],
      finalLabel: "Available Now",
      finalTitle: "Read No Robots Required on Kindle.",
      finalBody:
        "Get the series on Amazon Kindle.",
    },
  },
  {
    slug: "scaling-hospitality",
    title: "Scaling Hospitality",
    category: "Business",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0GYV4C57Y",
    coverImage: "/books/scaling-hospitality-cover.png",
    featured: true,
    publicationYear: "2026",
    series: true,
    booksInSeries: 5,
    subtitle:
      "Build resilient teams, sharper routines and more profitable hospitality businesses.",
    description:
      "A series for hospitality operators, managers and founders who want growth without losing quality, pace or care.",
    page: {
      heroEyebrow: "5 e-book series",
      heroHeadline:
        "Build the standards, routines and leadership habits that let a hospitality business grow without losing its soul.",
      heroDescription:
        "Scaling Hospitality combines operating discipline, leadership frameworks and real-world experience from more than fifteen years in hospitality and operations.",
      coverKicker: "Ricky Recalcati",
      coverTagline: "5 e-book series for growth, consistency and calm leadership",
      credibility: [
        "Built from real hospitality operations",
        "Routines for growing teams",
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
      seriesSectionEyebrow: "The Five Books",
      seriesSectionTitle:
        "A practical path to building a stronger hospitality business.",
      seriesBooks: [
        {
          label: "Book 1",
          title: "Opening a Restaurant Without Chaos",
          subtitle: "",
          description:
            "A guide to planning, launching and opening a hospitality venue with stronger preparation and fewer expensive surprises.",
        },
        {
          label: "Book 2",
          title: "Hospitality Systems That Actually Work",
          subtitle: "",
          description:
            "Learn how to build routines and standards that improve consistency without creating unnecessary bureaucracy.",
        },
        {
          label: "Book 3",
          title: "Hiring & Leading Hospitality Teams",
          subtitle: "",
          description:
            "A practical guide to recruiting, onboarding, developing and leading teams that perform consistently in demanding hospitality environments.",
        },
        {
          label: "Book 4",
          title: "Scaling From One Venue to Multiple Locations",
          subtitle: "",
          description:
            "Understand the leadership structures and operating disciplines required to expand without losing control, quality or culture.",
        },
        {
          label: "Book 5",
          title: "Profitable Hospitality Operations",
          subtitle: "",
          description:
            "Improve margins, control labour and operating costs, strengthen commercial decision-making and build a more financially resilient business.",
        },
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
            "No. The strongest time to strengthen the operating model is before growth starts stretching the business. The book is useful whether you are preparing, expanding or stabilizing.",
        },
        {
          question: "Is it strategy or practical execution?",
          answer:
            "Both, with a bias toward practical execution. The goal is to help owners think clearly and translate those choices into habits their teams can actually use.",
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
        "Get the series on Amazon Kindle or join Balance Sheet for practical operating and investing ideas from Ricky Recalcati.",
    },
  },
  {
    slug: "the-second-act",
    title: "The Second Act",
    category: "Personal Growth",
    status: "Published",
    format: "Kindle",
    amazonUrl: "https://www.amazon.com/dp/B0H421SGPW",
    coverImage: "/books/the-second-act-cover.png",
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
        "Available on Kindle",
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
      seriesSectionEyebrow: "The Five Books",
      seriesSectionTitle:
        "A practical path to building the next chapter of your life.",
      seriesBooks: [
        {
          label: "Book 1",
          title: "Starting Over at 50",
          subtitle: "",
          description:
            "A practical guide to navigating change, rebuilding confidence and creating momentum when life enters a new chapter.",
        },
        {
          label: "Book 2",
          title: "Finding Purpose Again",
          subtitle: "",
          description:
            "Explore what gives life direction, meaning and energy after major transitions, changing priorities or the end of a long-established routine.",
        },
        {
          label: "Book 3",
          title: "Building a Business After 50",
          subtitle: "",
          description:
            "A practical guide to turning experience into opportunity and building a sustainable business without trying to imitate younger founders.",
        },
        {
          label: "Book 4",
          title: "Health, Energy & Longevity",
          subtitle: "",
          description:
            "Build realistic habits that support strength, energy, independence and a better quality of life for the years ahead.",
        },
        {
          label: "Book 5",
          title: "Designing the Next 20 Years",
          subtitle: "",
          description:
            "Create a deliberate long-term plan for work, relationships, money, health, contribution and the life you want to build next.",
        },
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
      finalLabel: "Available Now",
      finalTitle: "Read The Second Act on Kindle.",
      finalBody:
        "Get the series on Amazon Kindle or join Balance Sheet for thoughtful ideas on business, investing and better decisions.",
    },
  },
];

const bookOrder = [
  "no-one-taught-me-this-at-work",
  "the-digital-estate",
  "the-accidental-manager",
  "scaling-hospitality",
  "no-robots-required",
  "the-second-act",
];

export const books: Book[] = bookOrder.map((slug) => {
  const book = bookCatalog.find((item) => item.slug === slug);

  if (!book) {
    throw new Error(`Missing book data for ${slug}`);
  }

  return book;
});

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}
