import { NewsPageHeader } from "@/components/news/NewsPageHeader";
import { SentimentOverviewStrip } from "@/components/news/SentimentOverviewStrip";
import { AICuratedNewsStream } from "@/components/news/AICuratedNewsStream";
import { SentimentTrendCard } from "@/components/news/SentimentTrendCard";
import { TrendingTopicsCard } from "@/components/news/TrendingTopicsCard";
import { AIInsightBox } from "@/components/news/AIInsightBox";
import { backendGet } from "@/lib/backend-api";
import { mockAIInsight, mockTrendingTopics } from "@/lib/news-data";

interface NewsSentimentPageProps {
  searchParams?: Promise<{ symbol?: string }>;
}

export default async function NewsSentimentPage({ searchParams }: NewsSentimentPageProps) {
  const params = (await searchParams) ?? {};
  const symbol = params.symbol?.toUpperCase();
  let hasBackendError = false;
  let news = [] as {
    id: string;
    headline: string;
    summary: string;
    source: string;
    timestamp: string;
    sentiment: "positive" | "neutral" | "negative";
    sector?: string;
    highImpact?: boolean;
  }[];

  try {
    const rows = await backendGet<
      {
        title: string;
        description: string | null;
        source: string | null;
        published_at: string;
        sentiment_label: "positive" | "neutral" | "negative" | null;
      }[]
    >(symbol ? `/api/news/${symbol}` : "/api/news");
    news = rows.map((row, idx) => ({
      id: String(idx + 1),
      headline: row.title,
      summary: row.description || "No summary available.",
      source: row.source || "Unknown",
      timestamp: "recent",
      sentiment: (row.sentiment_label || "neutral") as "positive" | "neutral" | "negative",
      sector: "Technology",
      highImpact: idx % 2 === 0,
    }));
  } catch {
    hasBackendError = true;
  }

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
            <h2 className="text-lg font-semibold text-white">
              AI Curated News Stream
            </h2>
            <p className="text-sm text-muted-foreground">
              Stories ranked by relevance and impact
            </p>
          </div>
          <AICuratedNewsStream items={news} />
        </div>

        <div className="space-y-6">
          <SentimentTrendCard />
          <TrendingTopicsCard topics={mockTrendingTopics} />
          <AIInsightBox insight={mockAIInsight} />
        </div>
      </div>
    </div>
  );
}
