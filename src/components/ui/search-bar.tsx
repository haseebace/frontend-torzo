"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { torzoCornerSmoothing, useFigmaCorner } from "@/figma-radius";
import { cn } from "@/lib/utils";

export type SearchBarProps = {
  active?: boolean;
  reduceMotion?: boolean | null;
  className?: string;
  children: ReactNode;
};

export const searchInteractionSpring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 24,
  mass: 0.8,
};

export const searchActivationSpring = {
  type: "spring" as const,
  stiffness: 230,
  damping: 21,
  mass: 2.5,
};

export function SearchBar({
  active = false,
  reduceMotion = false,
  className,
  children,
}: SearchBarProps) {
  const [ref, cornerStyle] = useFigmaCorner<HTMLDivElement>(999, torzoCornerSmoothing)

  return (
    <motion.div
      ref={ref}
      style={cornerStyle}
      className={cn(
        "relative h-[62px] w-full max-w-[680px] bg-bg-surface",
        className,
      )}
      initial={{ maxWidth: active ? 680 : 640 }}
      animate={{ maxWidth: active ? 680 : 640 }}
      transition={reduceMotion ? { duration: 0 } : searchActivationSpring}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={cornerStyle}
        className="pointer-events-none absolute inset-0 z-20 border border-border-subtle"
        initial={false}
        animate={{
          opacity: 1,
          borderWidth: 1,
        }}
        transition={reduceMotion ? { duration: 0 } : searchActivationSpring}
      />
    </motion.div>
  );
}
