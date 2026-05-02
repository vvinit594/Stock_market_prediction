"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/lib/portfolio-data";

const signalStyles = {
  BUY: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_-2px] shadow-emerald-500/25",
  SELL: "border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_10px_-2px] shadow-red-500/25",
  HOLD: "border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-[0_0_10px_-2px] shadow-amber-500/25",
};

export interface WatchlistTableProps {
  items: WatchlistItem[];
  onRemove?: (id: string) => void;
}

export function WatchlistTable({ items, onRemove }: WatchlistTableProps) {
  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-white/10 bg-white/[0.06] backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Change
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Signal
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sentiment
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trend
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <motion.tr
                key={row.id}
                className="group border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 + i * 0.03 }}
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="font-semibold text-white">{row.symbol}</span>
                    <p className="text-xs text-muted-foreground">{row.companyName}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-white">
                  {row.price}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-medium",
                    row.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {row.changePercent >= 0 ? "+" : ""}
                  {row.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold",
                      signalStyles[row.signal]
                    )}
                  >
                    {row.signal}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-medium text-white">
                    {row.sentiment}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex h-10 w-20 items-end gap-0.5">
                    {row.sparklineData.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      (() => {
                        const max = Math.max(...row.sparklineData);
                        const min = Math.min(...row.sparklineData);
                        const range = max - min || 1;
                        return row.sparklineData.map((v, j) => (
                          <div
                            key={j}
                            className="flex-1 min-w-0 rounded-t bg-primary/40"
                            style={{
                              height: `${30 + ((v - min) / range) * 70}%`,
                            }}
                          />
                        ));
                      })()
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <Link href={`/dashboard/stock/${row.symbol}`}>
                        <Eye className="size-4" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => onRemove?.(row.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
