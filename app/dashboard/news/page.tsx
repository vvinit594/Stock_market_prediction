import { NewsPageHeader } from "@/components/news/NewsPageHeader";
import { SentimentOverviewStrip } from "@/components/news/SentimentOverviewStrip";
import { AICuratedNewsStream } from "@/components/news/AICuratedNewsStream";
import { SentimentTrendCard } from "@/components/news/SentimentTrendCard";
import { TrendingTopicsCard } from "@/components/news/TrendingTopicsCard";
import { AIInsightBox } from "@/components/news/AIInsightBox";
import { backendGet } from "@/lib/backend-api";
import type { NewsItem, TrendingTopic } from "@/lib/news-data";

interface NewsSentimentPageProps {
  searchParams?: Promise<{ symbol?: string }>;
}

function formatNewsTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "have",
  "will",
  "your",
  "their",
  "about",
  "into",
  "than",
  "then",
  "what",
  "when",
  "where",
  "after",
  "before",
  "over",
  "under",
  "between",
  "through",
  "while",
  "during",
  "being",
  "were",
  "been",
  "have",
  "has",
  "had",
  "each",
  "such",
  "only",
  "some",
  "more",
  "most",
  "very",
  "also",
  "just",
  "like",
  "into",
  "news",
  "stock",
  "stocks",
  "market",
  "markets",
]);

function trendingFromHeadlines(headlines: string[]): TrendingTopic[] {
  const counts = new Map<string, number>();
  for (const h of headlines) {
    for (const raw of h.toLowerCase().split(/\W+/)) {
      const w = raw.trim();
      if (w.length < 4 || STOP.has(w)) continue;
      counts.set(w, (counts.get(w) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, n], i) => ({
      id: String(i + 1),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      sentiment: "neutral" as const,
      mentionCount: String(n),
    }));
}

function buildAiBrief(
  rows: { sentiment_label: string | null; sentiment_score: number | null }[]
): string {
  if (!rows.length) {
    return "No headlines loaded yet. Configure NewsAPI or Finnhub on the backend for a live feed.";
  }
  const scores = rows.map((r) => r.sentiment_score ?? 0);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const pos = rows.filter((r) => r.sentiment_label === "positive").length;
  const neg = rows.filter((r) => r.sentiment_label === "negative").length;
  const neu = rows.length - pos - neg;
  const tone = avg > 0.15 ? "positive" : avg < -0.15 ? "negative" : "balanced";
  return `From ${rows.length} recent article(s): ${pos} positive, ${neu} neutral, ${neg} negative. Average tone is ${tone}. Scores come from the same on-the-fly classifier used across StockAI (FinBERT when enabled, otherwise a keyword heuristic).`;
}

export default async function NewsSentimentPage({ searchParams }: NewsSentimentPageProps) {
  const params = (await searchParams) ?? {};
  const symbol = params.symbol?.trim().toUpperCase();
  let hasBackendError = false;
  let news: NewsItem[] = [];
  let timelineScores: number[] = [];
  let rawForBrief: { sentiment_label: string | null; sentiment_score: number | null }[] = [];

  try {
    const rows = await backendGet<
      {
        title: string;
        description: string | null;
        source: string | null;
        published_at: string;
        sentiment_label: "positive" | "neutral" | "negative" | null;
        sentiment_score: number | null;
      }[]
    >(symbol ? `/api/news/${symbol}` : "/api/news");

    rawForBrief = rows.map((r) => ({
      sentiment_label: r.sentiment_label,
      sentiment_score: r.sentiment_score,
    }));

    news = rows.map((row, idx) => ({
      id: String(idx + 1),
      headline: row.title,
      summary: row.description || "No summary available.",
      source: row.source || "Unknown",
      timestamp: formatNewsTime(row.published_at),
      sentiment: (row.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
      sector: "General",
      highImpact:
        row.sentiment_label != null &&
        row.sentiment_label !== "neutral" &&
        Math.abs(row.sentiment_score ?? 0) >= 0.35,
    }));

    if (symbol) {
      try {
        const tl = await backendGet<{ score: number }[]>(`/api/sentiment/${symbol}/timeline`);
        timelineScores = tl.map((t) => t.score);
      } catch {
        timelineScores = [];
      }
    }
  } catch {
    hasBackendError = true;
  }

  const topics = trendingFromHeadlines(news.map((n) => n.headline));
  const insight = buildAiBrief(rawForBrief);

  return (
    <div className="space-y-8 pb-8">
      {hasBackendError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          Backend unavailable. News feed could not be loaded.
        </div>
      )}
      <NewsPageHeader />
      <SentimentOverviewStrip />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">AI Curated News Stream</h2>
            <p className="text-sm text-muted-foreground">
              Stories ranked by relevance and impact
            </p>
          </div>
          <AICuratedNewsStream items={news} />
        </div>

        <div className="space-y-6">
          <SentimentTrendCard scores={timelineScores} />
          <TrendingTopicsCard topics={topics} />
          <AIInsightBox insight={insight} />
        </div>
      </div>
    </div>
  );
}
