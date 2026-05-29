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
