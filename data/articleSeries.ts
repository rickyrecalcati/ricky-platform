export type ArticleSeries = "Balance Sheet" | "Business Breakdown";

export const articleSeriesDetails: Record<
  ArticleSeries,
  {
    label: string;
    pageDescription: string;
    cardLabel: string;
    publicationFrequency: "Weekly";
  }
> = {
  "Balance Sheet": {
    label: "Balance Sheet",
    cardLabel: "Weekly - Monday",
    pageDescription: "Weekly market review • Published every Monday",
    publicationFrequency: "Weekly",
  },
  "Business Breakdown": {
    label: "Business Breakdown",
    cardLabel: "Weekly - Wednesday",
    pageDescription: "Company analysis • Published every Wednesday",
    publicationFrequency: "Weekly",
  },
};
