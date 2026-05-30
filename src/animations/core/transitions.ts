/**
 * Reusable transition presets for Framer Motion.
 *
 * Transitions combine duration + easing into ready-to-use objects.
 * Import these and spread them into `transition` props.
 */

import type { Transition } from "framer-motion";
import { easeOut, easeSmooth, easeHomepage } from "./easings";
import { standardSpring, magneticSpring, morphSpring, contentSwapSpring } from "./springs";

/** Fade in — opacity only. */
export const fadeIn: Transition = {
  duration: 0.3,
  ease: easeOut,
};

/** Fade in slow — for page-level fades. */
export const fadeInSlow: Transition = {
  duration: 1,
  ease: easeOut,
};

/** Scale in — opacity + subtle scale. */
export const scaleIn: Transition = {
  duration: 0.4,
  ease: easeSmooth,
};

/** Homepage entrance — the custom dramatic easing. */
export const homepageEnter: Transition = {
  duration: 3,
  ease: easeHomepage,
};

/** Magnetic hover background — spring-based. */
export const magneticHover: Transition = magneticSpring;

/** Standard micro-interaction — spring-based. */
export const microInteraction: Transition = standardSpring;

/**
 * Morph container — weighty spring for large shape changes.
 * Use on the element that is expanding/contracting (button, select trigger, panel).
 */
export const morphContainer: Transition = morphSpring;

/**
 * Morph content swap — for fading, blurring and scaling inner content
 * while the parent morphs. Slightly quicker response than the container.
 */
export const morphContent: Transition = contentSwapSpring;
