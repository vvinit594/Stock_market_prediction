"use client";

import { useEffect, useMemo, useState } from "react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioSummaryCards } from "@/components/portfolio/PortfolioSummaryCards";
import { WatchlistTable } from "@/components/portfolio/WatchlistTable";
import { QuickInsightsPanel } from "@/components/portfolio/QuickInsightsPanel";
import { PortfolioEmptyState } from "@/components/portfolio/PortfolioEmptyState";
import type { PortfolioSummary, QuickInsight } from "@/lib/portfolio-data";
import { backendGet, backendSend } from "@/lib/backend-api";

type PortfolioApiItem = { symbol: string; company_name: string | null; added_at: string };

type StockHistory = { history: { close: number }[] };

function parsePrice(s: string): number {
  const n = parseFloat(s.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function buildSummary(
  items: { symbol: string; price: string; changePercent: number }[]
): PortfolioSummary {
  if (!items.length) {
    return {
      totalValue: "$0.00",
      todayGainLoss: 0,
      bestPerformer: { symbol: "—", change: 0 },
      worstPerformer: { symbol: "—", change: 0 },
    };
  }
  const total = items.reduce((acc, row) => acc + parsePrice(row.price), 0);
  const avgChange =
    items.reduce((acc, row) => acc + row.changePercent, 0) / Math.max(items.length, 1);
  let best = items[0];
  let worst = items[0];
  for (const row of items) {
    if (row.changePercent > best.changePercent) best = row;
    if (row.changePercent < worst.changePercent) worst = row;
  }
  return {
    totalValue: `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    todayGainLoss: Math.round(avgChange * 100) / 100,
    bestPerformer: { symbol: best.symbol, change: Math.round(best.changePercent * 100) / 100 },
    worstPerformer: { symbol: worst.symbol, change: Math.round(worst.changePercent * 100) / 100 },
  };
}

function buildQuickInsight(
  items: { symbol: string; companyName: string; changePercent: number; sentiment: number }[]
): QuickInsight {
  if (!items.length) {
    return {
      bullishStock: { symbol: "—", companyName: "—" },
      bearishStock: { symbol: "—", companyName: "—" },
      aiSummary: "Add positions to your watchlist to see insights.",
    };
  }
  const sorted = [...items].sort((a, b) => b.changePercent - a.changePercent);
  const bullish = sorted[0];
  const bearish = sorted[sorted.length - 1];
  const avgSent =
    items.reduce((a, b) => a + b.sentiment, 0) / Math.max(items.length, 1);
  const tone =
    avgSent >= 58 ? "skewed positive" : avgSent <= 42 ? "tilted negative" : "mixed to neutral";
  return {
    bullishStock: { symbol: bullish.symbol, companyName: bullish.companyName },
    bearishStock: { symbol: bearish.symbol, companyName: bearish.companyName },
    aiSummary: `Across ${items.length} tracked symbol(s), average headline sentiment is about ${Math.round(avgSent)}% (${tone}), based on the same news pipeline as the dashboard. This is informational only, not investment advice.`,
  };
}

export default function PortfolioWatchlistPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<
    {
      id: string;
      symbol: string;
      companyName: string;
      price: string;
      changePercent: number;
      signal: "BUY" | "SELL" | "HOLD";
      sentiment: number;
      sparklineData: number[];
    }[]
  >([]);

  const loadWatchlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await backendGet<PortfolioApiItem[]>("/api/portfolio");
      const enriched = await Promise.all(
        items.map(async (item) => {
          try {
            const [dashboard, predict, hist] = await Promise.all([
              backendGet<{ current_price: number; daily_change: number; sentiment_score: number }>(
                `/api/dashboard/${item.symbol}`
              ),
              backendGet<{ signal: "BUY" | "SELL" | "HOLD" }>(`/api/predict/${item.symbol}`),
              backendGet<StockHistory>(`/api/stock/${item.symbol}`),
            ]);
            const closes = hist.history.map((h) => h.close).slice(-14);
            return {
              id: item.symbol,
              symbol: item.symbol,
              companyName: item.company_name || item.symbol,
              price: `$${dashboard.current_price.toFixed(2)}`,
              changePercent: dashboard.daily_change,
              signal: predict.signal,
              sentiment: Math.round(((dashboard.sentiment_score + 1) / 2) * 100),
              sparklineData: closes.length ? closes : [dashboard.current_price],
            };
          } catch {
            return {
              id: item.symbol,
              symbol: item.symbol,
              companyName: item.company_name || item.symbol,
              price: "—",
              changePercent: 0,
              signal: "HOLD" as const,
              sentiment: 50,
              sparklineData: [] as number[],
            };
          }
        })
      );
      setWatchlist(enriched);
    } catch {
      setWatchlist([]);
      setError("Unable to load watchlist from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWatchlist();
  }, []);

  const summary = useMemo(() => buildSummary(watchlist), [watchlist]);
  const insight = useMemo(() => buildQuickInsight(watchlist), [watchlist]);

  const handleAddStock = async () => {
    const raw = window.prompt("Enter stock symbol:");
    if (!raw) return;
    const symbol = raw.trim().toUpperCase();
    if (!symbol) return;
    try {
      await backendSend("/api/portfolio/add", "POST", { symbol });
      await loadWatchlist();
    } catch {
      setError("Could not add stock. Check the symbol and backend connection.");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await backendSend(`/api/portfolio/${id}`, "DELETE");
      await loadWatchlist();
    } catch {
      setError("Could not remove stock. Please try again.");
    }
  };

  const isEmpty = watchlist.length === 0;

  return (
    <div className="space-y-8 pb-8">
      <PortfolioHeader onAddStock={handleAddStock} />
      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
          Loading watchlist…
        </div>
      )}

      {!isLoading && isEmpty ? (
        <PortfolioEmptyState onAddStock={handleAddStock} />
      ) : (
        <>
          <PortfolioSummaryCards summary={summary} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-white">Watchlist</h2>
              <WatchlistTable items={watchlist} onRemove={handleRemove} />
            </div>
            <div>
              <QuickInsightsPanel insight={insight} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
