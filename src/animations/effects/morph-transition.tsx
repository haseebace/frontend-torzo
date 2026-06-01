"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MorphTransitionState, MorphChildProps, MorphContentProps } from "../types";

type MorphSurfaceProps = {
  /** State from useMorphTransition hook. */
  morph: MorphTransitionState;
  /** Content to render — should contain MorphCollapsed + MorphExpanded or manual conditional rendering. */
  children: React.ReactNode;
};

/**
 * Root container for a morph transition.
 *
 * Wraps children in AnimatePresence with mode="popLayout".
 * The collapsed and expanded surfaces should use the same `layoutId`
 * from the morph state.
 *
 * @example
 * ```tsx
 * const morph = useMorphTransition({ layoutId: "my-card" });
 *
 * <MorphSurface morph={morph}>
 *   {!morph.isOpen ? (
 *     <motion.button layoutId={morph.layoutId} ...>Click me</motion.button>
 *   ) : (
 *     <motion.div layoutId={morph.layoutId} ...>Expanded</motion.div>
 *   )}
 * </MorphSurface>
 * ```
 */
export function MorphSurface({ morph, children }: MorphSurfaceProps) {
  return (
    <AnimatePresence mode="popLayout">
      {children}
    </AnimatePresence>
  );
}

/**
 * A child element that morphs between collapsed and expanded states.
 *
 * Uses layoutId + layout="position" to smoothly transition
 * without size distortion.
 *
 * @example
 * ```tsx
 * <MorphChild layoutId="title">Feedback</MorphChild>
 * ```
 */
export function MorphChild({
  layoutId,
  className,
  positionOnly = true,
  children,
}: MorphChildProps) {
  return (
    <motion.span
      layoutId={layoutId}
      layout={positionOnly ? "position" : true}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

/**
 * Wrapper for content that only appears in the expanded state.
 * Fades in with a slight delay when opening, fades out when closing.
 *
 * @example
 * ```tsx
 * <MorphContent delay={0.1}>
 *   <textarea />
 *   <button>Send</button>
 * </MorphContent>
 * ```
 */
export function MorphContent({
  delay = 0.1,
  duration = 0.2,
  children,
}: MorphContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}
