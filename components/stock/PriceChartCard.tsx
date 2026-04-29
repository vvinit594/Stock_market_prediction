"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const timeframes = ["1D", "1W", "1M", "6M", "1Y", "MAX"] as const;

export function PriceChartCard() {
  const [active, setActive] = useState<(typeof timeframes)[number]>("1M");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-semibold text-white">
            Price Performance
          </CardTitle>
          <div className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setActive(tf)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  active === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-white/10 hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            key={active}
            className="flex h-72 items-end justify-between gap-0.5 rounded-xl bg-white/5 p-4"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {[38, 42, 45, 48, 44, 52, 55, 51, 58, 62, 59, 65, 68, 72, 70, 75, 78, 76, 82].map(
              (h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 min-w-0 rounded-t bg-gradient-to-t from-primary/70 to-primary/30"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              )
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
