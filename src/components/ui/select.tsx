"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"
import { gentleSpring, useMagneticHover, MagneticHoverBackground } from "@/animations"

const MotionSelectTrigger = motion.create(SelectPrimitive.Trigger as any);
const liquidSurfaceSpring = {
  type: "spring",
  stiffness: 165,
  damping: 31,
  mass: 0.92,
  opacity: {
    duration: 0.14,
    ease: [0.16, 1, 0.3, 1],
  },
  filter: {
    duration: 0.18,
    ease: [0.16, 1, 0.3, 1],
  },
} as const;

const pointerSpring = {
  stiffness: 260,
  damping: 20,
  mass: 0.45,
};

const SelectMotionContext = React.createContext({
  open: false,
});

function useSelectMotionContext() {
  return React.useContext(SelectMotionContext);
}

type MagneticContextValue = {
  setHoveredIndex: (index: number) => void;
  getBackgroundProps: (index: number) => ReturnType<typeof useMagneticHover>['getBackgroundProps'] extends (i: number) => infer R ? R : never;
} | null;

const MagneticContext = React.createContext<MagneticContextValue>(null);

function useMagneticContext() {
  return React.useContext(MagneticContext);
}

// ─── Counter for item indices ───

const IndexContext = React.createContext<{ next: () => number } | null>(null);

function useItemIndex() {
  const ctx = React.useContext(IndexContext);
  if (!ctx) return -1;
  return ctx.next();
}

function SelectLiquidBridge({
  open,
  shouldReduceMotion,
}: {
  open: boolean;
  shouldReduceMotion: boolean | null;
}) {
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-7 w-[78%] -translate-x-1/2 rounded-full bg-surface blur-md"
      initial={{ opacity: 0, y: -18, scaleX: 0.22, scaleY: 0.52 }}
      animate={
        open
          ? {
              opacity: [0, 0.78, 0.36, 0],
              y: [-18, -8, -2, 4],
              scaleX: [0.22, 0.72, 1.08, 0.96],
              scaleY: [0.52, 1.18, 0.82, 0.62],
            }
          : { opacity: 0, y: -18, scaleX: 0.22, scaleY: 0.52 }
      }
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function SelectLiquidSurface({
  shouldReduceMotion,
  children,
}: {
  shouldReduceMotion: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative max-h-(--radix-select-content-available-height) origin-top overflow-x-hidden overflow-y-auto border border-border bg-surface p-1 shadow-sm"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0.98,
              y: -8,
              scaleX: 0.56,
              scaleY: 0.16,
              borderRadius: 22,
              filter: "blur(3px)",
            }
      }
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              borderRadius: 12,
              filter: "blur(0px)",
            }
      }
      exit={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 0,
              y: -4,
              scaleX: 0.96,
              scaleY: 0.82,
              filter: "blur(2px)",
            }
      }
      transition={liquidSurfaceSpring}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -3 }}
        transition={{ duration: 0.2, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function SelectTriggerSurface({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-surface"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              scaleX: 1,
              scaleY: 1,
            }
      }
      transition={liquidSurfaceSpring}
    />
  );
}

// ─── Components ───

