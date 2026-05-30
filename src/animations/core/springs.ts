/**
 * Core spring presets for Framer Motion.
 *
 * Springs are reusable physics configurations for transitions.
 * Use these when you want natural, physical motion.
 */

import type { Transition } from "framer-motion";

/**
 * Standard UI spring — snappy but not aggressive.
 * Used for: hover effects, state changes, micro-interactions.
 */
export const standardSpring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

/**
 * Gentle spring — softer, more relaxed.
 * Used for: page transitions, large elements, delicate motion.
 */
export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

/**
 * Bouncy spring — playful with slight overshoot.
 * Used for: celebratory animations, onboarding, playful UI.
 */
export const bouncySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 15,
};

/**
 * Stiff spring — fast, minimal overshoot.
 * Used for: toggles, switches, quick state changes.
 */
export const stiffSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

/**
 * The spring used for the magnetic hover background effect.
 */
export const magneticSpring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

/**
 * Menu item spring — bouncy entrance with slight delay.
 * Used for: mobile menu items, dropdown items.
 */
export const menuItemSpring: Transition = {
  type: "spring",
  duration: 0.85,
  bounce: 0.75,
};

/**
 * Icon swap spring — fast, no bounce.
 * Used for: icon toggles (menu open/close), state changes.
 */
export const iconSwapSpring: Transition = {
  type: "spring",
  duration: 0.15,
  bounce: 0,
};

/**
 * Morph spring — tuned for large shape/layout transformations.
 * Lower stiffness + added mass gives a smooth, weighty, premium feel
 * when elements dramatically change size or form (button → input, panel expansion).
 * Use on the container that is changing dimensions.
 */
export const morphSpring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 26,
  mass: 1.1,
};

/**
 * Content swap spring — slightly snappier spring for inner content cross-fades.
 * Ideal for fading, blurring, and scaling text/labels while the parent container morphs.
 * Pairs perfectly with morphSpring on the outer element.
 */
export const contentSwapSpring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 32,
};
