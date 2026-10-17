"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const CollapsibleMotionContext = React.createContext({
  open: false,
  contentId: undefined as string | undefined,
})

function Collapsible({
  className,
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const contentId = React.useId()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const open = openProp ?? uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, openProp],
  )

  return (
    <CollapsibleMotionContext.Provider value={{ open, contentId }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={open}
        onOpenChange={handleOpenChange}
        className={cn(
          "overflow-hidden rounded-3xl border border-border bg-surface",
          className,
        )}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </CollapsibleMotionContext.Provider>
  )
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  const { open, contentId } = React.useContext(CollapsibleMotionContext)

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      aria-controls={contentId}
      aria-expanded={open}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-subtle",
        className,
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  forceMount: _forceMount,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  const { open, contentId } = React.useContext(CollapsibleMotionContext)
  const reduceMotion = useReducedMotion()
  void _forceMount

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="collapsible-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.24,
                  ease: [0.23, 1, 0.32, 1],
              }
          }
          className="overflow-hidden"
        >
          <div
            id={contentId}
            data-slot="collapsible-content"
            data-state="open"
            className={cn("overflow-hidden", className)}
            {...props}
          >
            <div className="border-t border-border/70">
              <div className="max-h-[360px] overflow-y-auto overscroll-contain px-5 py-2">
                {children}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
