"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, User, Menu } from "lucide-react";
export interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

type SearchHit = { symbol: string; company_name: string };

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/search?q=${encodeURIComponent(q)}&limit=8`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as SearchHit[];
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 280);
    return () => clearTimeout(handle);
  }, [query, apiBase]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goSymbol = (sym: string) => {
    const t = sym.trim().toUpperCase();
    if (!t) return;
    router.push(`/dashboard/stock/${t}`);
    setQuery("");
    setOpen(false);
    setResults([]);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const direct = query.trim().toUpperCase();
    if (direct.length >= 1 && /^[A-Z0-9.-]+$/.test(direct)) {
      goSymbol(direct);
      return;
    }
    if (results[0]) goSymbol(results[0].symbol);
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
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            StockAI
          </Link>
        </div>

        <div ref={wrapRef} className="relative mx-auto w-full max-w-md flex-1 px-2 sm:px-4">
          <form
            onSubmit={onSearchSubmit}
            className="flex h-10 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-xs backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 focus-within:ring-offset-background"
          >
            <span className="flex shrink-0 items-center pl-3 text-muted-foreground" aria-hidden>
              <Search className="size-4" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Search company or ticker"
              className="h-full min-w-0 flex-1 border-0 bg-transparent py-2 pr-4 pl-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              aria-label="Search stocks"
              autoComplete="off"
            />
          </form>
          {open && results.length > 0 && (
            <ul
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-lg border border-white/10 bg-background/95 py-1 shadow-lg backdrop-blur-md"
              role="listbox"
            >
              {results.map((r) => (
                <li key={r.symbol} role="option">
                  <button
                    type="button"
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-white/10"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goSymbol(r.symbol)}
                  >
                    <span className="font-semibold text-white">{r.symbol}</span>
                    <span className="text-xs text-muted-foreground">{r.company_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
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
