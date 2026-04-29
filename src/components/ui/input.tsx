import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "box-border h-16 w-full min-w-0 appearance-none rounded-full border border-zinc-200 bg-white px-5 py-0 text-[16px] leading-16 text-zinc-950 shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.5,1)] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-400 hover:shadow-[0_8px_30px_rgba(24,24,27,0.06)] focus-visible:border-zinc-500 focus-visible:shadow-[0_0_0_4px_rgba(113,113,122,0.12),0_12px_40px_rgba(24,24,27,0.08)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_4px_rgba(220,38,38,0.12)] md:bg-white/85 md:text-lg md:backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
}

export { Input }
