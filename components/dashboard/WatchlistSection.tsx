"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WatchlistItem {
  symbol: string;
  trend: "up" | "down";
  signal: "BUY" | "SELL" | "HOLD";
  change?: string;
}

export interface WatchlistSectionProps {
  items: WatchlistItem[];
}

const signalColors = {
  BUY: "text-emerald-400 border-emerald-500/30",
  SELL: "text-red-400 border-red-500/30",
  HOLD: "text-amber-400 border-amber-500/30",
};

export function WatchlistSection({ items }: WatchlistSectionProps) {
  return (
    <motion.section
      className="border-t border-white/10 py-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      aria-labelledby="watchlist-heading"
    >
      <h2 id="watchlist-heading" className="sr-only">
        Watchlist
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {items.map((item, i) => (
          <motion.button
            key={item.symbol}
            type="button"
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border bg-white/5 px-4 py-3 backdrop-blur-sm transition-all",
              "hover:scale-105 hover:border-primary/30 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5"
            )}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
          >
            <span className="font-semibold text-white">{item.symbol}</span>
            {item.trend === "up" ? (
              <TrendingUp className="size-4 text-emerald-400" />
            ) : (
              <TrendingDown className="size-4 text-red-400" />
            )}
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-medium",
                signalColors[item.signal]
              )}
            >
              {item.signal}
            </span>
            {item.change && (
              <span
                className={cn(
                  "text-xs font-medium",
                  item.trend === "up" ? "text-emerald-400" : "text-red-400"
                )}
              >
                {item.change}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
