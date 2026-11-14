"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import { magneticSpring } from "./core/springs";
import {
  useMagneticHoverList,
  type MagneticHoverListContextValue as MagneticHoverListState,
} from "./hooks/useMagneticHoverList";
import { cn } from "@/lib/utils";

type MagneticHoverListContextValue = MagneticHoverListState & {
  itemSurfaceClassName: string;
  itemActiveSurfaceClassName: string;
};

const MagneticHoverListContext =
  createContext<MagneticHoverListContextValue | null>(null);

function useMagneticHoverListContext() {
  const context = useContext(MagneticHoverListContext);
  if (!context) {
    throw new Error(
      "MagneticHoverItem must be used within MagneticHoverList",
    );
  }
  return context;
}

export type MagneticHoverListProps = {
  children: ReactNode;
  className?: string;
  /** Sliding hover pill (fixed, z-[1]). */
  pillClassName?: string;
  pillZIndex?: string;
  /** Default z-0 surface behind the pill. */
  itemSurfaceClassName?: string;
  /** z-0 surface when hovered and reduced motion is enabled. */
  itemActiveSurfaceClassName?: string;
  /** Optional shared state (e.g. keyboard-driven hover in search). */
  state?: MagneticHoverListState;
  onLeave?: () => void;
  /**
   * Position the pill inside the list so a rounded, overflow-hidden ancestor
   * can clip it. Results stay viewport-fixed so the pill can cross card gaps.
   */
  clip?: boolean;
};

const defaultPillClassName = "rounded-3xl bg-light-100";
const defaultSurfaceClassName = "bg-bg-surface";
const defaultActiveSurfaceClassName = "bg-light-100";

export function MagneticHoverList({
  children,
  className,
  pillClassName = defaultPillClassName,
  pillZIndex = "z-[1]",
  itemSurfaceClassName = defaultSurfaceClassName,
  itemActiveSurfaceClassName = defaultActiveSurfaceClassName,
  state: externalState,
  onLeave,
  clip = false,
}: MagneticHoverListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const internalState = useMagneticHoverList(
    clip ? { anchorRef: listRef } : undefined,
  );
  const value = externalState ?? internalState;
  const { hoveredIndex, overlayRect, reduceMotion, clearHover } = value;

  return (
    <MagneticHoverListContext.Provider
      value={{
        ...value,
        itemSurfaceClassName,
        itemActiveSurfaceClassName,
      }}
    >
      <div
        ref={listRef}
        className={cn("relative", className)}
        onMouseLeave={() => {
          clearHover();
          onLeave?.();
        }}
      >
        {hoveredIndex !== null && overlayRect && !reduceMotion ? (
          <motion.div
            aria-hidden
            className={cn(
              "pointer-events-none",
              clip ? "absolute" : "fixed",
              pillZIndex,
              pillClassName,
            )}
            initial={false}
            animate={{
              top: overlayRect.top,
              left: overlayRect.left,
              width: overlayRect.width,
              height: overlayRect.height,
            }}
            transition={magneticSpring}
          />
        ) : null}
        {children}
      </div>
    </MagneticHoverListContext.Provider>
  );
}

export type MagneticHoverItemProps = {
  index: number;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  surfaceClassName?: string;
  activeSurfaceClassName?: string;
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
};

export function MagneticHoverItem({
  index,
  children,
  className,
  contentClassName = "relative z-[2]",
  surfaceClassName,
  activeSurfaceClassName,
  onMouseEnter,
  onFocus,
}: MagneticHoverItemProps) {
  const {
    hoveredIndex,
    hoverIndex,
    registerItemRef,
    reduceMotion,
    itemSurfaceClassName: listSurface,
    itemActiveSurfaceClassName: listActiveSurface,
  } = useMagneticHoverListContext();

  const isActive = hoveredIndex === index;
  const surface =
    surfaceClassName ?? listSurface;
  const activeSurface =
    activeSurfaceClassName ?? listActiveSurface;

  return (
    <div
      ref={(node) => registerItemRef(index, node)}
      className={cn("relative", className)}
      onMouseEnter={(event) => {
        hoverIndex(index);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        hoverIndex(index);
        onFocus?.(event);
      }}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          isActive && reduceMotion ? activeSurface : surface,
        )}
      />
      <div className={contentClassName}>{children}</div>
    </div>
  );
}

/** Optional hook for lists that need hover index outside MagneticHoverItem. */
export function useMagneticHoverListState() {
  return useMagneticHoverListContext();
}