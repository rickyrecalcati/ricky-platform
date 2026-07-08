export type ArticleContentSection = {
  heading: string;
  body: string[];
  points?: string[];
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
  author: string;
  sections: ArticleContentSection[];
};

export const articles: Article[] = [
  {
    slug: "why-better-systems-build-better-businesses",
    title: "Why Better Systems Build Better Businesses",
    category: "Business",
    excerpt:
      "A business becomes stronger when the important work is no longer dependent on memory, urgency or heroic effort.",
    date: "2026-07-01",
    readingTime: "5 min read",
    author: "Ricky Recalcati",
    sections: [
      {
        heading: "A good system lowers the cost of doing things well.",
        body: [
          "Most businesses do not struggle because people are lazy. They struggle because the work depends on too much memory, too many assumptions and too many small decisions made under pressure.",
          "A better system does not remove judgement. It protects judgement. It gives people a clear way to handle repeatable work so their attention can go to the moments that actually need thought.",
        ],
      },
      {
        heading: "The best businesses make quality repeatable.",
        body: [
          "Consistency is not a personality trait. It is an operating result. When standards are clear, training is simple and feedback is regular, the business becomes easier to trust from the inside and the outside.",
          "That is why systems matter. They turn good intent into something the team can repeat on an ordinary Tuesday, not only when the owner is watching.",
        ],
        points: [
          "Document the decisions that happen repeatedly.",
          "Measure the few numbers that reveal the health of the work.",
          "Create review rhythms before problems become emergencies.",
        ],
      },
      {
        heading: "Systems create room to think.",
        body: [
          "The point of a system is not more administration. It is less noise. When the basics are handled, leaders get more space to notice patterns, coach people and make better decisions.",
          "A business built on good systems can still be human, warm and creative. It simply stops asking people to carry the whole operation in their heads.",
        ],
      },
    ],
  },
  {
    slug: "the-system-is-the-service",
    title: "The System Is the Service",
    category: "Operations",
    excerpt:
      "Customer experience is not created at the counter. It is created by the operating choices made long before the customer arrives.",
    date: "2026-07-08",
    readingTime: "4 min read",
    author: "Ricky Recalcati",
    sections: [
      {
        heading: "Service starts before the service moment.",
        body: [
          "A customer only sees the final few seconds of a much larger system. They see the greeting, the timing, the handover and the result. They do not see the roster, the ordering process, the training standard or the communication that made the moment possible.",
          "That hidden work is the service. The visible experience is only the last step.",
        ],
      },
      {
        heading: "Great experiences are designed upstream.",
        body: [
          "When a business treats service as personality, quality becomes fragile. It depends on who is working, how busy they are and whether someone remembers the details.",
          "When a business treats service as a system, quality becomes easier to repeat. The team knows what good looks like. Leaders know what to coach. Customers feel the difference without needing to understand why.",
        ],
        points: [
          "Make the standard visible.",
          "Remove friction from the moments that matter most.",
          "Train the reason behind the process, not just the steps.",
        ],
      },
      {
        heading: "Warmth and structure belong together.",
        body: [
          "A system should never make service feel mechanical. It should remove the avoidable problems that stop people from being present.",
          "The better the system, the more human the service can feel.",
        ],
      },
    ],
  },
  {
    slug: "better-decisions-compound-quietly",
    title: "Better Decisions Compound Quietly",
    category: "Business",
    excerpt:
      "The strongest decisions rarely feel dramatic in the moment. Their value appears through repetition, patience and better feedback.",
    date: "2026-07-15",
    readingTime: "5 min read",
    author: "Ricky Recalcati",
    sections: [
      {
        heading: "Most progress is not loud.",
        body: [
          "Better decisions often look unimpressive at first. They are the small choices to review a number, ask a clearer question, pause before reacting or fix the root cause instead of the symptom.",
          "The result is rarely immediate. But over time, the gap between reactive decisions and thoughtful decisions becomes difficult to ignore.",
        ],
      },
      {
        heading: "Decision quality improves with feedback.",
        body: [
          "People often judge a decision by the outcome. That is understandable, but incomplete. A good outcome can come from luck. A poor outcome can follow a sound decision made with limited information.",
          "The better question is whether the decision process is improving. Are you seeing the right facts sooner? Are you asking better questions? Are you learning from what happened without rewriting the past?",
        ],
        points: [
          "Separate the decision from the outcome.",
          "Write down the reason for important choices.",
          "Review decisions after enough time has passed to learn something useful.",
        ],
      },
      {
        heading: "Small improvements change the future.",
        body: [
          "A better decision today may not transform a business or a life. But better decisions repeated over months change what becomes possible.",
          "Compounding works quietly. That is why it is easy to miss, and why it is worth respecting.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
