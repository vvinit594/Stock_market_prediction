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

type StockDetail = {
  symbol: string;
  company_name: string | null;
  history: { close: number }[];
  prediction: { signal: "BUY" | "SELL" | "HOLD"; confidence: number; explanation: string };
  sentiment_timeline: { date: string; score: number }[];
};

interface DashboardPageProps {
  searchParams?: Promise<{ symbol?: string }>;
}

async function loadWatchlistStrip() {
  try {
    const portfolio = await backendGet<{ symbol: string }[]>("/api/portfolio");
    if (!portfolio.length) return [];
    const keys = portfolio.map((p) => p.symbol).join(",");
    const rows = await backendGet<DashboardPayload[]>(
      `/api/dashboard?symbols=${encodeURIComponent(keys)}`
    );
    return rows.map((row) => ({
      symbol: row.symbol,
      trend: row.daily_change >= 0 ? ("up" as const) : ("down" as const),
      signal: row.ai_signal,
      change: `${row.daily_change >= 0 ? "+" : ""}${row.daily_change.toFixed(2)}%`,
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const symbol = params.symbol?.trim().toUpperCase() || "";

  const stripItems = await loadWatchlistStrip();

  let dashboard: DashboardPayload | null = null;
  let stockDetail: StockDetail | null = null;
  let news: { id: string; headline: string; source: string; sentiment: "positive" | "neutral" | "negative" }[] =
    [];
  let hasBackendError = false;

  if (symbol) {
    try {
      const [dashboardRes, stockRes, newsRes] = await Promise.all([
        backendGet<DashboardPayload>(`/api/dashboard/${symbol}`),
        backendGet<StockDetail>(`/api/stock/${symbol}`),
        backendGet<
          {
            title: string;
            source: string | null;
            sentiment_label: "positive" | "neutral" | "negative" | null;
          }[]
        >(`/api/news/${symbol}`),
      ]);
      dashboard = dashboardRes;
      stockDetail = stockRes;
      news = newsRes.slice(0, 5).map((n, i) => ({
        id: String(i + 1),
        headline: n.title,
        source: n.source || "Unknown",
        sentiment: (n.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
      }));
    } catch {
      hasBackendError = true;
    }
  }

  const currentPrice =
    dashboard != null ? `$${dashboard.current_price.toFixed(2)}` : symbol ? "—" : "—";
  const dailyChange =
    dashboard != null
      ? `${dashboard.daily_change >= 0 ? "+" : ""}${dashboard.daily_change.toFixed(2)}%`
      : "—";
  const sentimentPct =
    dashboard != null ? `${Math.round((dashboard.sentiment_score + 1) / 2 * 100)}%` : "—";
  const signal = dashboard?.ai_signal ?? "—";

  const prediction = stockDetail
    ? {
        signal: stockDetail.prediction.signal,
        confidence: Math.round(stockDetail.prediction.confidence * 100),
        explanation: stockDetail.prediction.explanation,
      }
    : {
        signal: "HOLD" as const,
        confidence: 0,
        explanation: symbol
          ? "Data unavailable."
          : "Search for a ticker or open a symbol from your watchlist.",
      };

  const closes = stockDetail?.history.map((h) => h.close) ?? [];
  const sentimentScores = stockDetail?.sentiment_timeline.map((t) => t.score) ?? [];

  return (
    <>
      {!symbol && (
        <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
          Enter a ticker in the search bar or add symbols on the Portfolio page. You can also append{" "}
          <code className="rounded bg-white/10 px-1">?symbol=TICKER</code> to this URL.
        </div>
      )}
      {hasBackendError && symbol && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          Could not load live market data for {symbol}. Check the backend, API keys, and your network connection.
        </div>
      )}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Market summary"
      >
        <MarketSummaryCard icon="dollar" value={currentPrice} label="Current Stock Price" delay={0} />
        <MarketSummaryCard
          icon="trend"
          value={dailyChange}
          label="Daily Change"
          variant={dailyChange.startsWith("-") ? "negative" : dailyChange === "—" ? undefined : "positive"}
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
          variant={signal === "SELL" ? "negative" : signal === "HOLD" ? undefined : "positive"}
          delay={0.15}
        />
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PriceTrendCard closes={closes} />
          <SentimentTimelineCard scores={sentimentScores} />
        </div>

        <div className="space-y-6">
          <AIPredictionPanel
            signal={prediction.signal}
            confidence={prediction.confidence}
            explanation={prediction.explanation}
          />
          <LatestNewsPanel items={news} />
        </div>
      </div>

      <WatchlistSection items={stripItems} />
    </>
  );
}
