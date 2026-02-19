import { MarketSummaryCard } from "@/components/dashboard/MarketSummaryCard";
import { PriceTrendCard } from "@/components/dashboard/PriceTrendCard";
import { SentimentTimelineCard } from "@/components/dashboard/SentimentTimelineCard";
import { AIPredictionPanel } from "@/components/dashboard/AIPredictionPanel";
import { LatestNewsPanel } from "@/components/dashboard/LatestNewsPanel";
import { WatchlistSection } from "@/components/dashboard/WatchlistSection";

const mockNews = [
  {
    id: "1",
    headline: "Apple announces new AI features for next iPhone release",
    source: "Reuters",
    sentiment: "positive" as const,
  },
  {
    id: "2",
    headline: "Tech sector faces regulatory scrutiny in Q2",
    source: "Bloomberg",
    sentiment: "neutral" as const,
  },
  {
    id: "3",
    headline: "Analysts raise price targets amid strong earnings",
    source: "CNBC",
    sentiment: "positive" as const,
  },
  {
    id: "4",
    headline: "Supply chain concerns weigh on semiconductor stocks",
    source: "Financial Times",
    sentiment: "negative" as const,
  },
  {
    id: "5",
    headline: "Fed signals steady rates; markets react positively",
    source: "WSJ",
    sentiment: "positive" as const,
  },
];

const mockWatchlist = [
  { symbol: "AAPL", trend: "up" as const, signal: "BUY" as const, change: "+2.4%" },
  { symbol: "TSLA", trend: "down" as const, signal: "HOLD" as const, change: "-1.2%" },
  { symbol: "GOOGL", trend: "up" as const, signal: "BUY" as const, change: "+0.8%" },
  { symbol: "MSFT", trend: "up" as const, signal: "BUY" as const, change: "+1.5%" },
  { symbol: "AMZN", trend: "down" as const, signal: "SELL" as const, change: "-0.9%" },
  { symbol: "NVDA", trend: "up" as const, signal: "BUY" as const, change: "+3.1%" },
  { symbol: "META", trend: "up" as const, signal: "HOLD" as const, change: "+0.4%" },
];

export default function DashboardPage() {
  return (
    <>
      {/* Market Summary - 4 cards */}
        <section
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Market summary"
        >
          <MarketSummaryCard
            icon="dollar"
            value="$178.24"
            label="Current Stock Price"
            delay={0}
          />
          <MarketSummaryCard
            icon="trend"
            value="+2.44%"
            label="Daily Change"
            variant="positive"
            delay={0.05}
          />
          <MarketSummaryCard
            icon="sentiment"
            value="72%"
            label="Sentiment Score"
            variant="positive"
            delay={0.1}
          />
          <MarketSummaryCard
            icon="signal"
            value="BUY"
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
              signal="BUY"
              confidence={84}
              explanation="Our model indicates strong momentum and positive sentiment from recent news. Technical levels suggest support at $172. Risk-adjusted outlook favors a long position with a suggested horizon of 2–4 weeks."
            />
            <LatestNewsPanel items={mockNews} />
          </div>
        </div>

      {/* Watchlist strip */}
      <WatchlistSection items={mockWatchlist} />
    </>
  );
}
