/**
 * Shared animation types used across the animation system.
 */

import type { Transition } from "framer-motion";

// ─── Magnetic Hover Types ───

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

// ─── Morph Transition Types ───

/** Configuration for useMorphTransition hook. */
export type MorphTransitionConfig = {
  /** Unique layoutId for the morphing surface. Must be unique per page. */
  layoutId: string;
  /** Framer Motion spring/transition config. Defaults to a smooth spring. */
  transition?: Transition;
};

/** State and controls returned by useMorphTransition. */
export type MorphTransitionState = {
  /** Whether the morph surface is in expanded state. */
  isOpen: boolean;
  /** Expand the surface. */
  open: () => void;
  /** Collapse the surface. */
  close: () => void;
  /** Toggle between states. */
  toggle: () => void;
  /** The shared layoutId for the morphing surface. */
  layoutId: string;
  /** The transition config to apply to motion elements. */
  transition: Transition;
};

/** Props for a morphing child element (text, icon, etc). */
export type MorphChildProps = {
  /** Unique layoutId for this child. Must match between collapsed and expanded. */
  layoutId: string;
  /** Additional CSS classes. */
  className?: string;
  /** Whether to only animate position (prevents size distortion). */
  positionOnly?: boolean;
  /** Children to render. */
  children: React.ReactNode;
};

/** Props for expanded-only content that fades in/out. */
export type MorphContentProps = {
  /** Delay before fade-in starts. */
  delay?: number;
  /** Duration of the fade. */
  duration?: number;
  /** Children to render. */
  children: React.ReactNode;
};
