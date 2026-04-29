"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SentimentTrendCard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

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
        Market sentiment movement over the past 14 days
      </p>
      <div className="relative mt-4 h-48 rounded-xl bg-white/5 p-4">
        <div className="absolute inset-4 flex items-end gap-0.5">
          {[32, 38, 35, 45, 52, 48, 58, 55, 62, 68, 65, 72, 70, 78].map(
            (h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-amber-500/30 via-primary/40 to-emerald-500/40"
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.03 }}
              />
            )
          )}
        </div>
      </div>
    </motion.section>
  );
}
