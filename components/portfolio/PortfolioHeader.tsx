"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PortfolioHeaderProps {
  onAddStock?: () => void;
}

export function PortfolioHeader({ onAddStock }: PortfolioHeaderProps) {
  return (
    <motion.header
      className="flex flex-wrap items-center justify-between gap-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          My Portfolio & Watchlist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your saved stocks and monitor AI predictions in one place.
        </p>
      </div>
      <Button
        onClick={onAddStock}
        className="gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
      >
        <Plus className="size-4" />
        Add Stock
      </Button>
    </motion.header>
  );
}
