"use client";

import { useEffect, useState } from "react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioSummaryCards } from "@/components/portfolio/PortfolioSummaryCards";
import { WatchlistTable } from "@/components/portfolio/WatchlistTable";
import { QuickInsightsPanel } from "@/components/portfolio/QuickInsightsPanel";
import { PortfolioEmptyState } from "@/components/portfolio/PortfolioEmptyState";
import {
  mockPortfolioSummary,
  mockQuickInsight,
} from "@/lib/portfolio-data";
import { backendGet, backendSend } from "@/lib/backend-api";

type PortfolioApiItem = { symbol: string; company_name: string | null; added_at: string };

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
            const [dashboard, predict] = await Promise.all([
              backendGet<{ current_price: number; daily_change: number; sentiment_score: number }>(
                `/api/dashboard/${item.symbol}`
              ),
              backendGet<{ signal: "BUY" | "SELL" | "HOLD" }>(`/api/predict/${item.symbol}`),
            ]);
            return {
              id: item.symbol,
              symbol: item.symbol,
              companyName: item.company_name || `${item.symbol} Inc.`,
              price: `$${dashboard.current_price.toFixed(2)}`,
              changePercent: dashboard.daily_change,
              signal: predict.signal,
              sentiment: Math.round(dashboard.sentiment_score * 100),
              sparklineData: [42, 48, 45, 52, 55, 58, 62, 67],
            };
          } catch {
            return {
              id: item.symbol,
              symbol: item.symbol,
              companyName: item.company_name || `${item.symbol} Inc.`,
              price: "$0.00",
              changePercent: 0,
              signal: "HOLD" as const,
              sentiment: 50,
              sparklineData: [40, 40, 40, 40, 40, 40, 40, 40],
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

  const handleAddStock = async () => {
    const symbol = window.prompt("Enter stock symbol (e.g. AAPL):");
    if (!symbol) return;
    try {
      await backendSend("/api/portfolio/add", "POST", {
        symbol: symbol.toUpperCase(),
        company_name: `${symbol.toUpperCase()} Inc.`,
      });
      await loadWatchlist();
    } catch {
      setError("Could not add stock. Please try again.");
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
          Loading watchlist...
        </div>
      )}

      {!isLoading && isEmpty ? (
        <PortfolioEmptyState onAddStock={handleAddStock} />
      ) : (
        <>
          <PortfolioSummaryCards summary={mockPortfolioSummary} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Watchlist
              </h2>
              <WatchlistTable items={watchlist} onRemove={handleRemove} />
            </div>
            <div>
              <QuickInsightsPanel insight={mockQuickInsight} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
