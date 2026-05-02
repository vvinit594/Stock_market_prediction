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

type StockDetail = {
  symbol: string;
  company_name: string | null;
  sector: string | null;
  market_cap: string | null;
  ceo: string | null;
  current_price: number;
  change_percent: number;
  volume: number | null;
  history: { close: number; volume: number }[];
  indicators: {
    ma10: number;
    ma50: number;
    rsi: number;
    macd: number;
    bollinger: { upper: number; lower: number };
  };
  prediction: { signal: "BUY" | "SELL" | "HOLD"; confidence: number; explanation: string };
  sentiment_timeline: { date: string; score: number }[];
};

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  let hasBackendError = false;

  let companyName = sym;
  let price = "—";
  let changePercent = 0;
  let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
  let confidence = 0;
  let explanation = "Loading…";
  let news: { id: string; headline: string; source: string; sentiment: "positive" | "neutral" | "negative" }[] =
    [];
  let companySnapshot = {
    marketCap: "—",
    sector: "—",
    ceo: "—",
    earningsDate: "—",
    volume: "—",
  };
  let closes: number[] = [];
  let sentimentScores: number[] = [];
  let rsi = 0;
  let macd = 0;
  let ma10 = 0;
  let ma50 = 0;
  let lastClose = 0;
  let bbUpper = 0;
  let bbLower = 0;

  try {
    const [detail, newsRows] = await Promise.all([
      backendGet<StockDetail>(`/api/stock/${sym}`),
      backendGet<
        { title: string; source: string | null; sentiment_label: "positive" | "neutral" | "negative" | null }[]
      >(`/api/news/${sym}`),
    ]);

    companyName = detail.company_name || detail.symbol;
    price = `$${detail.current_price.toFixed(2)}`;
    changePercent = detail.change_percent;
    signal = detail.prediction.signal;
    confidence = Math.round(detail.prediction.confidence * 100);
    explanation = detail.prediction.explanation;
    news = newsRows.slice(0, 5).map((n, i) => ({
      id: String(i + 1),
      headline: n.title,
      source: n.source || "Unknown",
      sentiment: (n.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
    }));
    closes = detail.history.map((h) => h.close);
    sentimentScores = detail.sentiment_timeline.map((t) => t.score);
    rsi = detail.indicators.rsi;
    macd = detail.indicators.macd;
    ma10 = detail.indicators.ma10;
    ma50 = detail.indicators.ma50;
    bbUpper = detail.indicators.bollinger.upper;
    bbLower = detail.indicators.bollinger.lower;
    lastClose = detail.history.length ? detail.history[detail.history.length - 1].close : detail.current_price;

    const vol = detail.volume;
    companySnapshot = {
      marketCap: detail.market_cap ?? "—",
      sector: detail.sector ?? "—",
      ceo: detail.ceo ?? "—",
      earningsDate: "—",
      volume: vol != null ? vol.toLocaleString() : "—",
    };
  } catch {
    hasBackendError = true;
  }

  return (
    <div className="space-y-8 pb-8">
      {hasBackendError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          Could not load live data for {sym}. Verify the backend is running and market data is available.
        </div>
      )}
      <StockHeader
        companyName={companyName}
        ticker={sym}
        price={price}
        changePercent={changePercent}
        signal={signal}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PriceChartCard closes={closes} />
          <TechnicalIndicatorsCard
            rsi={rsi}
            macd={macd}
            ma10={ma10}
            ma50={ma50}
            lastClose={lastClose}
            bbUpper={bbUpper}
            bbLower={bbLower}
          />
          <SentimentTimelineCard scores={sentimentScores} />
        </div>

        <div className="space-y-6">
          <AIPredictionInsightCard
            signal={signal}
            confidence={confidence}
            explanation={explanation}
          />
          <NewsImpactCard items={news} />
          <CompanySnapshotCard data={companySnapshot} />
        </div>
      </div>
    </div>
  );
}
