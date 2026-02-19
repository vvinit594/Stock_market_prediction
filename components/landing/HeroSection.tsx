"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-20"
      aria-label="Hero"
    >
      {/* Background gradient and blobs */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.35_0.15_260_/_0.25),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,oklch(0.4_0.12_280_/_0.2),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,oklch(0.3_0.1_240_/_0.15),transparent_50%)]" />
      <motion.div
        className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-[100px]"
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 1.05, 1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Predict the Market{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Before It Moves
          </span>
        </motion.h1>
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          AI-powered predictions combined with news sentiment and real-time
          data. Make smarter, data-driven trading decisions.
        </motion.p>

        <motion.div
          className="mx-auto mb-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative flex flex-1 items-center">
            <Search className="absolute left-4 size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g. AAPL, TSLA)"
              className="h-12 rounded-xl border-white/10 bg-white/5 pl-12 text-base backdrop-blur-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Stock symbol search"
            />
          </div>
          <Button
            size="lg"
            className="h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-[0.98]"
            asChild
          >
            <Link href="/dashboard">Start Exploring</Link>
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
            asChild
          >
            <Link href="/dashboard">See Live Demo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
