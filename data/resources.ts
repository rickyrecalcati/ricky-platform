export type ResourceCategory =
  | "Business"
  | "Hospitality"
  | "AI"
  | "Personal Growth"
  | "Investing";

export type RelatedLink = {
  title: string;
  href: string;
};

export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory;
  status?: "Available" | "Coming Soon";
  fileType: "PDF" | "Markdown";
  description: string;
  heroDescription: string;
  whoFor: string[];
  included: string[];
  worksWellWith: string[];
  relatedBooks: RelatedLink[];
  relatedArticles: RelatedLink[];
  fileUrl?: string;
};

const scalingHospitality = {
  title: "Scaling Hospitality",
  href: "/books/scaling-hospitality",
};

const secondAct = {
  title: "The Second Act",
  href: "/books/the-second-act",
};

const systemsArticle = {
  title: "Why Better Systems Build Better Businesses",
  href: "/articles/why-better-systems-build-better-businesses",
};

const serviceArticle = {
  title: "The System Is the Service",
  href: "/articles/the-system-is-the-service",
};

const decisionsArticle = {
  title: "Better Decisions Compound Quietly",
  href: "/articles/better-decisions-compound-quietly",
};

const ownershipArticle = {
  title: "The Wealth Gap Isn't About Income. It's About Ownership.",
  href: "/articles/the-wealth-gap-isnt-about-income-its-about-ownership",
};

const bitcoinArticle = {
  title: "Bitcoin: The First Truly Global Form of Money",
  href: "/articles/bitcoin-the-first-truly-global-form-of-money",
};

const lifeArticle = {
  title: "Your Life Is the Sum of Small Decisions",
  href: "/articles/your-life-is-the-sum-of-small-decisions",
};

