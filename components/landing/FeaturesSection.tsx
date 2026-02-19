"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  Newspaper,
  Zap,
  PieChart,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: TrendingUp,
    title: "AI Price Forecasting",
    description:
      "Machine learning models analyze historical patterns and market data to generate forward-looking price predictions.",
  },
  {
    icon: Newspaper,
    title: "News Sentiment Analysis",
    description:
      "Real-time sentiment scoring from news and social media to gauge market mood and potential impact on prices.",
  },
  {
    icon: Zap,
    title: "Real-Time Signals",
    description:
      "Instant BUY/SELL/HOLD signals with confidence levels, so you can act on opportunities as they emerge.",
  },
  {
    icon: PieChart,
    title: "Portfolio Insights",
    description:
      "Track your holdings with AI-driven insights, risk metrics, and diversification recommendations.",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="features"
      className="relative px-4 py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          id="features-heading"
          className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Everything you need to trade smarter
        </motion.h2>
        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Powered by AI and multiple data sources for accurate, actionable
          insights.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden border-white/10 bg-white/5 transition-all duration-300",
                  "hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-primary/10"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader>
                  <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <feature.icon className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

