import { NewsPageHeader } from "@/components/news/NewsPageHeader";
import { SentimentOverviewStrip } from "@/components/news/SentimentOverviewStrip";
import { AICuratedNewsStream } from "@/components/news/AICuratedNewsStream";
import { SentimentTrendCard } from "@/components/news/SentimentTrendCard";
import { TrendingTopicsCard } from "@/components/news/TrendingTopicsCard";
import { AIInsightBox } from "@/components/news/AIInsightBox";
import {
  mockNews,
  mockTrendingTopics,
  mockAIInsight,
} from "@/lib/news-data";

export default function NewsSentimentPage() {
  return (
    <div className="space-y-8 pb-8">
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
          <AICuratedNewsStream items={mockNews} />
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
