/**
 * Shared animation types used across the animation system.
 */

import type { Spring, Transition } from "framer-motion";

/** Preset spring configuration. */
export type SpringPreset = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass?: number;
};

/** Callback to check if a specific index is currently hovered. */
export type HoverPredicate = (index: number) => boolean;

/** Props returned for a magnetic hover background item. */
export type MagneticHoverBackgroundProps = {
  /** Whether this item is the currently hovered one. */
  isActive: boolean;
  /** The layoutId to share across hovered items. */
  layoutId: string;
  /** The transition to apply. */
  transition: Transition;
  /** Initial animation state. */
  initial: { opacity: number };
  /** Animate animation state. */
  animate: { opacity: number };
  /** Exit animation state. */
  exit: { opacity: number };
};

/** Props returned for the container element. */
export type MagneticHoverContainerProps = {
  /** Call this on mouse leave to clear the hover state. */
  onMouseLeave: () => void;
};
