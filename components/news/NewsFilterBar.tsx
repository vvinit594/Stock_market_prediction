"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SentimentFilter = "all" | "positive" | "neutral" | "negative";
export type SectorFilter = "all" | string;

export interface NewsFilterBarProps {
  sentiment: SentimentFilter;
  sector: SectorFilter;
  highImpactOnly: boolean;
  searchQuery: string;
  onSentimentChange: (v: SentimentFilter) => void;
  onSectorChange: (v: SectorFilter) => void;
  onHighImpactChange: (v: boolean) => void;
  onSearchChange: (v: string) => void;
}

const sentimentOptions: { value: SentimentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

const sectorOptions = [
  { value: "all", label: "All sectors" },
  { value: "General", label: "General" },
];

export function NewsFilterBar({
  sentiment,
  sector,
  highImpactOnly,
  searchQuery,
  onSentimentChange,
  onSectorChange,
  onHighImpactChange,
  onSearchChange,
}: NewsFilterBarProps) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Sentiment:
        </span>
        {sentimentOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSentimentChange(opt.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
              "hover:bg-white/10 hover:text-white",
              sentiment === opt.value
                ? "bg-primary/30 text-primary"
                : "text-muted-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <select
        value={sector}
        onChange={(e) => onSectorChange(e.target.value as SectorFilter)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none transition-all focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
      >
        {sectorOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground outline-none transition-all focus:border-primary/30"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={highImpactOnly}
          onChange={(e) => onHighImpactChange(e.target.checked)}
          className="accent-primary rounded border-white/20 bg-white/5 focus:ring-primary/30"
        />
        <span className="text-sm text-muted-foreground">
          Only high-impact news
        </span>
      </label>
    </motion.div>
  );
}
