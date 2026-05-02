"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, BarChart3, Target } from "lucide-react";

export interface TechnicalIndicatorsCardProps {
  rsi: number;
  macd: number;
  ma10: number;
  ma50: number;
  lastClose: number;
  bbUpper: number;
  bbLower: number;
}

export function TechnicalIndicatorsCard({
  rsi,
  macd,
  ma10,
  ma50,
  lastClose,
  bbUpper,
  bbLower,
}: TechnicalIndicatorsCardProps) {
  const macdLabel = macd >= 0 ? "Bullish bias" : "Bearish bias";
  const items = [
    { label: "RSI (14)", value: rsi.toFixed(2), icon: Activity },
    { label: "MACD", value: macdLabel, icon: BarChart3 },
    { label: "MA (50)", value: `$${ma50.toFixed(2)}`, icon: TrendingUp },
    { label: "MA (10)", value: `$${ma10.toFixed(2)}`, icon: TrendingUp },
    { label: "Bollinger lower", value: `$${bbLower.toFixed(2)}`, icon: Target },
    { label: "Bollinger upper", value: `$${bbUpper.toFixed(2)}`, icon: Target },
    { label: "Last close", value: `$${lastClose.toFixed(2)}`, icon: Target },
  ];

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
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:border-primary/20 hover:shadow-[0_0_16px_-4px] hover:shadow-primary/10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <item.icon className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
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
