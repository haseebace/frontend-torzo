"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

export type MagneticHoverOverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type UseMagneticHoverListOptions = {
  /** When set, the pill is positioned inside this element so overflow/radius can clip it. */
  anchorRef?: RefObject<HTMLElement | null>;
};

/**
 * Shared hover index + measured pill rect
 * (surface z-0 → pill z-[1] → content z-[2]).
 * Without `anchorRef`, the rect is viewport-fixed. With it, the rect is
 * relative to that element.
 */
export function useMagneticHoverList(options?: UseMagneticHoverListOptions) {
  const anchorRef = options?.anchorRef;
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [overlayRect, setOverlayRect] = useState<MagneticHoverOverlayRect | null>(
    null,
  );
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const registerItemRef = useCallback((index: number, node: HTMLElement | null) => {
    itemRefs.current[index] = node;
  }, []);

  const measureItem = useCallback((index: number) => {
    const item = itemRefs.current[index];
    if (!item) {
      return;
    }

    const itemBox = item.getBoundingClientRect();
    const anchor = anchorRef?.current;

    if (anchor) {
      const anchorBox = anchor.getBoundingClientRect();
      setOverlayRect({
        top: itemBox.top - anchorBox.top + anchor.scrollTop,
        left: itemBox.left - anchorBox.left + anchor.scrollLeft,
        width: itemBox.width,
        height: itemBox.height,
      });
      return;
    }

    setOverlayRect({
      top: itemBox.top,
      left: itemBox.left,
      width: itemBox.width,
      height: itemBox.height,
    });
  }, [anchorRef]);

  const hoverIndex = useCallback(
    (index: number) => {
      setHoveredIndex(index);
      measureItem(index);
    },
    [measureItem],
  );

  const clearHover = useCallback(() => {
    setHoveredIndex(null);
    setOverlayRect(null);
  }, []);

  useLayoutEffect(() => {
    if (hoveredIndex === null) {
      setOverlayRect(null);
      return;
    }

    measureItem(hoveredIndex);

    const handleReposition = () => {
      if (hoveredIndex !== null) {
        measureItem(hoveredIndex);
      }
    };

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [hoveredIndex, measureItem]);

  return {
    reduceMotion,
    hoveredIndex,
    setHoveredIndex,
    hoverIndex,
    overlayRect,
    registerItemRef,
    measureItem,
    clearHover,
  };
}

export type MagneticHoverListContextValue = ReturnType<typeof useMagneticHoverList>;