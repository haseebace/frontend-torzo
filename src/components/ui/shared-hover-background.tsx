"use client";

import { createContext, useContext, useState } from "react";
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
        {children}
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
  index?: number; // auto-assigned via cloneElement if omitted
};

export function HoverItem({ children, className, index: propIndex }: HoverItemProps) {
  const ctx = useHoverList();
  const [autoIndex] = useState<number | undefined>(propIndex);

  // When rendered inside HoverList, we rely on the parent to inject the
  // correct index via cloneElement. If the user passes `index` manually
  // (e.g. when mapping), we respect that.
  const effectiveIndex = propIndex ?? autoIndex ?? 0;
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
// Convenience: cloneElement-based auto-indexing
// -------------------------------------------------------------------

type AutoIndexedHoverListProps = Omit<HoverListProps, "children"> & {
  children: React.ReactElement<HoverItemProps> | React.ReactElement<HoverItemProps>[];
};

export function AutoIndexedHoverList({
  children,
  ...listProps
}: AutoIndexedHoverListProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <HoverList {...listProps}>
      {items.map((child, index) =>
        // Inject the index into each HoverItem automatically
        // @ts-expect-error cloneElement with custom props
        <child.type key={child.key ?? index} {...child.props} index={index} />
      )}
    </HoverList>
  );
}
