import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "box-border h-14 w-full min-w-0 appearance-none rounded-pill border border-border bg-surface-subtle px-5 py-0 text-[16px] leading-none text-foreground shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-500 ease-[var(--ui-ease-standard)] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-subtle hover:bg-surface hover:shadow-ui-input-hover focus-visible:border-ring focus-visible:bg-surface focus-visible:shadow-ui-input-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-badge disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-ui-input-invalid",
        className
      )}
      {...props}
    />
  )
}

export { Input }
