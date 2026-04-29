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

export const mockNews: NewsItem[] = [
  {
    id: "1",
    headline: "Tech sector leads rally as AI earnings beat expectations",
    summary: "Major technology companies reported stronger-than-expected quarterly results, with AI-driven revenue growth cited across the board.",
    source: "Reuters",
    timestamp: "2h ago",
    sentiment: "positive",
    sector: "Technology",
    highImpact: true,
  },
  {
    id: "2",
    headline: "Fed signals cautious stance on rate cuts amid inflation data",
    summary: "Federal Reserve officials indicated a measured approach to monetary policy as latest inflation figures remain above target.",
    source: "Bloomberg",
    timestamp: "3h ago",
    sentiment: "neutral",
    sector: "Macro",
    highImpact: true,
  },
  {
    id: "3",
    headline: "Electric vehicle demand concerns weigh on automotive stocks",
    summary: "Slowing EV adoption rates and increased competition have analysts revising growth forecasts for the sector.",
    source: "Financial Times",
    timestamp: "4h ago",
    sentiment: "negative",
    sector: "Automotive",
    highImpact: false,
  },
  {
    id: "4",
    headline: "Healthcare sector gains on drug approval news",
    summary: "Several biotech firms surged after FDA approval announcements, buoying sector sentiment.",
    source: "CNBC",
    timestamp: "5h ago",
    sentiment: "positive",
    sector: "Healthcare",
    highImpact: false,
  },
  {
    id: "5",
    headline: "Oil prices stabilize as supply concerns ease",
    summary: "Crude benchmarks held steady amid mixed signals from OPEC+ and inventory data.",
    source: "WSJ",
    timestamp: "6h ago",
    sentiment: "neutral",
    sector: "Energy",
    highImpact: false,
  },
  {
    id: "6",
    headline: "Retail earnings show resilient consumer spending",
    summary: "Quarterly reports from major retailers suggest sustained consumer demand despite economic headwinds.",
    source: "Reuters",
    timestamp: "7h ago",
    sentiment: "positive",
    sector: "Consumer",
    highImpact: true,
  },
  {
    id: "7",
    headline: "Semiconductor supply chain faces new bottlenecks",
    summary: "Industry reports indicate potential disruptions in key manufacturing regions.",
    source: "TechCrunch",
    timestamp: "8h ago",
    sentiment: "negative",
    sector: "Technology",
    highImpact: false,
  },
];

export const mockTrendingTopics: TrendingTopic[] = [
  { id: "1", name: "Artificial Intelligence", sentiment: "up", mentionCount: "2.4k" },
  { id: "2", name: "Electric Vehicles", sentiment: "down", mentionCount: "1.8k" },
  { id: "3", name: "Federal Reserve", sentiment: "neutral", mentionCount: "1.5k" },
  { id: "4", name: "Semiconductors", sentiment: "down", mentionCount: "1.2k" },
  { id: "5", name: "Healthcare", sentiment: "up", mentionCount: "980" },
  { id: "6", name: "Oil & Gas", sentiment: "neutral", mentionCount: "756" },
];

export const mockAIInsight =
  "Market sentiment has shifted modestly bullish over the past 24 hours, driven primarily by strong tech earnings and resilient retail data. AI-related themes continue to dominate positive narratives, while automotive and semiconductor sectors show heightened caution. Overall, the intelligence suggests a cautiously optimistic tone with sector rotation likely in the near term.";
