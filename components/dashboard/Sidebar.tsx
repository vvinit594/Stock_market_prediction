"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Newspaper,
  Bookmark,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: SidebarNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/stock", label: "Stock Detail Page", icon: LineChart },
  { href: "/dashboard/news", label: "News & Sentiment Page", icon: Newspaper },
  { href: "/dashboard/portfolio", label: "Portfolio / Watchlist Page", icon: Bookmark },
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isOpen, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-white/10 bg-white/5 shadow-[2px_0_24px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white"
          onClick={isMobile ? onClose : undefined}
        >
          StockAI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
        {navItems.map((item, i) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={isOpen ? { opacity: 0, x: -8 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: isMobile ? i * 0.04 : 0 }}
            >
              <Link
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/10 hover:text-white hover:shadow-[0_0_16px_-4px] hover:shadow-primary/10",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_-5px] shadow-primary/20"
                    : "text-muted-foreground border border-transparent"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              aria-hidden
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-[240px] rounded-r-2xl border-r border-white/10 bg-background/95 shadow-xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              style={{ boxShadow: "4px 0 24px -4px rgba(0,0,0,0.3)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Sidebar menu"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside
      className="hidden w-[240px] shrink-0 rounded-r-2xl border-r border-white/10 bg-background/95 shadow-[0_0_40px_-12px] shadow-primary/5 lg:block"
      role="navigation"
      aria-label="Sidebar navigation"
    >
      {sidebarContent}
    </aside>
  );
}
