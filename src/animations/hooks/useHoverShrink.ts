"use client";

import { useReducedMotion } from "framer-motion";
import { hoverShrinkSpring } from "../core/springs";

/** Shared hover shrink: scale to 94% with `hoverShrinkSpring`. */
export function useHoverShrink(enabled = true) {
  const reduceMotion = useReducedMotion();
  const active = enabled && !reduceMotion;

  return {
    whileHover: active ? { scale: 0.94 } : undefined,
    transition: active ? hoverShrinkSpring : { duration: 0 },
    style: { transformOrigin: "center" as const },
  };
}
