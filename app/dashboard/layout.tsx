import type { Metadata } from "next";
import { DashboardLayout as DashboardLayoutClient } from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard — StockAI",
  description: "AI-powered stock insights, predictions, and market sentiment.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
