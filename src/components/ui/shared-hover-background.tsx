"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   SharedHoverBackground — Reusable magnetic hover effect
   ------------------------------------------------------------------
   Usage:

   <HoverList backgroundClassName="rounded-[18px] bg-surface-subtle">
     {items.map((item) => (
       <HoverItem key={item.id}>
         <div className="flex items-center gap-2 px-3 py-2">
           {item.label}
         </div>
       </HoverItem>
     ))}
   </HoverList>

   The `HoverItem` children *must* be direct children of `HoverList`.
   Each `HoverItem` automatically receives the hover listener and the
   shared animated background is rendered inside it.
   ------------------------------------------------------------------ */

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

type SpringConfig = {
  stiffness?: number;
  damping?: number;
  mass?: number;
};

type HoverListContextValue = {
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  backgroundClassName?: string;
  springConfig: SpringConfig;
};

// -------------------------------------------------------------------
// Context
// -------------------------------------------------------------------

const HoverListContext = createContext<HoverListContextValue | null>(null);

function useHoverList() {
  const ctx = useContext(HoverListContext);
  if (!ctx) {
    throw new Error("HoverItem must be used inside a HoverList");
  }
  return ctx;
}

// -------------------------------------------------------------------
// HoverList (container)
// -------------------------------------------------------------------

type HoverListProps = {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  springConfig?: SpringConfig;
};

export function HoverList({
  children,
  className,
  backgroundClassName = "rounded-[18px] bg-surface-subtle",
  springConfig = { stiffness: 350, damping: 30 },
}: HoverListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Automatically inject `index` into direct HoverItem children
  const childrenWithIndex = React.Children.map(children, (child, index) => {
    if (React.isValidElement<HoverItemProps>(child) && child.type === HoverItem) {
      // Only inject if the user didn't explicitly pass an index
      if (child.props.index === undefined) {
        return React.cloneElement(child, { index });
      }
    }
    return child;
  });

  return (
    <HoverListContext.Provider
      value={{
        hoveredIndex,
        setHoveredIndex,
        backgroundClassName,
        springConfig,
      }}
    >
      <div
        className={className}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {childrenWithIndex}
      </div>
    </HoverListContext.Provider>
  );
}

// -------------------------------------------------------------------
// HoverItem (individual row)
// -------------------------------------------------------------------

type HoverItemProps = {
  children: React.ReactNode;
  className?: string;
  index?: number; // automatically provided by HoverList when used as direct child
};

export function HoverItem({ children, className, index: propIndex }: HoverItemProps) {
  const ctx = useHoverList();

  // HoverList automatically injects the index when HoverItem is used as a direct child.
  // Users can still pass `index` manually if needed.
  const effectiveIndex = propIndex ?? 0;
  const isHovered = ctx.hoveredIndex === effectiveIndex;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => ctx.setHoveredIndex(effectiveIndex)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="shared-hover-bg"
            className={cn("absolute inset-0", ctx.backgroundClassName)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              ...ctx.springConfig,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// -------------------------------------------------------------------
// Note:
// HoverList now automatically injects `index` into direct HoverItem children.
// You no longer need to manually pass `index` or use any wrapper component.
// -------------------------------------------------------------------
