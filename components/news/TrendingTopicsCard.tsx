"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendingTopic } from "@/lib/news-data";

export interface TrendingTopicsCardProps {
  topics: TrendingTopic[];
}

export function TrendingTopicsCard({ topics }: TrendingTopicsCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.15 }}
      aria-labelledby="trending-heading"
    >
      <h2 id="trending-heading" className="text-lg font-semibold text-white">
        Trending Topics
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Most mentioned companies and sectors
      </p>
      <ul className="mt-4 space-y-2" role="list">
        {topics.map((topic, i) => (
          <motion.li
            key={topic.id}
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
          >
            <a
              href="#"
              className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-white/5 hover:shadow-[0_0_16px_-4px] hover:shadow-primary/10"
            >
              <span className="font-medium text-white">{topic.name}</span>
              <div className="flex items-center gap-2">
                {topic.sentiment === "up" && (
                  <TrendingUp className="size-4 text-emerald-400" />
                )}
                {topic.sentiment === "down" && (
                  <TrendingDown className="size-4 text-red-400" />
                )}
                {topic.sentiment === "neutral" && (
                  <Minus className="size-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    topic.sentiment === "up" && "bg-emerald-500/20 text-emerald-400",
                    topic.sentiment === "down" && "bg-red-500/20 text-red-400",
                    topic.sentiment === "neutral" && "bg-white/10 text-muted-foreground"
                  )}
                >
                  {topic.mentionCount}
                </span>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
