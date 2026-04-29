"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Wallet, TrendingUp, Award, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/lib/portfolio-data";

function AnimatedValue({
  value,
  prefix,
  suffix,
  inView,
  isPercent,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
  isPercent?: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = isPercent ? 800 : 1200;
    const steps = isPercent ? 30 : 40;
    const step = value / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current * 100) / 100);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, value, isPercent]);

  return (
    <span>
      {prefix}
      {inView
        ? isPercent
          ? display.toFixed(2)
          : display.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : value}
      {suffix}
    </span>
  );
}

export interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary;
}

const cards = [
  {
    key: "totalValue" as const,
    label: "Total Portfolio Value",
    icon: Wallet,
  },
  {
    key: "todayGainLoss" as const,
    label: "Today's Gain/Loss",
    icon: TrendingUp,
  },
  {
    key: "bestPerformer" as const,
    label: "Best Performing Stock",
    icon: Award,
  },
  {
    key: "worstPerformer" as const,
    label: "Worst Performing Stock",
    icon: AlertCircle,
  },
];

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const getValue = (key: (typeof cards)[number]["key"]) => {
    switch (key) {
      case "totalValue":
        return { value: summary.totalValue, prefix: "$", isPercent: false };
      case "todayGainLoss":
        return {
          value: summary.todayGainLoss,
          suffix: "%",
          prefix: summary.todayGainLoss >= 0 ? "+" : "",
          isPercent: true,
        };
      case "bestPerformer":
        return {
          value: `${summary.bestPerformer.symbol} (+${summary.bestPerformer.change}%)`,
          isPercent: false,
        };
      case "worstPerformer":
        return {
          value: `${summary.worstPerformer.symbol} (${summary.worstPerformer.change}%)`,
          isPercent: false,
        };
    }
  };

  return (
    <motion.section
      ref={ref}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Portfolio summary"
    >
      {cards.map((card, i) => {
        const val = getValue(card.key);
        const isGain = card.key === "todayGainLoss" && summary.todayGainLoss >= 0;
        const isLoss = card.key === "todayGainLoss" && summary.todayGainLoss < 0;
        return (
          <motion.article
            key={card.key}
            className={cn(
              "flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm",
              "transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]"
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <card.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p
                className={cn(
                  "mt-0.5 text-lg font-semibold",
                  isGain && "text-emerald-400",
                  isLoss && "text-red-400",
                  !isGain && !isLoss && "text-white"
                )}
              >
                {card.key === "totalValue" ? (
                  <>
                    $
                    <AnimatedValue
                      value={parseFloat(summary.totalValue.replace(/[$,]/g, ""))}
                      inView={inView}
                    />
                  </>
                ) : card.key === "todayGainLoss" ? (
                  <AnimatedValue
                    value={summary.todayGainLoss}
                    prefix={summary.todayGainLoss >= 0 ? "+" : ""}
                    suffix="%"
                    inView={inView}
                    isPercent
                  />
                ) : card.key === "bestPerformer" ? (
                  `${summary.bestPerformer.symbol} (+${summary.bestPerformer.change}%)`
                ) : (
                  `${summary.worstPerformer.symbol} (${summary.worstPerformer.change}%)`
                )}
              </p>
            </div>
          </motion.article>
        );
      })}
    </motion.section>
  );
}
