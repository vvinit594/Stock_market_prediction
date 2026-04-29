"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/news-data";

const sentimentStyles = {
  positive:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_-4px] shadow-emerald-500/30",
  neutral:
    "border-white/20 bg-white/10 text-muted-foreground",
  negative:
    "border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_12px_-4px] shadow-red-500/30",
};

export interface NewsFeedCardProps {
  item: NewsItem;
  index: number;
}

export function NewsFeedCard({ item, index }: NewsFeedCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
    >
      <a
        href="#"
        className="block rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary/10"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="flex-1 text-base font-semibold leading-snug text-white">
            {item.headline}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium capitalize",
              sentimentStyles[item.sentiment]
            )}
          >
            {item.sentiment}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {item.summary}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{item.source}</span>
          <span>·</span>
          <span>{item.timestamp}</span>
          {item.sector && (
            <>
              <span>·</span>
              <span>{item.sector}</span>
            </>
          )}
        </div>
      </a>
    </motion.article>
  );
}
