"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const timeframes = ["1D", "1W", "1M", "1Y"] as const;

export function PriceTrendCard() {
  const [active, setActive] = useState<(typeof timeframes)[number]>("1W");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-semibold text-white">
            Price Trend
          </CardTitle>
          <div className="flex gap-1 rounded-lg bg-white/5 p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setActive(tf)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex h-64 items-end justify-between gap-1 rounded-xl bg-white/5 p-4">
            {[42, 48, 45, 52, 55, 50, 58, 62, 59, 65, 68, 72, 70, 75, 78].map(
              (h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 min-w-0 rounded-t bg-gradient-to-t from-primary/70 to-primary/30"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.02 }}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
