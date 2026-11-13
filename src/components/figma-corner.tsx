"use client"

import type { ComponentProps } from "react"
import { torzoCornerSmoothing, useFigmaCorner } from "@/figma-radius"
import { cn } from "@/lib/utils"

type FigmaCornerProps = ComponentProps<"div"> & {
  radius: number
  smoothing?: number
}

export function FigmaCorner({
  radius,
  smoothing = torzoCornerSmoothing,
  className,
  style,
  ...props
}: FigmaCornerProps) {
  const [ref, cornerStyle] = useFigmaCorner<HTMLDivElement>(radius, smoothing)

  return (
    <div
      ref={ref}
      style={{ ...cornerStyle, ...style }}
      className={cn(className)}
      {...props}
    />
  )
}
