"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative px-4 py-24 md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          id="cta-heading"
          className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Start Making Smarter Trading Decisions Today
        </motion.h2>
        <motion.p
          className="mb-10 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join thousands of traders using AI to stay ahead of the market.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            size="lg"
            className="h-14 rounded-xl border-2 border-primary/50 bg-gradient-to-r from-primary via-blue-600 to-cyan-600 px-10 text-lg font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-primary/40 active:scale-[0.98]"
            asChild
          >
            <Link href="/dashboard">Get Started — It&apos;s Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
