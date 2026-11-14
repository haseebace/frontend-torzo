"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  MagneticHoverItem,
  MagneticHoverList,
  useMagneticHoverListState,
} from "@/animations/magnetic-hover-list";
import { magneticSpring } from "@/animations";

const footerLinks = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

function FooterLink({ href, label, index }: { href: string; label: string; index: number }) {
  const { hoveredIndex, hoverIndex } = useMagneticHoverListState();
  const reduceMotion = useReducedMotion();
  const isActive = hoveredIndex === index;

  return (
    <MagneticHoverItem
      index={index}
      surfaceClassName="rounded-lg bg-transparent md:rounded-xl"
      activeSurfaceClassName="rounded-lg bg-bg-surface md:rounded-xl md:bg-bg-canvas"
      contentClassName="relative z-[2]"
      onFocus={() => hoverIndex(index)}
    >
      <Link href={href} className="block px-2 py-1 md:px-3">
        <span className="relative inline-grid">
          <motion.span
            className="col-start-1 row-start-1 text-primary-text md:text-text-muted"
            animate={{ opacity: isActive ? 0 : 1 }}
            transition={reduceMotion ? { duration: 0 } : magneticSpring}
          >
            {label}
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="col-start-1 row-start-1 text-text-primary"
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : magneticSpring}
          >
            {label}
          </motion.span>
        </span>
      </Link>
    </MagneticHoverItem>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-center border-t border-border-subtle bg-bg-canvas p-4 md:h-[92px] md:min-h-[92px] md:border-light-200 md:bg-bg-surface md:px-[60px] md:py-0">
      <MagneticHoverList
        className="flex flex-wrap items-center justify-center gap-4 text-center text-xs font-normal leading-normal text-primary-text md:gap-1 md:text-sm md:font-medium md:leading-6 md:text-text-muted"
        pillClassName="rounded-lg border-[1.5px] border-border-subtle bg-bg-surface md:rounded-xl md:border md:border-light-200 md:bg-bg-canvas"
        itemSurfaceClassName="bg-transparent"
        itemActiveSurfaceClassName="rounded-lg bg-bg-surface md:rounded-xl md:bg-bg-canvas"
      >
        {footerLinks.map((link, i) => {
          const isLast = i === footerLinks.length - 1;

          return (
            <div key={link.href} className="flex items-center gap-1">
              <FooterLink href={link.href} label={link.label} index={i} />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="mx-1 hidden select-none text-border-subtle md:inline"
                >
                  |
                </span>
              )}
            </div>
          );
        })}
      </MagneticHoverList>
    </footer>
  );
}