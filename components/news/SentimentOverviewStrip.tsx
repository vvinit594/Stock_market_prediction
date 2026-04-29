"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedValue({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const steps = 40;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function SentimentOverviewStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const cards = [
    {
      label: "Overall Market Sentiment",
      value: 62,
      suffix: "%",
      variant: "neutral" as const,
      icon: Gauge,
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    {
      label: "Most Positive Sector Today",
      value: "Technology",
      suffix: "",
      variant: "positive" as const,
      icon: TrendingUp,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    },
    {
      label: "Most Negative Sector Today",
      value: "Automotive",
      suffix: "",
      variant: "negative" as const,
      icon: TrendingDown,
      gradient: "from-red-500/20 via-red-500/5 to-transparent",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="grid gap-4 sm:grid-cols-3"
      aria-label="Sentiment overview"
    >
      {cards.map((card, i) => {
        const isNumeric = typeof card.value === "number";
        return (
          <motion.article
            key={card.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-white/10 p-6",
              "bg-gradient-to-br bg-white/[0.04] backdrop-blur-sm",
              "transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_24px_-8px] hover:shadow-primary/15"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                card.gradient
              )}
            />
            <div className="relative flex items-start gap-4">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  card.variant === "positive" && "bg-emerald-500/20 text-emerald-400",
                  card.variant === "negative" && "bg-red-500/20 text-red-400",
                  card.variant === "neutral" && "bg-primary/20 text-primary"
                )}
              >
                <card.icon className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p
                  className={cn(
                    "mt-1 text-xl font-bold md:text-2xl",
                    card.variant === "positive" && "text-emerald-400",
                    card.variant === "negative" && "text-red-400",
                    card.variant === "neutral" && "text-white"
                  )}
                >
                  {isNumeric ? (
                    <AnimatedValue
                      value={card.value as number}
                      suffix={card.suffix}
                      inView={inView}
                    />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.section>
  );
}
