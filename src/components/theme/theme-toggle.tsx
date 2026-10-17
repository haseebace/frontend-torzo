"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

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
      <span className="flex items-center justify-center">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
    </Button>
  );
}
