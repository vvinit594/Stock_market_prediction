export type NewsSentiment = "positive" | "neutral" | "negative";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: NewsSentiment;
  sector?: string;
  highImpact?: boolean;
}

export interface TrendingTopic {
  id: string;
  name: string;
  sentiment: "up" | "down" | "neutral";
  mentionCount: string;
}
