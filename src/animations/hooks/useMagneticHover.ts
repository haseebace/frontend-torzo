"use client";

import { useState, useCallback } from "react";
import type { Transition } from "framer-motion";
import { magneticSpring } from "../core/springs";
import type {
  MagneticHoverBackgroundProps,
  MagneticHoverContainerProps,
} from "../types";

/**
 * Hook for creating a magnetic hover background effect.
 *
 * This manages hover state and returns the props needed to render
 * a shared `layoutId` motion background that smoothly transitions
 * between list items as the user hovers over them.
 *
 * @param layoutId - The shared layoutId for the motion background.
 *                   Must be unique per list on the same page.
 * @param transition - Framer Motion transition config.
 *                     Defaults to `magneticSpring`.
 *
 * @example
 * ```tsx
 * const { containerProps, getBackgroundProps } = useMagneticHover({
 *   layoutId: "file-list-hover",
 * });
 *
 * return (
 *   <div {...containerProps} className="divide-y divide-border/70">
 *     {files.map((file, i) => (
 *       <div key={i} className="relative" onMouseEnter={() => setHoveredIndex(i)}>
 *         {getBackgroundProps(i).isActive && (
 *           <motion.div
 *             layoutId="file-list-hover"
 *             className="absolute inset-0 rounded-[18px] bg-surface-subtle"
 *             initial={{ opacity: 0 }}
 *             animate={{ opacity: 1 }}
 *             exit={{ opacity: 0 }}
 *             transition={magneticSpring}
 *           />
 *         )}
 *         <div className="relative z-10">{file.name}</div>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
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
    [hoveredIndex, layoutId, transition]
  );

  return {
    /** Current hovered index, or null if none. */
    hoveredIndex,
    /** Set the hovered index directly. */
    setHoveredIndex,
    /** Props to spread on the container element. */
    containerProps,
    /** Get the motion background props for a specific item index. */
    getBackgroundProps,
  };
}
