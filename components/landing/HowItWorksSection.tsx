"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Select a stock",
    description: "Enter any ticker symbol or browse top movers and watchlists.",
  },
  {
    icon: Brain,
    title: "AI analyzes market + news",
    description:
      "Our models process price history, news sentiment, and real-time data.",
  },
  {
    icon: TrendingUp,
    title: "Get prediction signal",
    description: "Receive BUY/SELL/HOLD with confidence and key insights.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative px-4 py-24 md:py-32"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          id="how-heading"
          className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          How it works
        </motion.h2>
        <motion.p
          className="mx-auto mb-16 max-w-xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Three simple steps to smarter decisions.
        </motion.p>

        <div className="relative flex flex-col items-center gap-12 md:flex-row md:justify-between md:gap-4">
          {/* Connector line - visible on desktop */}
          <div
            className="absolute left-1/2 top-24 hidden h-0.5 w-[calc(100%-8rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block"
            aria-hidden
          />

          {steps.map((step, i) => (
            <motion.article
              key={step.title}
              className="relative z-10 flex flex-1 flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.15 }}
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <step.icon className="size-8 text-primary" />
              </div>
              <span className="mb-2 text-sm font-medium text-primary">
                Step {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
