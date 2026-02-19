"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  dollar: DollarSign,
  trend: TrendingUp,
  sentiment: MessageCircle,
  signal: Sparkles,
} as const;

export type MarketSummaryIcon = keyof typeof iconMap;

export interface MarketSummaryCardProps {
  icon: MarketSummaryIcon;
  value: string | number;
  label: string;
  variant?: "default" | "positive" | "negative" | "neutral";
  delay?: number;
}

const variantStyles = {
  default: "text-white",
  positive: "text-emerald-400",
  negative: "text-red-400",
  neutral: "text-amber-400",
};

export function MarketSummaryCard({
  icon,
  value,
  label,
  variant = "default",
  delay = 0,
}: MarketSummaryCardProps) {
  const IconComponent = iconMap[icon];
  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/20 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-primary/5"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-white/10 text-primary">
          <IconComponent className="size-5" />
        </div>
        <p className={cn("text-2xl font-bold tracking-tight md:text-3xl", variantStyles[variant])}>
          {value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.article>
  );
}
