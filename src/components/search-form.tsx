"use client";

import { ArrowRight, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";

type SearchFormProps = {
  id: string;
  defaultValue?: string;
  className?: string;
};

export function SearchForm({ id, defaultValue, className }: SearchFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <form
      action="/results"
      autoComplete="off"
      className={cn(
        "group w-full max-w-3xl md:transition-[max-width] md:duration-300 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:focus-within:max-w-[52rem]",
        className
      )}
    >
      <label className="sr-only" htmlFor={id}>
        Search torrents
      </label>
      <div className="relative h-16">
        <span className="pointer-events-none absolute inset-y-0 left-5 z-10 flex items-center text-zinc-500 transition-colors group-focus-within:text-zinc-700">
          <Search className="size-5" />
        </span>
        <Input
          id={id}
          name="q"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          defaultValue={defaultValue}
          placeholder="Search movies, shows, games, software..."
          className="h-16 pl-12 pr-16 placeholder:text-[12px] md:placeholder:text-lg"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <motion.button
          type="submit"
          aria-label="Search"
          initial={isDesktop ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={
            isDesktop
              ? isFocused
                ? { scale: 1, opacity: 1, pointerEvents: "auto" as const }
                : { scale: 0.9, opacity: 0, pointerEvents: "none" as const }
              : { scale: 1, opacity: 1, pointerEvents: "auto" as const }
          }
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            buttonVariants({ variant: "torzoPill" }),
            "absolute inset-y-2 right-2 flex h-12 w-12 items-center justify-center md:inset-y-1/2 md:h-13 md:w-13 md:-translate-y-1/2"
          )}
        >
          <ArrowRight className="size-5" />
        </motion.button>
      </div>
    </form>
  );
}
