/**
 * Core easing presets for Framer Motion and CSS animations.
 *
 * Easings define the acceleration curve of a transition.
 * Use these for consistent timing across the app.
 */

/**
 * Standard ease-out — fast start, slow end.
 * Used for: UI elements entering the viewport, modals opening.
 */
export const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Smooth ease — balanced acceleration.
 * Used for: general-purpose transitions, background changes.
 */
export const easeSmooth = [0.4, 0, 0.2, 1] as const;

/**
 * Exponential ease-out — very fast start, very slow end.
 * Used for: page fades, large-scale motion.
 */
export const easeExpo = [0.19, 1, 0.22, 1] as const;

/**
 * The easing used for the homepage entrance animation.
 * Custom cubic-bezier for a dramatic, polished feel.
 */
export const easeHomepage = [0.56, 0.01, 0, 1.22] as const;
