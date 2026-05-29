"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MagneticHoverBackgroundProps } from "../types";

/**
 * Thin presentational wrapper for a magnetic hover background.
 *
 * Receives props from `useMagneticHover().getBackgroundProps(index)`
 * and renders the `<motion.div>` with the correct layoutId and transition.
 *
 * This is optional — you can render `<motion.div>` directly if you prefer.
 *
 * @example
 * ```tsx
 * const { getBackgroundProps } = useMagneticHover({ layoutId: "my-list" });
 *
 * {getBackgroundProps(i).isActive && (
 *   <MagneticHoverBackground
 *     {...getBackgroundProps(i)}
 *     className="rounded-[18px] bg-surface-subtle"
 *   />
 * )}
 * ```
 */
export function MagneticHoverBackground({
  isActive,
  layoutId,
  transition,
  initial,
  animate,
  exit,
  className,
}: MagneticHoverBackgroundProps & { className?: string }) {
  if (!isActive) return null;

  return (
    <motion.div
      layoutId={layoutId}
      className={cn("absolute inset-0", className)}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    />
  );
}
