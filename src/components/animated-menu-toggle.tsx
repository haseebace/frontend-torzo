"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnimatedMenuToggleProps = {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
};

const iconTransition = {
  type: "spring" as const,
  duration: 0.15,
  bounce: 0,
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
        "relative z-[120] size-[50px] rounded-pill bg-transparent text-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-primary/15 active:scale-[0.96] md:hidden",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isOpen ? "close-icon" : "hamburger-icon"}
          initial={{
            opacity: 0,
            scale: 0.25,
            rotate: isOpen ? -18 : 18,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 0.25,
            rotate: isOpen ? 18 : -18,
            filter: "blur(4px)",
          }}
          transition={iconTransition}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="size-7" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
