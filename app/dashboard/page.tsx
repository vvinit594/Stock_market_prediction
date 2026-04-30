import { MarketSummaryCard } from "@/components/dashboard/MarketSummaryCard";
import { PriceTrendCard } from "@/components/dashboard/PriceTrendCard";
import { SentimentTimelineCard } from "@/components/dashboard/SentimentTimelineCard";
import { AIPredictionPanel } from "@/components/dashboard/AIPredictionPanel";
import { LatestNewsPanel } from "@/components/dashboard/LatestNewsPanel";
import { WatchlistSection } from "@/components/dashboard/WatchlistSection";
import { backendGet } from "@/lib/backend-api";

type DashboardPayload = {
  symbol: string;
  current_price: number;
  daily_change: number;
  sentiment_score: number;
  ai_signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
};

interface DashboardPageProps {
  searchParams?: Promise<{ symbol?: string }>;
}

const mockWatchlist = [
  { symbol: "AAPL", trend: "up" as const, signal: "BUY" as const, change: "+2.4%" },
  { symbol: "TSLA", trend: "down" as const, signal: "HOLD" as const, change: "-1.2%" },
  { symbol: "GOOGL", trend: "up" as const, signal: "BUY" as const, change: "+0.8%" },
  { symbol: "MSFT", trend: "up" as const, signal: "BUY" as const, change: "+1.5%" },
  { symbol: "AMZN", trend: "down" as const, signal: "SELL" as const, change: "-0.9%" },
  { symbol: "NVDA", trend: "up" as const, signal: "BUY" as const, change: "+3.1%" },
  { symbol: "META", trend: "up" as const, signal: "HOLD" as const, change: "+0.4%" },
];

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  type Signal = "BUY" | "SELL" | "HOLD";
  const params = (await searchParams) ?? {};
  const symbol = (params.symbol || "AAPL").toUpperCase();
  let dashboard: DashboardPayload | null = null;
  let news: { id: string; headline: string; source: string; sentiment: "positive" | "neutral" | "negative" }[] = [];
  let hasBackendError = false;
  let prediction: { signal: Signal; confidence: number; explanation: string } = {
    signal: "BUY",
    confidence: 84,
    explanation: "Prediction service unavailable.",
  };

  try {
    const [dashboardRes, newsRes, predictRes] = await Promise.all([
      backendGet<DashboardPayload>(`/api/dashboard/${symbol}`),
      backendGet<
        {
          title: string;
          source: string | null;
          sentiment_label: "positive" | "neutral" | "negative" | null;
        }[]
      >(`/api/news/${symbol}`),
      backendGet<{ signal: "BUY" | "SELL" | "HOLD"; confidence: number; explanation: string }>(`/api/predict/${symbol}`),
    ]);
    dashboard = dashboardRes;
    news = newsRes.slice(0, 5).map((n, i) => ({
      id: String(i + 1),
      headline: n.title,
      source: n.source || "Unknown",
      sentiment: (n.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
    }));
    prediction = {
      signal: predictRes.signal,
      confidence: Math.round(predictRes.confidence * 100),
      explanation: predictRes.explanation,
    };
  } catch {
    hasBackendError = true;
  }

  const currentPrice = dashboard ? `$${dashboard.current_price.toFixed(2)}` : "$178.24";
  const dailyChange = dashboard ? `${dashboard.daily_change >= 0 ? "+" : ""}${dashboard.daily_change.toFixed(2)}%` : "+2.44%";
  const sentimentPct = dashboard ? `${Math.round(dashboard.sentiment_score * 100)}%` : "72%";
  const signal = dashboard?.ai_signal || "BUY";

  return (
    <>
      {hasBackendError && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          Backend unavailable. Showing fallback dashboard values.
        </div>
      )}
      {/* Market Summary - 4 cards */}
        <section
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Market summary"
        >
          <MarketSummaryCard
            icon="dollar"
            value={currentPrice}
            label="Current Stock Price"
            delay={0}
          />
          <MarketSummaryCard
            icon="trend"
            value={dailyChange}
            label="Daily Change"
            variant={dailyChange.startsWith("-") ? "negative" : "positive"}
            delay={0.05}
          />
          <MarketSummaryCard
            icon="sentiment"
            value={sentimentPct}
            label="Sentiment Score"
            variant="positive"
            delay={0.1}
          />
          <MarketSummaryCard
            icon="signal"
            value={signal}
            label="AI Prediction Signal"
            variant="positive"
            delay={0.15}
          />
        </section>

        {/* Main content grid - two columns */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Left column - 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            <PriceTrendCard />
            <SentimentTimelineCard />
          </div>

          {/* Right column - 1/3 */}
          <div className="space-y-6">
            <AIPredictionPanel
              signal={prediction.signal}
              confidence={prediction.confidence}
              explanation={prediction.explanation}
            />
            <LatestNewsPanel items={news} />
          </div>
        </div>

      {/* Watchlist strip */}
      <WatchlistSection items={mockWatchlist} />
    </>
  );
}
