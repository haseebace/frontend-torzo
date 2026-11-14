/** Spring preset for the footer's magnetic hover background. */

import type { Transition } from "framer-motion";

export const magneticSpring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

/** Shrink-on-hover spring used by screenshots, detail actions, and Manage. */
export const hoverShrinkSpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 22,
  mass: 0.55,
};
