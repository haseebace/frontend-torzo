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
    <footer className="flex h-[92px] min-h-[92px] items-center justify-center border-t border-light-200 bg-bg-surface px-4 md:px-[60px]">
      <nav
        {...containerProps}
        className="flex flex-wrap items-center justify-center gap-1 text-center text-xs font-medium leading-6 text-text-muted md:text-sm"
      >
        {footerLinks.map((link, i) => {
          const isActive = hoveredIndex === i;
          const isLast = i === footerLinks.length - 1;

          return (
            <div key={link.href} className="flex items-center gap-1">
              <div
                className="relative"
                onFocus={() => setHoveredIndex(i)}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <AnimatePresence>
                  {isActive && !reduceMotion && (
                    <motion.div
                      layoutId="footer-hover"
                      className="absolute inset-0 rounded-xl border border-light-200 bg-bg-canvas"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.5 } }}
                      transition={magneticSpring}
                    />
                  )}
                </AnimatePresence>
                <Link
                  href={link.href}
                  className="relative z-10 block px-3 py-1"
                >
                  <span className="relative inline-grid">
                    <motion.span
                      className="col-start-1 row-start-1 text-text-muted"
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={reduceMotion ? { duration: 0 } : magneticSpring}
                    >
                      {link.label}
                    </motion.span>
                    <motion.span
                      aria-hidden="true"
                      className="col-start-1 row-start-1 text-text-primary"
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={reduceMotion ? { duration: 0 } : magneticSpring}
                    >
                      {link.label}
                    </motion.span>
                  </span>
                </Link>
              </div>
              {!isLast && (
                <span aria-hidden="true" className="mx-1 select-none text-border-subtle">|</span>
              )}
            </div>
          );
        })}
      </nav>
    </footer>
  );
}
