export interface StockDetailData {
  companyName: string;
  ticker: string;
  price: string;
  changePercent: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  explanation: string;
  news: Array<{
    id: string;
    headline: string;
    source: string;
    sentiment: "positive" | "neutral" | "negative";
  }>;
  companySnapshot: {
    marketCap: string;
    sector: string;
    ceo: string;
    earningsDate: string;
    volume: string;
  };
}

const stockDatabase: Record<string, StockDetailData> = {
  AAPL: {
    companyName: "Apple Inc.",
    ticker: "AAPL",
    price: "$178.24",
    changePercent: 2.44,
    signal: "BUY",
    confidence: 84,
    explanation:
      "Our model indicates strong momentum and positive sentiment from recent news. Technical levels suggest support at $172. Risk-adjusted outlook favors a long position with a suggested horizon of 2–4 weeks.",
    news: [
      {
        id: "1",
        headline: "Apple announces new AI features for next iPhone release",
        source: "Reuters",
        sentiment: "positive",
      },
      {
        id: "2",
        headline: "Apple stock hits record high on services growth",
        source: "Bloomberg",
        sentiment: "positive",
      },
      {
        id: "3",
        headline: "Analysts raise price targets amid strong earnings",
        source: "CNBC",
        sentiment: "positive",
      },
      {
        id: "4",
        headline: "Apple faces regulatory scrutiny in EU",
        source: "Financial Times",
        sentiment: "neutral",
      },
      {
        id: "5",
        headline: "Apple Watch sales beat expectations",
        source: "WSJ",
        sentiment: "positive",
      },
    ],
    companySnapshot: {
      marketCap: "$2.89T",
      sector: "Technology",
      ceo: "Tim Cook",
      earningsDate: "Jan 30, 2025",
      volume: "52.4M",
    },
  },
  TSLA: {
    companyName: "Tesla, Inc.",
    ticker: "TSLA",
    price: "$248.50",
    changePercent: -1.24,
    signal: "HOLD",
    confidence: 72,
    explanation:
      "Mixed signals from EV demand data and delivery numbers. Sentiment remains cautious. We recommend holding until next earnings for clearer directional bias.",
    news: [
      {
        id: "1",
        headline: "Tesla Q4 deliveries miss estimates",
        source: "Reuters",
        sentiment: "negative",
      },
      {
        id: "2",
        headline: "Tesla Cybertruck production ramps up",
        source: "Bloomberg",
        sentiment: "positive",
      },
      {
        id: "3",
        headline: "EV competition intensifies in key markets",
        source: "CNBC",
        sentiment: "neutral",
      },
      {
        id: "4",
        headline: "Tesla FSD software update receives positive reviews",
        source: "TechCrunch",
        sentiment: "positive",
      },
    ],
    companySnapshot: {
      marketCap: "$789B",
      sector: "Automotive",
      ceo: "Elon Musk",
      earningsDate: "Jan 22, 2025",
      volume: "98.2M",
    },
  },
  GOOGL: {
    companyName: "Alphabet Inc.",
    ticker: "GOOGL",
    price: "$142.80",
    changePercent: 0.85,
    signal: "BUY",
    confidence: 78,
    explanation:
      "Strong ad revenue trends and AI investments support a favorable outlook. Valuation remains attractive relative to growth.",
    news: [
      {
        id: "1",
        headline: "Google Cloud revenue exceeds expectations",
        source: "Reuters",
        sentiment: "positive",
      },
      {
        id: "2",
        headline: "Alphabet announces new AI product lineup",
        source: "Bloomberg",
        sentiment: "positive",
      },
    ],
    companySnapshot: {
      marketCap: "$1.78T",
      sector: "Technology",
      ceo: "Sundar Pichai",
      earningsDate: "Jan 28, 2025",
      volume: "24.1M",
    },
  },
};

const defaultStock: StockDetailData = stockDatabase.AAPL;

export function getStockData(ticker: string): StockDetailData {
  const normalized = ticker.toUpperCase();
  return stockDatabase[normalized] ?? { ...defaultStock, ticker: normalized, companyName: `${normalized} Inc.` };
}
