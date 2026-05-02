"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function toHeights(scores: number[]): number[] {
  if (!scores.length) return [];
  const scaled = scores.map((s) => (s <= 1 && s >= -1 ? (s + 1) / 2 : s / 100));
  const min = Math.min(...scaled);
  const max = Math.max(...scaled);
  if (max === min) return scaled.map(() => 50);
  return scaled.map((v) => 15 + ((v - min) / (max - min)) * 70);
}

export interface StockSentimentTimelineCardProps {
  scores: number[];
}

export function SentimentTimelineCard({ scores }: StockSentimentTimelineCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const heights = useMemo(() => toHeights(scores), [scores]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Sentiment Timeline
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sentiment trend from news over the last 14 data points
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative h-44 rounded-xl bg-white/5 p-4">
            <div className="absolute inset-4 flex items-end gap-0.5">
              {!heights.length ? (
                <p className="w-full text-center text-xs text-muted-foreground">
                  No sentiment series yet.
                </p>
              ) : (
                heights.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-amber-500/40 via-primary/50 to-emerald-500/40"
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${h}%` } : {}}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.04 }}
                  />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
