import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react"

const squircle = { cornerShape: "squircle" } as CSSProperties

/** Torzo v10 frames set Figma corner smoothing to 100%. */
export const torzoCornerSmoothing = 1

/** Phones keep the Figma radius. Smoothing stays on desktop. */
const desktopSmoothingQuery = "(min-width: 768px)"

function useDesktopSmoothing() {
  const [desktop, setDesktop] = useState(false)

  useLayoutEffect(() => {
    const media = window.matchMedia(desktopSmoothingQuery)
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return desktop
}

/** Figma radius plus smoothing, turned into the CSS border box. */
export function cssCorner(figmaRadius: number, cornerSmoothing: number, width: number, height: number) {
  const smoothing = Math.min(Math.max(cornerSmoothing, 0), 1)
  if (width <= 0 || height <= 0) {
    return { borderRadius: figmaRadius, squircle: false }
  }

  const budget = Math.min(width, height) / 2
  const usedRadius = Math.min(figmaRadius, budget)
  if (usedRadius <= 0) return { borderRadius: 0, squircle: false }

  const maxSmoothing = budget / usedRadius - 1
  const usedSmoothing = Math.min(smoothing, Math.max(maxSmoothing, 0))
  if (usedSmoothing <= 0) return { borderRadius: figmaRadius, squircle: false }

  return {
    borderRadius: Math.min((1 + usedSmoothing) * usedRadius, budget),
    squircle: true,
  }
}

export function cornerStyle(
  figmaRadius: number,
  cornerSmoothing: number,
  width: number,
  height: number,
): CSSProperties {
  const corner = cssCorner(figmaRadius, cornerSmoothing, width, height)
  return {
    borderRadius: corner.borderRadius,
    ...(corner.squircle ? squircle : undefined),
  }
}

export function useFigmaCorner<T extends HTMLElement>(
  figmaRadius: number,
  cornerSmoothing: number,
): [RefObject<T | null>, CSSProperties, boolean] {
  const ref = useRef<T>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    element.setAttribute("data-figma-corner", "")
    const measure = () => {
      const width = element.offsetWidth
      const height = element.offsetHeight
      setBox((current) => (current.width === width && current.height === height ? current : { width, height }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const smoothing = useDesktopSmoothing() ? cornerSmoothing : 0
  const corner = cssCorner(figmaRadius, smoothing, box.width, box.height)
  return [
    ref,
    {
      ...cornerStyle(figmaRadius, smoothing, box.width, box.height),
      "--figma-radius": `${figmaRadius}px`,
    },
    corner.squircle,
  ]
}
