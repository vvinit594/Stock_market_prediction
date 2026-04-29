export type Signal = "BUY" | "SELL" | "HOLD";

export interface WatchlistItem {
  id: string;
  symbol: string;
  companyName: string;
  price: string;
  changePercent: number;
  signal: Signal;
  sentiment: number;
  sparklineData: number[];
}

export interface PortfolioSummary {
  totalValue: string;
  todayGainLoss: number;
  bestPerformer: { symbol: string; change: number };
  worstPerformer: { symbol: string; change: number };
}

export interface QuickInsight {
  bullishStock: { symbol: string; companyName: string };
  bearishStock: { symbol: string; companyName: string };
  aiSummary: string;
}

export const mockWatchlist: WatchlistItem[] = [
  {
    id: "1",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    price: "$178.24",
    changePercent: 2.44,
    signal: "BUY",
    sentiment: 72,
    sparklineData: [40, 45, 42, 52, 55, 62, 68, 72],
  },
  {
    id: "2",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    price: "$248.50",
    changePercent: -1.24,
    signal: "HOLD",
    sentiment: 55,
    sparklineData: [60, 58, 55, 52, 48, 50, 49, 48],
  },
  {
    id: "3",
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    price: "$142.80",
    changePercent: 0.85,
    signal: "BUY",
    sentiment: 68,
    sparklineData: [55, 56, 58, 57, 60, 62, 61, 63],
  },
  {
    id: "4",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    price: "$415.60",
    changePercent: 1.52,
    signal: "BUY",
    sentiment: 78,
    sparklineData: [65, 68, 70, 72, 71, 75, 78, 80],
  },
  {
    id: "5",
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    price: "$178.90",
    changePercent: -0.92,
    signal: "SELL",
    sentiment: 48,
    sparklineData: [70, 68, 65, 62, 60, 58, 55, 52],
  },
  {
    id: "6",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    price: "$485.20",
    changePercent: 3.18,
    signal: "BUY",
    sentiment: 82,
    sparklineData: [50, 55, 58, 62, 68, 72, 78, 85],
  },
];

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue: "$124,580.00",
  todayGainLoss: 1.24,
  bestPerformer: { symbol: "NVDA", change: 3.18 },
  worstPerformer: { symbol: "AMZN", change: -0.92 },
};

export const mockQuickInsight: QuickInsight = {
  bullishStock: { symbol: "NVDA", companyName: "NVIDIA Corporation" },
  bearishStock: { symbol: "AMZN", companyName: "Amazon.com, Inc." },
  aiSummary:
    "Your watchlist shows a tech-heavy bias with mixed momentum. NVDA and MSFT lead with strong AI narratives. Consider diversifying into healthcare or consumer sectors to balance risk.",
};
