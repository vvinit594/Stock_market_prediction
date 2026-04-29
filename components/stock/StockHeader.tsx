"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StockSignal = "BUY" | "SELL" | "HOLD";

export interface StockHeaderProps {
  companyName: string;
  ticker: string;
  price: string;
  changePercent: number;
  signal: StockSignal;
}

const signalStyles: Record<StockSignal, string> = {
  BUY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SELL: "bg-red-500/20 text-red-400 border-red-500/30",
  HOLD: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function StockHeader({
  companyName,
  ticker,
  price,
  changePercent,
  signal,
}: StockHeaderProps) {
  const isPositive = changePercent >= 0;

  return (
    <motion.header
      className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl font-bold text-primary">
          {ticker.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white md:text-2xl">
            {companyName}
          </h1>
          <p className="text-sm text-muted-foreground">{ticker}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-white md:text-3xl">{price}</p>
            <p
              className={cn(
                "text-sm font-medium",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </p>
          </div>
          <span
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-semibold",
              signalStyles[signal]
            )}
          >
            {signal}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
