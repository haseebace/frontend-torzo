/**
 * Torzo Animation System
 *
 * A centralized place for all animation logic in the app.
 *
 * Philosophy:
 * - Animation logic lives in `.ts` files (springs, easings, transitions, hooks).
 * - Components import what they need and apply it using Framer Motion primitives.
 * - No animation logic is trapped inside UI components.
 *
 * Structure:
 * - `core/` — Reusable springs, easings, and transition presets.
 * - `effects/` — Higher-level presentational wrappers (optional convenience).
 * - `hooks/` — Reusable animation hooks for state management.
 *
 * @example
 * ```tsx
 * import { useMagneticHover, MagneticHoverBackground } from "@/animations";
 * import { magneticSpring, easeOut } from "@/animations";
 *
 * const { containerProps, getBackgroundProps } = useMagneticHover({
 *   layoutId: "my-list",
 *   transition: magneticSpring,
 * });
 *
 * return (
 *   <div {...containerProps}>
 *     {items.map((item, i) => (
 *       <div key={i} className="relative" onMouseEnter={() => setHoveredIndex(i)}>
 *         <MagneticHoverBackground
 *           {...getBackgroundProps(i)}
 *           className="rounded-lg bg-surface-subtle"
 *         />
 *         <div className="relative z-10">{item.label}</div>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */

// Core primitives
export * from "./core/springs";
export * from "./core/easings";
export * from "./core/transitions";

// Hooks
export { useMagneticHover } from "./hooks/useMagneticHover";

// Effect components (optional convenience wrappers)
export { MagneticHoverBackground } from "./effects/magnetic-hover";

// Types
export type {
  SpringPreset,
  HoverPredicate,
  MagneticHoverBackgroundProps,
  MagneticHoverContainerProps,
} from "./types";
