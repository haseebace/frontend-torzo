"use client";

import { useCallback, useState } from "react";
import type { Transition } from "framer-motion";
import { magneticSpring } from "../core/springs";
import type {
  MagneticHoverBackgroundProps,
  MagneticHoverContainerProps,
} from "../types";

/**
 * @deprecated Use `useMagneticHoverList` with `MagneticHoverList` / `MagneticHoverItem`.
 * The supported pattern is surface (z-0) → fixed pill (z-[1]) → content (z-[2]).
 */
export function useMagneticHover({
  layoutId,
  transition = magneticSpring,
}: {
  layoutId: string;
  transition?: Transition;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerProps: MagneticHoverContainerProps = {
    onMouseLeave: useCallback(() => setHoveredIndex(null), []),
  };

  const getBackgroundProps = useCallback(
    (index: number): MagneticHoverBackgroundProps => {
      const isActive = hoveredIndex === index;

      return {
        isActive,
        layoutId,
        transition,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    },
    [hoveredIndex, layoutId, transition],
  );

  return {
    hoveredIndex,
    setHoveredIndex,
    containerProps,
    getBackgroundProps,
  };
}