"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
  return (
    <motion.div
      className={cn(
        "relative h-16 w-full max-w-[780px] rounded-full bg-bg-search-bar",
        className,
      )}
      initial={{ maxWidth: active ? 780 : 700 }}
      animate={{ maxWidth: active ? 780 : 700 }}
      transition={reduceMotion ? { duration: 0 } : searchActivationSpring}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-full border border-border-subtle"
        initial={false}
        animate={{
          opacity: 1,
          borderWidth: active ? 4 : 1,
          boxShadow: active ? "0 6px 16px #e1e1e399" : "0 0 0 transparent",
        }}
        transition={reduceMotion ? { duration: 0 } : searchActivationSpring}
      />
    </motion.div>
  );
}
