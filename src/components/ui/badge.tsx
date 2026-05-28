import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full px-3.5 py-1.5 text-xs font-bold capitalize whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground [a]:hover:opacity-80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:opacity-80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 [a]:hover:opacity-80",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-muted-foreground",
        ghost:
          "bg-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "bg-transparent underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  dot = false,
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    dot?: boolean;
    icon?: LucideIcon;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  if (asChild) {
    return (
      <Comp
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot ? (
        <span
          className="size-2 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      ) : null}
      {children}
      {Icon ? <Icon aria-hidden="true" /> : null}
    </span>
  );
}

export { Badge, badgeVariants };
