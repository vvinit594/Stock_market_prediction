import { StockHeader } from "@/components/stock/StockHeader";
import { PriceChartCard } from "@/components/stock/PriceChartCard";
import { TechnicalIndicatorsCard } from "@/components/stock/TechnicalIndicatorsCard";
import { SentimentTimelineCard } from "@/components/stock/SentimentTimelineCard";
import { AIPredictionInsightCard } from "@/components/stock/AIPredictionInsightCard";
import { NewsImpactCard } from "@/components/stock/NewsImpactCard";
import { CompanySnapshotCard } from "@/components/stock/CompanySnapshotCard";
import { backendGet } from "@/lib/backend-api";

export interface StockDetailPageProps {
  params: Promise<{ ticker: string }>;
}

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { ticker } = await params;
  let hasBackendError = false;
  let data = {
    companyName: `${ticker.toUpperCase()} Inc.`,
    ticker: ticker.toUpperCase(),
    price: "$0.00",
    changePercent: 0,
    signal: "HOLD" as "BUY" | "SELL" | "HOLD",
    confidence: 50,
    explanation: "Waiting for backend response.",
    news: [] as { id: string; headline: string; source: string; sentiment: "positive" | "neutral" | "negative" }[],
    companySnapshot: {
      marketCap: "-",
      sector: "-",
      ceo: "-",
      earningsDate: "-",
      volume: "-",
    },
  };

  try {
    const [detail, dashboard, news] = await Promise.all([
      backendGet<{
        symbol: string;
        history: { close: number; volume: number }[];
        prediction: { signal: "BUY" | "SELL" | "HOLD"; confidence: number; explanation: string };
      }>(`/api/stock/${ticker}`),
      backendGet<{ current_price: number; daily_change: number }>(`/api/dashboard/${ticker}`),
      backendGet<
        { title: string; source: string | null; sentiment_label: "positive" | "neutral" | "negative" | null }[]
      >(`/api/news/${ticker}`),
    ]);

    data = {
      ...data,
      companyName: `${detail.symbol} Inc.`,
      ticker: detail.symbol,
      price: `$${dashboard.current_price.toFixed(2)}`,
      changePercent: dashboard.daily_change,
      signal: detail.prediction.signal,
      confidence: Math.round(detail.prediction.confidence * 100),
      explanation: detail.prediction.explanation,
      news: news.slice(0, 5).map((n, i) => ({
        id: String(i + 1),
        headline: n.title,
        source: n.source || "Unknown",
        sentiment: (n.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
      })),
      companySnapshot: {
        marketCap: "-",
        sector: "Technology",
        ceo: "-",
        earningsDate: "-",
        volume: detail.history.length ? `${Math.round(detail.history[detail.history.length - 1].volume / 1_000_000)}M` : "-",
      },
    };
  } catch {
    hasBackendError = true;
  }

  return (
    <div className="space-y-8 pb-8">
      {hasBackendError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          Backend unavailable. Showing fallback stock details.
        </div>
      )}
      <StockHeader
        companyName={data.companyName}
        ticker={data.ticker}
        price={data.price}
        changePercent={data.changePercent}
        signal={data.signal}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Primary Analysis */}
        <div className="space-y-6 lg:col-span-2">
          <PriceChartCard />
          <TechnicalIndicatorsCard />
          <SentimentTimelineCard />
        </div>

        {/* Right column - Insights & Context */}
        <div className="space-y-6">
          <AIPredictionInsightCard
            signal={data.signal}
            confidence={data.confidence}
            explanation={data.explanation}
          />
          <NewsImpactCard items={data.news} />
          <CompanySnapshotCard data={data.companySnapshot} />
        </div>
      </div>
    </div>
  );
}
