"use client";

import { motion } from "framer-motion";

export function NewsPageHeader() {
  return (
    <motion.header
      className="pb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Market News & Sentiment Intelligence
        </h1>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          AI-powered insights
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        AI analyzes global news and social signals to surface market narratives,
        sentiment trends, and high-impact stories in real time.
      </p>
      <div
        className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
    </motion.header>
  );
}
