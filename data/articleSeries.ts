export type ArticleSeries = "Balance Sheet" | "Business Breakdown";

export const articleSeriesDetails: Record<
  ArticleSeries,
  {
    label: string;
    pageDescription: string;
    publicationFrequency: "Weekly";
  }
> = {
  "Balance Sheet": {
    label: "Balance Sheet",
    pageDescription: "Weekly market review • Published every Monday",
    publicationFrequency: "Weekly",
  },
  "Business Breakdown": {
    label: "Business Breakdown",
    pageDescription: "Company analysis • Published every Wednesday",
    publicationFrequency: "Weekly",
  },
};
