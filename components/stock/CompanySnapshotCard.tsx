"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Briefcase,
  User,
  Calendar,
  BarChart2,
} from "lucide-react";

export interface CompanySnapshotData {
  marketCap: string;
  sector: string;
  ceo: string;
  earningsDate: string;
  volume: string;
}

export interface CompanySnapshotCardProps {
  data: CompanySnapshotData;
}

const rows: {
  key: keyof CompanySnapshotData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "marketCap", label: "Market cap", icon: Building2 },
  { key: "sector", label: "Sector", icon: Briefcase },
  { key: "ceo", label: "CEO", icon: User },
  { key: "earningsDate", label: "Earnings date", icon: Calendar },
  { key: "volume", label: "Volume", icon: BarChart2 },
];

export function CompanySnapshotCard({ data }: CompanySnapshotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Company Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {rows.map(({ key, label, icon: Icon }, i) => (
              <motion.div
                key={key}
                className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.25 + i * 0.04 }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4 shrink-0 text-primary" />
                  <span className="text-sm">{label}</span>
                </div>
                <span className="text-right text-sm font-medium text-white">
                  {data[key]}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
