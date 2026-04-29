"use client";

import { useState } from "react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioSummaryCards } from "@/components/portfolio/PortfolioSummaryCards";
import { WatchlistTable } from "@/components/portfolio/WatchlistTable";
import { QuickInsightsPanel } from "@/components/portfolio/QuickInsightsPanel";
import { PortfolioEmptyState } from "@/components/portfolio/PortfolioEmptyState";
import {
  mockWatchlist,
  mockPortfolioSummary,
  mockQuickInsight,
} from "@/lib/portfolio-data";

export default function PortfolioWatchlistPage() {
  const [watchlist, setWatchlist] = useState(mockWatchlist);

  const handleAddStock = () => {
    // Placeholder - would open add-stock modal/drawer
  };

  const handleRemove = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isEmpty = watchlist.length === 0;

  return (
    <div className="space-y-8 pb-8">
      <PortfolioHeader onAddStock={handleAddStock} />

      {isEmpty ? (
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
