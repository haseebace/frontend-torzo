/**
 * Core spring presets for Framer Motion.
 *
 * Springs are reusable physics configurations for transitions.
 * Use these when you want natural, physical motion.
 */

import type { Spring } from "framer-motion";

/**
 * Standard UI spring — snappy but not aggressive.
 * Used for: hover effects, state changes, micro-interactions.
 */
export const standardSpring: Spring = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

/**
 * Gentle spring — softer, more relaxed.
 * Used for: page transitions, large elements, delicate motion.
 */
export const gentleSpring: Spring = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

/**
 * Bouncy spring — playful with slight overshoot.
 * Used for: celebratory animations, onboarding, playful UI.
 */
export const bouncySpring: Spring = {
  type: "spring",
  stiffness: 400,
  damping: 15,
};

/**
 * Stiff spring — fast, minimal overshoot.
 * Used for: toggles, switches, quick state changes.
 */
export const stiffSpring: Spring = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

/**
 * The spring used for the magnetic hover background effect.
 */
export const magneticSpring: Spring = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};
