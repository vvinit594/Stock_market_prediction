"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const timeframes = ["1D", "1W", "1M", "6M", "1Y", "MAX"] as const;

function sliceCloses(closes: number[], tf: (typeof timeframes)[number]): number[] {
  if (!closes.length) return [];
  if (tf === "1D") return closes.slice(-1);
  if (tf === "1W") return closes.slice(-7);
  if (tf === "1M") return closes.slice(-30);
  if (tf === "6M") return closes.slice(-126);
  if (tf === "1Y") return closes.slice(-252);
  return closes;
}

function barPercents(vals: number[]): number[] {
  if (!vals.length) return [];
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (max === min) return vals.map(() => 55);
  return vals.map((v) => 10 + ((v - min) / (max - min)) * 82);
}

export interface PriceChartCardProps {
  closes: number[];
}

export function PriceChartCard({ closes }: PriceChartCardProps) {
  const [active, setActive] = useState<(typeof timeframes)[number]>("1M");

  const heights = useMemo(() => {
    const slice = sliceCloses(closes, active);
    return barPercents(slice);
  }, [closes, active]);

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
            {!heights.length ? (
              <p className="w-full text-center text-sm text-muted-foreground">
                No chart data.
              </p>
            ) : (
              heights.map((h, i) => (
                <motion.div
                  key={`${active}-${i}`}
                  className="flex-1 min-w-0 rounded-t bg-gradient-to-t from-primary/70 to-primary/30"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              ))
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
