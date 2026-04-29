"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import type { QuickInsight } from "@/lib/portfolio-data";

export interface QuickInsightsPanelProps {
  insight: QuickInsight;
}

export function QuickInsightsPanel({ insight }: QuickInsightsPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref}
      className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 }}
      aria-labelledby="quick-insights-heading"
    >
      <h2
        id="quick-insights-heading"
        className="flex items-center gap-2 text-lg font-semibold text-white"
      >
        <Sparkles className="size-5 text-amber-400" />
        Quick Insights
      </h2>
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3">
          <TrendingUp className="size-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-xs text-muted-foreground">Most Bullish</p>
            <p className="font-semibold text-white">
              {insight.bullishStock.symbol} — {insight.bullishStock.companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-red-500/10 px-4 py-3">
          <TrendingDown className="size-5 shrink-0 text-red-400" />
          <div>
            <p className="text-xs text-muted-foreground">Most Bearish</p>
            <p className="font-semibold text-white">
              {insight.bearishStock.symbol} — {insight.bearishStock.companyName}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs font-medium text-amber-400">AI Portfolio Outlook</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {insight.aiSummary}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
