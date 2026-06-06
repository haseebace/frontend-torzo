"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { iconSwapSpring } from "@/animations";

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
  const reduceMotion = useReducedMotion();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      aria-expanded={isOpen}
      onClick={toggleMenu}
      className={cn(
        "relative z-[120] size-[50px] rounded-full bg-transparent text-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-primary/15 active:scale-[0.96] md:hidden",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isOpen ? "close-icon" : "hamburger-icon"}
          initial={reduceMotion ? false : {
            opacity: 0,
            scale: 0.25,
            rotate: isOpen ? -18 : 18,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          exit={reduceMotion ? { opacity: 0 } : {
            opacity: 0,
            scale: 0.25,
            rotate: isOpen ? 18 : -18,
          }}
          transition={reduceMotion ? { duration: 0 } : iconSwapSpring}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="size-7" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
