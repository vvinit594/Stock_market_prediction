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
