"use client";

import { useLayoutEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { hoverShrinkSpring } from "../core/springs";

const shrink = { scale: 0.94 };

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return canHover;
}

/** Shrink to 94% on hover for a fine pointer, and on tap everywhere else. */
export function useHoverShrink(enabled = true) {
  const reduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const active = enabled && !reduceMotion;

  return {
    whileHover: active && canHover ? shrink : undefined,
    whileTap: active && !canHover ? shrink : undefined,
    transition: active ? hoverShrinkSpring : { duration: 0 },
    style: { transformOrigin: "center" as const },
  };
}
