"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface LatestNewsPanelProps {
  items: NewsItem[];
}

const sentimentStyles = {
  positive: "bg-emerald-500/20 text-emerald-400",
  neutral: "bg-white/10 text-muted-foreground",
  negative: "bg-red-500/20 text-red-400",
};

export function LatestNewsPanel({ items }: LatestNewsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3" role="list">
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              >
                <a
                  href="#"
                  className="block rounded-lg border border-transparent p-3 transition-all hover:border-white/10 hover:bg-white/5 hover:shadow-md"
                >
                  <p className="text-sm font-medium leading-snug text-white">
                    {item.headline}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.source}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-medium capitalize",
                        sentimentStyles[item.sentiment]
                      )}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