function Select({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    Boolean(defaultOpen)
  );
  const open = openProp ?? uncontrolledOpen;

  function handleOpenChange(nextOpen: boolean) {
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  return (
    <SelectMotionContext.Provider value={{ open }}>
      <SelectPrimitive.Root
        data-slot="select"
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SelectMotionContext.Provider>
  )
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  const { open } = useSelectMotionContext();
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, pointerSpring);
  const springY = useSpring(pointerY, pointerSpring);
  const rotateX = useTransform(springY, [-6, 6], [2.5, -2.5]);
  const rotateY = useTransform(springX, [-6, 6], [-2.5, 2.5]);

  React.useEffect(() => {
    if (!open) return;
    pointerX.set(0);
    pointerY.set(0);
  }, [open, pointerX, pointerY]);

  function handlePointerMove(
    event: React.PointerEvent<React.ElementRef<typeof SelectPrimitive.Trigger>>
  ) {
    onPointerMove?.(event);
    if (shouldReduceMotion || open) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 9;

    pointerX.set(x);
    pointerY.set(y);
  }

  function handlePointerLeave(
    event: React.PointerEvent<React.ElementRef<typeof SelectPrimitive.Trigger>>
  ) {
    onPointerLeave?.(event);
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <MotionSelectTrigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group/select relative inline-flex w-fit origin-center items-center justify-between gap-2 overflow-hidden rounded-xl border border-border bg-transparent px-4 text-sm font-semibold whitespace-nowrap text-foreground-strong transition-[border-color,color,box-shadow] duration-200 ease-out outline-none select-none hover:border-brand-border hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-11 data-[size=sm]:h-10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:data-[slot=select-value]:relative *:data-[slot=select-value]:z-10 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        className
      )}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              scaleX: 1,
              scaleY: 1,
            }
      }
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scaleX: 1.012,
              scaleY: 0.988,
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scaleX: 0.982,
              scaleY: 1.055,
            }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.55,
      }}
      style={
        shouldReduceMotion
          ? style
          : {
              ...style,
              x: springX,
              y: springY,
              rotateX,
              rotateY,
              transformPerspective: 700,
            }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <SelectTriggerSurface shouldReduceMotion={shouldReduceMotion} />
      {children}
      <SelectPrimitive.Icon asChild>
        <motion.span
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none relative z-10 flex size-4 items-center justify-center"
        >
          <ChevronDownIcon className="size-4 text-muted-foreground transition-colors group-hover/select:text-foreground-strong" />
        </motion.span>
      </SelectPrimitive.Icon>
    </MotionSelectTrigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 6,
  magnetic = false,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  magnetic?: boolean;
}) {
  const { open } = useSelectMotionContext();
  const shouldReduceMotion = useReducedMotion();

  if (magnetic) {
    return (
      <MagneticSelectContent
        className={className}
        position={position}
        align={align}
        sideOffset={sideOffset}
        open={open}
        shouldReduceMotion={shouldReduceMotion}
        {...props}
      >
        {children}
      </MagneticSelectContent>
    );
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-visible rounded-xl bg-transparent text-foreground",
          className
        )}
        position={position}
        align={align}
        sideOffset={sideOffset}
        {...props}
      >
        <AnimatePresence initial={false}>
          {open && (
            <>
              <SelectLiquidBridge
                open={open}
                shouldReduceMotion={shouldReduceMotion}
              />
              <SelectLiquidSurface
                shouldReduceMotion={shouldReduceMotion}
              >
          <SelectLiquidBridge
            open={open}
            shouldReduceMotion={shouldReduceMotion}
          />
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            data-position={position}
            className="relative z-10 w-full"
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
            </SelectLiquidSurface>
            </>
          )}
        </AnimatePresence>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function MagneticSelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 6,
  open,
  shouldReduceMotion,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  open: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const { containerProps, setHoveredIndex, getBackgroundProps } = useMagneticHover({
    layoutId: "select-hover-bg",
    transition: gentleSpring,
  });

  const counterRef = React.useRef(0);
  const indexApi = React.useMemo(() => ({
    next: () => counterRef.current++,
  }), []);

  // Reset counter when content opens
  React.useEffect(() => {
    counterRef.current = 0;
  });

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-visible rounded-xl bg-transparent text-foreground",
          className
        )}
        position={position}
        align={align}
        sideOffset={sideOffset}
        {...props}
      >
        <AnimatePresence initial={false}>
          {open && (
            <>
              <SelectLiquidBridge
                open={open}
                shouldReduceMotion={shouldReduceMotion}
              />
              <SelectLiquidSurface
                shouldReduceMotion={shouldReduceMotion}
              >
          <SelectLiquidBridge
            open={open}
            shouldReduceMotion={shouldReduceMotion}
          />
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            data-position={position}
            className="relative z-10 w-full"
          >
            <div {...containerProps}>
              <IndexContext.Provider value={indexApi}>
                <MagneticContext.Provider value={{ setHoveredIndex, getBackgroundProps }}>
                  {children}
                </MagneticContext.Provider>
              </IndexContext.Provider>
            </div>
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
            </SelectLiquidSurface>
            </>
          )}
        </AnimatePresence>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const index = useItemIndex();
  const magnetic = useMagneticContext();
  const bgProps = magnetic ? magnetic.getBackgroundProps(index) : null;

  if (!magnetic || index === -1) {
    return (
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          "relative flex min-h-9 w-full cursor-default items-center gap-2 rounded-md py-2 pr-9 pl-3 text-sm font-medium text-foreground-strong outline-hidden select-none transition-[background-color,color,transform] duration-200 ease-out focus:bg-brand-surface focus:text-primary active:scale-[0.96] motion-reduce:active:scale-100 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          className
        )}
        {...props}
      >
        <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center text-foreground">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="pointer-events-none" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => magnetic.setHoveredIndex(index)}
    >
      <AnimatePresence>
        {bgProps?.isActive && (
          <MagneticHoverBackground
            {...bgProps}
            className="rounded-[10px] bg-surface-subtle"
          />
        )}
      </AnimatePresence>
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          "relative z-10 flex min-h-9 w-full cursor-default items-center gap-2 rounded-md py-2 pr-9 pl-3 text-sm font-medium text-foreground-strong outline-hidden select-none focus:bg-brand-surface focus:text-primary active:scale-[0.96] motion-reduce:active:scale-100 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          className
        )}
        {...props}
      >
        <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center text-foreground">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="pointer-events-none" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    </div>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-')]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-')]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
