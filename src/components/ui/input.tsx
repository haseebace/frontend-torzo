import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "surface"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "box-border h-14 w-full min-w-0 appearance-none rounded-full border-0 px-5 py-0 text-[16px] leading-none text-foreground shadow-none outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-subtle focus-visible:border-4 focus-visible:border-secondary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-badge disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20",
        variant === "surface"
          ? "field-surface"
          : "bg-surface-subtle hover:bg-surface focus-visible:bg-surface",
        className
      )}
      {...props}
    />
  )
}

export { Input }
