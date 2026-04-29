"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Signal = "BUY" | "SELL" | "HOLD";

export interface AIPredictionInsightCardProps {
  signal: Signal;
  confidence: number;
  explanation: string;
}

const signalStyles: Record<Signal, string> = {
  BUY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SELL: "bg-red-500/20 text-red-400 border-red-500/30",
  HOLD: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function AIPredictionInsightCard({
  signal,
  confidence,
  explanation,
}: AIPredictionInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            AI Prediction Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              className={cn(
                "relative rounded-xl border px-8 py-4 text-2xl font-bold tracking-wide md:text-3xl",
                signalStyles[signal]
              )}
              animate={{
                boxShadow: [
                  "0 0 20px -5px oklch(0.5 0.2 250 / 0.2)",
                  "0 0 30px -5px oklch(0.5 0.2 250 / 0.35)",
                  "0 0 20px -5px oklch(0.5 0.2 250 / 0.2)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {signal}
            </motion.div>
            <p className="text-lg font-semibold text-white">
              {confidence}% confidence
            </p>
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              {explanation}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
