"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const motionEase = [0.16, 1, 0.3, 1] as const

const contentVariants: Variants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.62,
      ease: motionEase,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.42,
      ease: motionEase,
    },
  },
}

const listVariants: Variants = {
  open: {
    transition: {
      staggerChildren: 0.085,
      delayChildren: 0.16,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
}

const itemVariants: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.42,
      ease: motionEase,
    },
  },
  closed: {
    x: -14,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: motionEase,
    },
  },
}

const CollapsibleMotionContext = React.createContext({
  open: false,
  contentId: undefined as string | undefined,
})

function animateChildren(children: React.ReactNode) {
  const childArray = React.Children.toArray(children)

  if (childArray.length === 1 && React.isValidElement(childArray[0])) {
    const child = childArray[0]

    if (child.type === "div") {
      const {
        className,
        children: nestedChildren,
      } = child.props as React.HTMLAttributes<HTMLDivElement> & {
        children?: React.ReactNode
      }

      return (
        <motion.div className={className} variants={listVariants}>
          {React.Children.map(nestedChildren, (nestedChild, index) => (
            <motion.div key={index} variants={itemVariants}>
              {nestedChild}
            </motion.div>
          ))}
        </motion.div>
      )
    }
  }

  return (
    <motion.div variants={listVariants}>
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

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
          "overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
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
        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-50 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-[cubic-bezier(0.16,1,0.3,1)]",
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
    <div
      id={contentId}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <motion.div
        initial={false}
        animate={open ? "open" : "closed"}
        variants={contentVariants}
        className={cn(
          "overflow-hidden",
          open && "border-t border-zinc-200/70",
        )}
      >
        <div className="max-h-[360px] overflow-y-auto overscroll-contain px-5 py-2">
          {animateChildren(children)}
        </div>
      </motion.div>
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
