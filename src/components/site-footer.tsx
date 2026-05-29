"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useMagneticHover, MagneticHoverBackground } from "@/animations";

const footerLinks = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteFooter() {
  const { containerProps, setHoveredIndex, getBackgroundProps } =
    useMagneticHover({
      layoutId: "footer-hover",
    });

  return (
    <footer className="border-t border-border bg-background px-4 py-9 md:px-12">
      <nav
        {...containerProps}
        className="flex flex-wrap items-center justify-center gap-1 text-center text-xs font-medium leading-6 text-muted-foreground md:text-sm"
      >
        {footerLinks.map((link, i) => {
          const bgProps = getBackgroundProps(i);
          const isLast = i === footerLinks.length - 1;

          return (
            <div key={link.href} className="flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <AnimatePresence>
                  {bgProps.isActive && (
                    <MagneticHoverBackground
                      {...bgProps}
                      className="rounded-full bg-secondary"
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
                <span aria-hidden="true" className="select-none">
                  ·
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </footer>
  );
}
