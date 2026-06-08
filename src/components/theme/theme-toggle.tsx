"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { iconSwapSpring } from "@/animations";

type ThemeMode = "light" | "dark" | "system";

const ORDER: ThemeMode[] = ["light", "dark", "system"];

function getNextMode(current: ThemeMode | undefined): ThemeMode {
  if (!current) return "dark";
  const idx = ORDER.indexOf(current);
  return ORDER[(idx + 1) % ORDER.length];
}

function getModeIcon(mode: ThemeMode | undefined) {
  if (mode === "dark") return Moon;
  if (mode === "system") return Monitor;
  return Sun;
}

function getAriaLabel(mode: ThemeMode | undefined, resolved: string | undefined) {
  if (mode === "light") return "Switch to dark mode";
  if (mode === "dark") return "Switch to system theme";
  if (mode === "system") return "Switch to light mode";
  return resolved === "dark" ? "Switch theme" : "Switch theme";
}

type ThemeToggleProps = {
  size?: "icon-sm" | "icon";
  className?: string;
};

export function ThemeToggle({ size = "icon-sm", className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayMode: ThemeMode = (theme as ThemeMode) ?? "system";
  const Icon = getModeIcon(mounted ? displayMode : undefined);
  const ariaLabel = mounted
    ? getAriaLabel(displayMode, resolvedTheme)
    : "Toggle theme";

  const handleClick = () => {
    setTheme(getNextMode(displayMode));
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={className ?? "rounded-full"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? displayMode : "placeholder"}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 18 }}
          transition={reduceMotion ? { duration: 0 } : iconSwapSpring}
          className="flex items-center justify-center"
        >
          <Icon className="size-[18px]" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
