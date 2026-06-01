"use client";

import { useState, useCallback } from "react";
import { magneticSpring } from "../core/springs";
import type { MorphTransitionConfig, MorphTransitionState } from "../types";

/**
 * Hook for managing a morph transition between two states.
 *
 * Handles the open/close state and provides the transition config
 * for Framer Motion layoutId morphing.
 *
 * @example
 * ```tsx
 * const morph = useMorphTransition({ layoutId: "feedback-card" });
 *
 * <MorphSurface morph={morph}>
 *   <MorphCollapsed className="rounded-full px-4 py-2" onClick={morph.open}>
 *     <MorphChild layoutId="title">Feedback</MorphChild>
 *   </MorphCollapsed>
 *   <MorphExpanded className="w-80 rounded-xl">
 *     <MorphChild layoutId="title">Feedback</MorphChild>
 *     <MorphContent>
 *       <textarea />
 *     </MorphContent>
 *   </MorphExpanded>
 * </MorphSurface>
 * ```
 */
export function useMorphTransition({
  layoutId,
  transition = magneticSpring,
}: MorphTransitionConfig): MorphTransitionState {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    layoutId,
    transition,
  };
}
