"use client"

import * as React from "react"
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
          "overflow-hidden rounded-card border border-border bg-surface",
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
        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-subtle",
        className,
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  const { open, contentId } = React.useContext(CollapsibleMotionContext)

  return (
    <CollapsiblePrimitive.CollapsibleContent
      id={contentId}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-[var(--ui-ease-enter)]",
        open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      <div className="border-t border-border/70">
        <div className="max-h-[360px] overflow-y-auto overscroll-contain px-5 py-2">
          {children}
        </div>
      </div>
    </CollapsiblePrimitive.CollapsibleContent>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
