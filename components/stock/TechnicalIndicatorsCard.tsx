"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, BarChart3, Target } from "lucide-react";

const indicators = [
  { label: "RSI (14)", value: "58.2", icon: Activity },
  { label: "MACD", value: "Bullish", icon: BarChart3 },
  { label: "MA (50)", value: "$172.40", icon: TrendingUp },
  { label: "Support", value: "$168.00", icon: Target },
  { label: "Resistance", value: "$185.00", icon: Target },
];

export function TechnicalIndicatorsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {indicators.map((item, i) => (
              <motion.div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:border-primary/20 hover:shadow-[0_0_16px_-4px] hover:shadow-primary/10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <item.icon className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
