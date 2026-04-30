"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Search, User, Menu } from "lucide-react";

export interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    []
  );

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${apiBase}/health`, { cache: "no-store" });
        if (mounted) setBackendOnline(res.ok);
      } catch {
        if (mounted) setBackendOnline(false);
      }
    };
    void checkHealth();
    const id = setInterval(() => void checkHealth(), 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [apiBase]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = symbol.trim().toUpperCase();
    if (!ticker) return;
    router.push(`/dashboard/stock/${ticker}`);
    setSymbol("");
  };

  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="banner"
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            StockAI
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md flex-1 px-2 sm:px-4">
          <form
            onSubmit={onSearchSubmit}
            className="flex h-10 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-xs backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 focus-within:ring-offset-background"
          >
            <span className="flex shrink-0 items-center pl-3 text-muted-foreground" aria-hidden>
              <Search className="size-4" />
            </span>
            <input
              type="search"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Search stocks (e.g. AAPL, TSLA)"
              className="h-full min-w-0 flex-1 border-0 bg-transparent py-2 pr-4 pl-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              aria-label="Search stocks"
            />
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`hidden rounded-full border px-2 py-1 text-xs md:inline-flex ${
              backendOnline === null
                ? "border-white/20 text-muted-foreground"
                : backendOnline
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-red-500/30 text-red-400"
            }`}
          >
            {backendOnline === null ? "Checking API" : backendOnline ? "API Online" : "API Offline"}
          </span>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Profile"
          >
            <User className="size-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