export const resources: Resource[] = [
  {
    slug: "weekly-business-review",
    title: "Weekly Business Review",
    category: "Business",
    fileType: "PDF",
    fileUrl: "/resources/weekly-business-review.pdf",
    description:
      "A weekly review template to help founders and managers stay focused on what matters most.",
    heroDescription:
      "A practical weekly review for turning scattered updates into clear priorities, better decisions and calmer follow-through.",
    whoFor: [
      "Founders who want a clearer weekly operating rhythm.",
      "Managers responsible for performance, people and priorities.",
      "Small teams that need a simple review without unnecessary reporting.",
    ],
    included: [
      "A concise weekly scorecard.",
      "Priority review prompts.",
      "Decision and action tracking sections.",
      "Space for risks, blockers and next steps.",
    ],
    worksWellWith: [
      "Monday leadership meetings.",
      "Weekly team reviews.",
      "Founder operating rhythms.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [systemsArticle, decisionsArticle],
  },
  {
    slug: "decision-framework",
    title: "Decision Framework",
    category: "Business",
    fileType: "PDF",
    fileUrl: "/resources/decision-framework.pdf",
    description:
      "A practical framework for making clearer, more confident decisions under uncertainty.",
    heroDescription:
      "A structured decision tool for slowing down the right questions, weighing trade-offs and moving forward with more confidence.",
    whoFor: [
      "Operators making decisions with imperfect information.",
      "Managers who need a repeatable way to compare options.",
      "Entrepreneurs deciding what to do next when the answer is not obvious.",
    ],
    included: [
      "Problem definition prompts.",
      "Option comparison fields.",
      "Risk and reversibility checks.",
      "A decision record for future review.",
    ],
    worksWellWith: [
      "Hiring decisions.",
      "Operational changes.",
      "Investment and growth choices.",
    ],
    relatedBooks: [scalingHospitality, secondAct],
    relatedArticles: [decisionsArticle, lifeArticle],
  },
  {
    slug: "business-health-scorecard",
    title: "Business Health Scorecard",
    category: "Business",
    fileType: "PDF",
    fileUrl: "/resources/business-health-scorecard.pdf",
    description:
      "Evaluate your business across operations, finance, people and growth.",
    heroDescription:
      "A clear business health check for finding weak points before they become expensive problems.",
    whoFor: [
      "Business owners reviewing performance across the whole company.",
      "Managers preparing for growth or stabilisation.",
      "Operators who want a practical snapshot of what needs attention.",
    ],
    included: [
      "Operations review prompts.",
      "Finance and cash flow checks.",
      "People, culture and accountability questions.",
      "Growth readiness indicators.",
    ],
    worksWellWith: [
      "Quarterly business reviews.",
      "Pre-growth planning.",
      "Leadership offsites.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [systemsArticle, decisionsArticle],
  },
  {
    slug: "restaurant-opening-checklist",
    title: "Restaurant Opening Checklist",
    category: "Hospitality",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/restaurant-opening-checklist.pdf",
    description:
      "A practical opening checklist to improve consistency across every shift.",
    heroDescription:
      "A shift-ready opening checklist for helping hospitality teams start the day with clarity, consistency and fewer missed details.",
    whoFor: [
      "Restaurant, cafe and venue managers.",
      "Opening supervisors responsible for shift readiness.",
      "Hospitality teams standardising daily routines.",
    ],
    included: [
      "Front-of-house readiness checks.",
      "Back-of-house preparation prompts.",
      "Safety, cleanliness and stock review items.",
      "Manager sign-off space.",
    ],
    worksWellWith: [
      "Daily pre-shift meetings.",
      "New team member training.",
      "Multi-site standardisation.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [serviceArticle, systemsArticle],
  },
  {
    slug: "restaurant-closing-checklist",
    title: "Restaurant Closing Checklist",
    category: "Hospitality",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/restaurant-closing-checklist.pdf",
    description:
      "A structured closing checklist that helps teams finish every day the right way.",
    heroDescription:
      "A practical closing routine for protecting standards, reducing morning friction and creating cleaner handovers.",
    whoFor: [
      "Closing managers and supervisors.",
      "Hospitality teams improving end-of-day consistency.",
      "Operators who want fewer surprises the next morning.",
    ],
    included: [
      "Service close-down checks.",
      "Cleaning and reset prompts.",
      "Cash, stock and security review items.",
      "Notes for the next manager.",
    ],
    worksWellWith: [
      "End-of-shift handovers.",
      "Daily manager reports.",
      "Training and accountability routines.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [serviceArticle, systemsArticle],
  },
  {
    slug: "manager-handover-template",
    title: "Manager Handover Template",
    category: "Hospitality",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/manager-handover-template.pdf",
    description:
      "A clear shift handover template that improves communication between managers.",
    heroDescription:
      "A simple handover template for making sure important shift information moves cleanly from one manager to the next.",
    whoFor: [
      "Hospitality managers sharing shift responsibility.",
      "Venue leaders managing multi-shift operations.",
      "Teams that need clearer communication without longer meetings.",
    ],
    included: [
      "Shift summary fields.",
      "Customer, team and stock notes.",
      "Open issues and follow-up actions.",
      "Priority items for the next shift.",
    ],
    worksWellWith: [
      "Opening and closing checklists.",
      "Manager communication logs.",
      "Weekly operational reviews.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [serviceArticle, decisionsArticle],
  },
  {
    slug: "chatgpt-prompt-pack-for-managers",
    title: "ChatGPT Prompt Pack for Managers",
    category: "AI",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/chatgpt-prompt-pack-for-managers.pdf",
    description:
      "A curated collection of prompts for meetings, planning, reporting and daily management.",
    heroDescription:
      "A practical prompt pack for managers who want AI to support clearer communication, planning and follow-through.",
    whoFor: [
      "Managers starting to use AI at work.",
      "Operators who want useful prompts without technical complexity.",
      "Leaders improving meeting notes, planning and reporting.",
    ],
    included: [
      "Meeting preparation prompts.",
      "Planning and prioritisation prompts.",
      "Reporting and summary prompts.",
      "Daily management workflow prompts.",
    ],
    worksWellWith: [
      "Weekly business reviews.",
      "Manager handovers.",
      "Team planning sessions.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [systemsArticle, decisionsArticle],
  },
  {
    slug: "ai-meeting-assistant",
    title: "AI Meeting Assistant",
    category: "AI",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/ai-meeting-assistant.pdf",
    description:
      "Use AI to capture meetings, identify actions and improve accountability.",
    heroDescription:
      "A focused AI workflow for turning meeting discussion into useful notes, decisions and accountable next steps.",
    whoFor: [
      "Managers who run regular meetings.",
      "Teams that leave meetings without clear ownership.",
      "Operators improving accountability without more admin.",
    ],
    included: [
      "Meeting capture workflow.",
      "Action extraction prompts.",
      "Decision summary prompts.",
      "Follow-up and accountability checklist.",
    ],
    worksWellWith: [
      "Leadership meetings.",
      "Weekly reviews.",
      "Project check-ins.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [decisionsArticle, systemsArticle],
  },
  {
    slug: "ai-productivity-toolkit",
    title: "AI Productivity Toolkit",
    category: "AI",
    status: "Available",
    fileType: "PDF",
    fileUrl: "/resources/ai-productivity-toolkit.pdf",
    description:
      "Practical AI workflows that save time without adding complexity.",
    heroDescription:
      "A calm, practical toolkit for using AI to reduce repetitive work, improve clarity and protect attention.",
    whoFor: [
      "Operators and creators exploring AI workflows.",
      "Managers who want time savings without overcomplicating work.",
      "Small teams building better daily systems.",
    ],
    included: [
      "Task batching prompts.",
      "Writing and editing workflows.",
      "Research and summary prompts.",
      "Simple review routines for AI output.",
    ],
    worksWellWith: [
      "Weekly planning.",
      "Content creation.",
      "Operational reporting.",
    ],
    relatedBooks: [scalingHospitality, secondAct],
    relatedArticles: [systemsArticle, lifeArticle],
  },
  {
    slug: "annual-review-workbook",
    title: "Annual Review Workbook",
    category: "Personal Growth",
    fileType: "PDF",
    description:
      "Reflect on the past year and build a better one.",
    heroDescription:
      "A thoughtful annual review for making sense of the year behind you and choosing the next year with more intention.",
    whoFor: [
      "People reviewing goals, habits and personal direction.",
      "Readers building a more intentional second act.",
      "Creators and operators who want reflection without vague motivation.",
    ],
    included: [
      "Year-in-review prompts.",
      "Decision and lesson reflection pages.",
      "Energy, relationships and work review sections.",
      "Next-year priorities and commitments.",
    ],
    worksWellWith: [
      "End-of-year planning.",
      "Personal strategy days.",
      "Quarterly life reviews.",
    ],
    relatedBooks: [secondAct],
    relatedArticles: [lifeArticle, decisionsArticle],
  },
  {
    slug: "decision-journal",
    title: "Decision Journal",
    category: "Personal Growth",
    fileType: "PDF",
    description:
      "Record important decisions and improve your thinking over time.",
    heroDescription:
      "A decision journal for capturing why a choice was made, what was known at the time and what can be learned later.",
    whoFor: [
      "People making important life, work or money decisions.",
      "Managers improving judgement over time.",
      "Readers who want clearer thinking and better feedback loops.",
    ],
    included: [
      "Decision context prompts.",
      "Assumption and risk fields.",
      "Expected outcome notes.",
      "Review and learning sections.",
    ],
    worksWellWith: [
      "Major life decisions.",
      "Business decisions.",
      "Investment reviews.",
    ],
    relatedBooks: [secondAct, scalingHospitality],
    relatedArticles: [decisionsArticle, lifeArticle],
  },
  {
    slug: "reading-tracker",
    title: "Reading Tracker",
    category: "Personal Growth",
    fileType: "PDF",
    description:
      "Track books, key ideas and lessons worth remembering.",
    heroDescription:
      "A simple reading tracker for capturing the ideas, lessons and questions that make a book worth keeping.",
    whoFor: [
      "Readers who want to remember more of what they read.",
      "Creators collecting useful ideas.",
      "People turning reading into applied learning.",
    ],
    included: [
      "Book log pages.",
      "Key idea capture fields.",
      "Lesson and action prompts.",
      "Favourite quote and follow-up sections.",
    ],
    worksWellWith: [
      "Business reading.",
      "Fiction reflection.",
      "Personal learning systems.",
    ],
    relatedBooks: [secondAct, scalingHospitality],
    relatedArticles: [lifeArticle, systemsArticle],
  },
  {
    slug: "investment-thesis-template",
    title: "Investment Thesis Template",
    category: "Investing",
    fileType: "PDF",
    description:
      "Create a structured investment thesis before buying any asset.",
    heroDescription:
      "A calm investment thesis template for clarifying why an asset deserves capital before emotion gets involved.",
    whoFor: [
      "Long-term investors building a repeatable process.",
      "People who want clearer thinking before buying assets.",
      "Business owners and operators learning to assess opportunity.",
    ],
    included: [
      "Investment rationale prompts.",
      "Risk and downside review fields.",
      "Time horizon and position sizing notes.",
      "Exit and review criteria.",
    ],
    worksWellWith: [
      "Company research.",
      "Portfolio reviews.",
      "Decision journaling.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [ownershipArticle, decisionsArticle],
  },
  {
    slug: "company-research-worksheet",
    title: "Company Research Worksheet",
    category: "Investing",
    fileType: "PDF",
    description:
      "Research businesses using a repeatable framework.",
    heroDescription:
      "A repeatable worksheet for understanding a company before relying on a headline, hot take or share price.",
    whoFor: [
      "Investors researching individual companies.",
      "Operators studying how strong businesses work.",
      "Readers who want a calmer research process.",
    ],
    included: [
      "Business model review prompts.",
      "Competitive advantage questions.",
      "Management and financial quality checks.",
      "Risks, valuation and thesis notes.",
    ],
    worksWellWith: [
      "Investment thesis writing.",
      "Portfolio reviews.",
      "Business model study.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [ownershipArticle, systemsArticle],
  },
  {
    slug: "bitcoin-thesis-worksheet",
    title: "Bitcoin Thesis Worksheet",
    category: "Investing",
    fileType: "PDF",
    description:
      "Think critically about Bitcoin's role in a long-term portfolio.",
    heroDescription:
      "A worksheet for separating Bitcoin research, risk, conviction and portfolio role from short-term price emotion.",
    whoFor: [
      "Investors studying Bitcoin without hype.",
      "People deciding whether Bitcoin fits their long-term plan.",
      "Readers who want a balanced research framework.",
    ],
    included: [
      "Bitcoin thesis prompts.",
      "Risk and misconception checks.",
      "Position sizing and time horizon questions.",
      "Review criteria for future decisions.",
    ],
    worksWellWith: [
      "Investment thesis writing.",
      "Portfolio reviews.",
      "Decision journaling.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [bitcoinArticle, ownershipArticle],
  },
  {
    slug: "portfolio-review-template",
    title: "Portfolio Review Template",
    category: "Investing",
    fileType: "PDF",
    description:
      "Review your portfolio objectively instead of emotionally.",
    heroDescription:
      "A structured portfolio review for checking allocation, risk and decision quality before emotion takes over.",
    whoFor: [
      "Long-term investors reviewing their portfolio.",
      "People who want a calmer investment process.",
      "Investors checking whether their actions still match their plan.",
    ],
    included: [
      "Allocation review sections.",
      "Risk and concentration checks.",
      "Decision quality prompts.",
      "Next action and review cadence fields.",
    ],
    worksWellWith: [
      "Quarterly portfolio reviews.",
      "Investment thesis updates.",
      "Decision journaling.",
    ],
    relatedBooks: [scalingHospitality],
    relatedArticles: [ownershipArticle, decisionsArticle, bitcoinArticle],
  },
];

export const resourceCategories: ResourceCategory[] = [
  "Business",
  "Hospitality",
  "AI",
  "Personal Growth",
  "Investing",
];

export function getResourceBySlug(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}

export function getResourcesByCategory(category: ResourceCategory) {
  return resources.filter((resource) => resource.category === category);
}
