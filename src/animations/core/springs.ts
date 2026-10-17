/** Spring preset for the footer's magnetic hover background. */

import type { Transition } from "framer-motion";

export const magneticSpring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};
