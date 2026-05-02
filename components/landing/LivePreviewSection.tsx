"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp } from "lucide-react";

export function LivePreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="live-preview"
      className="relative px-4 py-24 md:py-32"
      aria-labelledby="preview-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h2
          id="preview-heading"
          className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Live preview
        </motion.h2>
        <motion.p
          className="mx-auto mb-16 max-w-xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          See what you get: real-time signals and sentiment at a glance.
        </motion.p>

        <motion.div
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-primary/10 backdrop-blur-xl"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-60 blur-sm" />

          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 md:p-8">
            {/* Header row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-white">Watchlist</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="size-4" />
                <span className="text-sm font-medium">From your symbols</span>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="mb-6 flex h-48 items-end justify-between gap-1 rounded-xl bg-white/5 p-4">
              {[40, 45, 42, 55, 52, 58, 62, 58, 65, 70, 68, 72].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-primary/30"
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${h}%` } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.03 }}
                />
              ))}
            </div>

            {/* Sentiment gauge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sentiment
                </p>
                <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-500/80 via-amber-500/80 to-emerald-500/80"
                    initial={{ width: "0%" }}
                    animate={inView ? { width: "72%" } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Blends headline tone with price action
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <p className="text-xs text-muted-foreground">Signal strength</p>
                <p className="text-lg font-semibold text-primary">High</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
