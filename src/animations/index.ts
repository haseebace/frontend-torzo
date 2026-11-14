/** Magnetic hover: see `MagneticHoverList` / `MagneticHoverItem`. */
export { hoverShrinkSpring, magneticSpring } from "./core/springs";
export { useHoverShrink } from "./hooks/useHoverShrink";
export { useMagneticHover } from "./hooks/useMagneticHover";
export { useMagneticHoverList } from "./hooks/useMagneticHoverList";
export type { MagneticHoverOverlayRect } from "./hooks/useMagneticHoverList";
export {
  MagneticHoverItem,
  MagneticHoverList,
  useMagneticHoverListState,
} from "./magnetic-hover-list";
export type {
  MagneticHoverItemProps,
  MagneticHoverListProps,
} from "./magnetic-hover-list";
export type {
  MagneticHoverBackgroundProps,
  MagneticHoverContainerProps,
} from "./types";
