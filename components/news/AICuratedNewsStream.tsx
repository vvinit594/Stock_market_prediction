"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { NewsFilterBar } from "./NewsFilterBar";
import { NewsFeedCard } from "./NewsFeedCard";
import type { NewsItem } from "@/lib/news-data";
import type { SentimentFilter, SectorFilter } from "./NewsFilterBar";

export interface AICuratedNewsStreamProps {
  items: NewsItem[];
}

export function AICuratedNewsStream({ items }: AICuratedNewsStreamProps) {
  const [sentiment, setSentiment] = useState<SentimentFilter>("all");
  const [sector, setSector] = useState<SectorFilter>("all");
  const [highImpactOnly, setHighImpactOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (sentiment !== "all" && item.sentiment !== sentiment) return false;
      if (sector !== "all" && item.sector !== sector) return false;
      if (highImpactOnly && !item.highImpact) return false;
      if (
        searchQuery &&
        !item.headline.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, sentiment, sector, highImpactOnly, searchQuery]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      aria-labelledby="news-stream-heading"
    >
      <h2 id="news-stream-heading" className="sr-only">
        AI Curated News Stream
      </h2>
      <div className="mb-4">
        <NewsFilterBar
          sentiment={sentiment}
          sector={sector}
          highImpactOnly={highImpactOnly}
          searchQuery={searchQuery}
          onSentimentChange={setSentiment}
          onSectorChange={setSector}
          onHighImpactChange={setHighImpactOnly}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex max-h-[640px] flex-col gap-4 overflow-y-auto pr-2">
        {filtered.map((item, i) => (
          <NewsFeedCard key={item.id} item={item} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No news matching your filters.
          </p>
        )}
      </div>
    </motion.section>
  );
}
