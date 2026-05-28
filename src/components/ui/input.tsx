import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "box-border h-14 w-full min-w-0 appearance-none rounded-full border-0 bg-surface-subtle px-5 py-0 text-[16px] leading-none text-foreground shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-500 ease-out file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-subtle hover:bg-surface hover:shadow-sm focus-visible:border-4 focus-visible:border-secondary focus-visible:bg-surface disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-badge disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
