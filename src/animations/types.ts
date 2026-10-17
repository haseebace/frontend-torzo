import type { Transition } from "framer-motion";

export type MagneticHoverBackgroundProps = {
  isActive: boolean;
  layoutId: string;
  transition: Transition;
  initial: { opacity: number };
  animate: { opacity: number };
  exit: { opacity: number };
};

export type MagneticHoverContainerProps = {
  onMouseLeave: () => void;
};
