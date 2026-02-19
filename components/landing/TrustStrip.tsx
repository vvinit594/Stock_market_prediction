"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 87, suffix: "%", label: "Prediction accuracy" },
  { value: 5000, suffix: "+", label: "Companies tracked" },
  { value: 12, suffix: "", label: "Data sources" },
  { value: 24, suffix: "/7", label: "Real-time updates" },
];

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function TrustStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative border-y border-white/10 bg-white/[0.02] py-12 backdrop-blur-sm"
      aria-label="Trust metrics"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                inView={inView}
              />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
