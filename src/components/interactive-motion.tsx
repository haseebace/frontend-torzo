"use client";

import { animate } from "framer-motion";
import { useEffect, type ReactNode } from "react";

type InteractiveElement = HTMLElement & {
  matches: (selectors: string) => boolean;
};

type ScaleAnimation = {
  stop: () => void;
};

const interactiveSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.35,
};

const HOVER_SCALE = 0.975;
const PRESS_SCALE = 0.94;

function getScale(element: InteractiveElement, dataKey: string, fallback: number) {
  const value = Number(element.dataset[dataKey]);

  return Number.isFinite(value) ? value : fallback;
}

function getInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const element = target.closest<InteractiveElement>(
    'a[href], button:not(:disabled)',
  );

  if (!element || element.dataset.interactiveMotion === "managed") {
    return null;
  }

  return element;
}

export function InteractiveMotion({ children }: { children: ReactNode }) {
  useEffect(() => {
    const animations = new WeakMap<InteractiveElement, ScaleAnimation>();
    const pressedByPointer = new Map<number, InteractiveElement>();
    const pressedByKeyboard = new Set<InteractiveElement>();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animateScale = (element: InteractiveElement, scale: number) => {
      if (reduceMotion.matches) return;

      animations.get(element)?.stop();
      animations.set(
        element,
        animate(element, { scale }, interactiveSpring),
      );
    };

    const restoreScale = (element: InteractiveElement) => {
      const isHovered = element.matches(":hover");
      animateScale(
        element,
        isHovered ? getScale(element, "hoverScale", HOVER_SCALE) : 1,
      );
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element) return;

      if (
        event.relatedTarget instanceof Node &&
        element.contains(event.relatedTarget)
      ) {
        return;
      }

      animateScale(element, getScale(element, "hoverScale", HOVER_SCALE));
    };

    const handlePointerOut = (event: PointerEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element) return;

      if (
        event.relatedTarget instanceof Node &&
        element.contains(event.relatedTarget)
      ) {
        return;
      }

      if (![...pressedByPointer.values()].includes(element)) {
        restoreScale(element);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element) return;

      pressedByPointer.set(event.pointerId, element);
      animateScale(element, getScale(element, "pressScale", PRESS_SCALE));
    };

    const releasePointer = (pointerId: number) => {
      const element = pressedByPointer.get(pointerId);
      if (!element) return;

      pressedByPointer.delete(pointerId);
      restoreScale(element);
    };

    const handlePointerUp = (event: PointerEvent) => {
      releasePointer(event.pointerId);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }

      const element = getInteractiveElement(event.target);
      if (!element) return;

      pressedByKeyboard.add(element);
      animateScale(element, getScale(element, "pressScale", PRESS_SCALE));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element || !pressedByKeyboard.has(element)) return;

      pressedByKeyboard.delete(element);
      restoreScale(element);
    };

    const resetPressedElements = () => {
      for (const element of pressedByPointer.values()) restoreScale(element);
      for (const element of pressedByKeyboard) restoreScale(element);
      pressedByPointer.clear();
      pressedByKeyboard.clear();
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", handlePointerUp, true);
    document.addEventListener("pointercancel", handlePointerUp, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", resetPressedElements);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", handlePointerUp, true);
      document.removeEventListener("pointercancel", handlePointerUp, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", resetPressedElements);
      resetPressedElements();
    };
  }, []);

  return children;
}
