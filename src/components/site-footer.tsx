"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMagneticHover, magneticSpring } from "@/animations";

const footerLinks = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteFooter() {
  const { containerProps, setHoveredIndex, hoveredIndex } =
    useMagneticHover({
      layoutId: "footer-hover",
    });
  const reduceMotion = useReducedMotion();

  return (
    <footer className="border-t border-border bg-background px-4 py-9 md:px-12">
      <nav
        {...containerProps}
        className="flex flex-wrap items-center justify-center gap-1 text-center text-xs font-medium leading-6 text-muted-foreground md:text-sm"
      >
        {footerLinks.map((link, i) => {
          const isActive = hoveredIndex === i;
          const isLast = i === footerLinks.length - 1;

          return (
            <div key={link.href} className="flex items-center gap-1">
              <div className="relative" onMouseEnter={() => setHoveredIndex(i)}>
                <AnimatePresence>
                  {isActive && !reduceMotion && (
                    <motion.div
                      layoutId="footer-hover"
                      className="absolute inset-0 rounded-xl bg-secondary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.5 } }}
                      transition={magneticSpring}
                    />
                  )}
                </AnimatePresence>
                <Link
                  href={link.href}
                  className="relative z-10 block px-3 py-1 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </div>
              {!isLast && (
                <span aria-hidden="true" className="mx-1 h-3 w-px bg-border select-none" />
              )}
            </div>
          );
        })}
      </nav>
    </footer>
  );
}
