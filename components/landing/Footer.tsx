"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Live demo", href: "#live-preview" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer
      className="relative border-t border-white/10 bg-white/[0.02] backdrop-blur-md"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              StockAI
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              AI-powered stock market prediction and sentiment analysis.
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Footer navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
                aria-label={label}
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StockAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
