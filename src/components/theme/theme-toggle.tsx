"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { iconSwapSpring } from "@/animations";

type ThemeMode = "light" | "dark";

function getOpposite(current: ThemeMode | undefined): ThemeMode {
  return current === "dark" ? "light" : "dark";
}

type ThemeToggleProps = {
  size?: "icon-sm" | "icon";
  className?: string;
};

export function ThemeToggle({ size = "icon-sm", className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayMode: ThemeMode = theme === "dark" ? "dark" : "light";
  const Icon = displayMode === "dark" ? Sun : Moon;
  const ariaLabel = mounted
    ? displayMode === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";

  const handleClick = () => {
    setTheme(getOpposite(displayMode));
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
