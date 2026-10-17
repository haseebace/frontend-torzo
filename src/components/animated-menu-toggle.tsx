"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnimatedMenuToggleProps = {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
};

export function AnimatedMenuToggle({
  isOpen,
  toggleMenu,
  className,
}: AnimatedMenuToggleProps) {
  const label = isOpen ? "Close menu" : "Open menu";
  const Icon = isOpen ? X : Menu;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      aria-expanded={isOpen}
      onClick={toggleMenu}
      className={cn(
        "relative z-[120] size-[50px] rounded-full bg-transparent text-foreground hover:bg-primary/5 hover:text-foreground focus-visible:ring-primary/15 md:hidden",
        className
      )}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        <Icon className="size-7" aria-hidden="true" />
      </span>
    </Button>
  );
}
