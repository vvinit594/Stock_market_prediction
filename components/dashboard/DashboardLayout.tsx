"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const updateMobile = useCallback(() => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, [updateMobile]);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseSidebar();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleCloseSidebar]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        isMobile={isMobile}
      />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <DashboardNavbar onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
