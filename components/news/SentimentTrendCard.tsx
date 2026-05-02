"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

function toHeights(scores: number[]): number[] {
  if (!scores.length) return [];
  const scaled = scores.map((s) => (s <= 1 && s >= -1 ? (s + 1) / 2 : s / 100));
  const min = Math.min(...scaled);
  const max = Math.max(...scaled);
  if (max === min) return scaled.map(() => 50);
  return scaled.map((v) => 15 + ((v - min) / (max - min)) * 70);
}

export interface SentimentTrendCardProps {
  scores: number[];
}

export function SentimentTrendCard({ scores }: SentimentTrendCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const heights = useMemo(() => toHeights(scores), [scores]);

  return (
    <motion.section
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_24px_-8px] hover:shadow-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.1 }}
      aria-labelledby="sentiment-trend-heading"
    >
      <h2 id="sentiment-trend-heading" className="text-lg font-semibold text-white">
        Sentiment Trend
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Aggregated tone from recent headlines
      </p>
      <div className="relative mt-4 h-48 rounded-xl bg-white/5 p-4">
        <div className="absolute inset-4 flex items-end gap-0.5">
            {!heights.length ? (
            <p className="w-full text-center text-xs text-muted-foreground">
              No timeline data. Use a <code className="rounded bg-white/10 px-1">?symbol=</code> query with a
              ticker on this page to load a daily series.
            </p>
          ) : (
            heights.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-amber-500/30 via-primary/40 to-emerald-500/40"
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.03 }}
              />
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
