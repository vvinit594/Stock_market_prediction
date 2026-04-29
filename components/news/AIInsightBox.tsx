"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

export interface AIInsightBoxProps {
  insight: string;
}

export function AIInsightBox({ insight }: AIInsightBoxProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 }}
      aria-labelledby="ai-insight-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.5_0.2_250_/_0.08),transparent)]" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 id="ai-insight-heading" className="text-lg font-semibold text-white">
            AI Market Brief
          </h2>
        </div>
        <blockquote className="mt-4 border-l-2 border-primary/40 pl-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {insight}
          </p>
        </blockquote>
      </div>
    </motion.section>
  );
}
