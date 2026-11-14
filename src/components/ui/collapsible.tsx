"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const collapsibleSpring = {
  type: "spring" as const,
  duration: 0.88,
  bounce: 0.52,
}

/** Detail Files/Images: height only — no bounce or opacity on close (avoids end jitter). */
const flushCollapseEase = [0.4, 0, 0.2, 1] as const

const flushOpenTransition = {
  height: { duration: 0.32, ease: flushCollapseEase },
}

const flushContentFadeIn = {
  duration: 0.28,
  ease: flushCollapseEase,
  delay: 0.06,
}

const flushContentFadeOut = {
  duration: 0.14,
  ease: flushCollapseEase,
}

const flushCloseTransition = {
  height: { duration: 0.26, ease: flushCollapseEase },
}

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
      data-state={open ? "open" : "closed"}
      className={cn(
        "flex w-full shrink-0 items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-subtle",
        className,
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  flush = false,
  forceMount: _forceMount,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
  flush?: boolean
}) {
  const { open, contentId } = React.useContext(CollapsibleMotionContext)
  const reduceMotion = useReducedMotion()
  const useHeightOnlyMotion = flush || reduceMotion
  void _forceMount

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="collapsible-content"
          initial={
            useHeightOnlyMotion
              ? { height: 0 }
              : { height: 0, opacity: 0, scaleY: 0.72 }
          }
          animate={
            useHeightOnlyMotion
              ? { height: "auto" }
              : { height: "auto", opacity: 1, scaleY: 1 }
          }
          exit={
            useHeightOnlyMotion
              ? {
                  height: 0,
                  transition: flushCloseTransition,
                }
              : {
                  height: 0,
                  opacity: [1, 1, 0.92, 0],
                  y: [0, -6, 4, 0],
                  scaleY: [1, 1.04, 0.96, 0.72],
                  transition: {
                    duration: 0.62,
                    ease: [0.22, 1, 0.36, 1],
                    times: [0, 0.24, 0.52, 1],
                  },
                }
          }
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : useHeightOnlyMotion
                ? flushOpenTransition
                : collapsibleSpring
          }
          style={{ transformOrigin: "top center" }}
          className="overflow-hidden"
        >
          <div
            id={contentId}
            data-slot="collapsible-content"
            data-state="open"
            className={cn("overflow-hidden", className)}
            {...props}
          >
            {flush ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        transition: flushContentFadeOut,
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { opacity: flushContentFadeIn }
                }
              >
                {children}
              </motion.div>
            ) : (
              <div className="border-t border-border/70">
                <div className="max-h-[360px] overflow-y-auto overscroll-contain px-5 py-2">
                  {children}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
