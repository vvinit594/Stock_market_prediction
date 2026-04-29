"use client";

import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PortfolioEmptyStateProps {
  onAddStock?: () => void;
}

export function PortfolioEmptyState({ onAddStock }: PortfolioEmptyStateProps) {
  return (
    <motion.div
      className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-8 py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-white/5">
        <Bookmark className="size-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-white">
        Your watchlist is empty
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Add stocks to track AI predictions, sentiment, and price performance in
        one place.
      </p>
      <Button
        onClick={onAddStock}
        className="mt-6 gap-2 rounded-xl bg-primary px-6 py-3 font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
      >
        Add your first stock
      </Button>
    </motion.div>
  );
}
