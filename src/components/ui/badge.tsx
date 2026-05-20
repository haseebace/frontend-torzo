import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "ui-badge group/badge transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "[a]:hover:opacity-80",
        secondary:
          "[--badge-background:var(--secondary)] [--badge-foreground:var(--secondary-foreground)] [a]:hover:opacity-80",
        destructive:
          "[--badge-background:color-mix(in_oklch,var(--destructive)_10%,transparent)] [--badge-foreground:var(--destructive)] focus-visible:ring-destructive/20 dark:[--badge-background:color-mix(in_oklch,var(--destructive)_20%,transparent)] dark:focus-visible:ring-destructive/40 [a]:hover:opacity-80",
        outline:
          "[--badge-background:transparent] [--badge-border-color:var(--border)] [--badge-foreground:var(--foreground)] [a]:hover:[--badge-background:var(--muted)] [a]:hover:[--badge-foreground:var(--muted-foreground)]",
        ghost:
          "[--badge-background:transparent] hover:[--badge-background:var(--muted)] hover:[--badge-foreground:var(--muted-foreground)] dark:hover:[--badge-background:color-mix(in_oklch,var(--muted)_50%,transparent)]",
        link: "[--badge-background:transparent] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
