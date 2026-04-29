"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SearchForm } from "@/components/search-form";

const rise: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export function HomeContent() {
  const shouldReduceMotion = useReducedMotion();

  const transition = {
    duration: shouldReduceMotion ? 0 : 0.5,
    ease: [0.16, 1, 0.3, 1],
  } as const;

  return (
    <>
      <div className="relative z-10 flex flex-1 -translate-y-20 items-center justify-center px-4 py-10 md:hidden">
        <section className="flex w-full flex-col items-center text-center">
          <div className="mb-8 space-y-3">
            <h1 className="text-[100px] font-[900] leading-[1.1] tracking-[4px] text-zinc-950">
              Torzo
            </h1>
            <p className="text-xs font-medium leading-6 text-zinc-500">
              Search movies, shows, games, and software — no noise.
            </p>
          </div>

          <SearchForm id="torrent-search-mobile" className="mx-auto" />
        </section>
      </div>

      <div className="relative z-10 hidden flex-1 -translate-y-32 items-center justify-center px-4 py-10 md:flex md:px-10 xl:px-[150px]">
        <section className="flex w-full flex-col items-center text-center">
          <motion.div
            variants={rise}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
            transition={transition}
            className="mb-8 space-y-3"
          >
            <h1 className="text-[125px] font-[900] leading-[1.1] tracking-[4px] text-zinc-950">
              Torzo
            </h1>
            <p className="text-sm font-medium leading-6 text-zinc-500">
              Search movies, shows, games, and software — no noise.
            </p>
          </motion.div>

          <motion.div
            variants={rise}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
            transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.05 }}
            className="w-full"
          >
            <SearchForm id="torrent-search" className="mx-auto" />
          </motion.div>
        </section>
      </div>

      <footer className="relative z-10 w-full px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:hidden">
        <nav className="mx-auto flex w-full flex-wrap justify-center gap-x-5 gap-y-2 border-t border-zinc-200/70 pt-6 text-xs font-medium text-zinc-500">
          <Link
            className="transition-colors hover:text-zinc-950"
            href="/results"
          >
            Results
          </Link>
          <Link
            className="transition-colors hover:text-zinc-950"
            href="/detail"
          >
            Detail
          </Link>
          <span className="text-zinc-300">Torzo alpha</span>
        </nav>
      </footer>

      <motion.footer
        variants={rise}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.1 }}
        className="relative z-10 hidden w-full px-4 pb-10 md:block md:px-10 xl:px-[150px]"
      >
        <nav className="mx-auto flex w-full flex-wrap justify-center gap-x-5 gap-y-2 border-t border-zinc-200/70 pt-6 text-xs font-medium text-zinc-500">
          <Link
            className="transition-colors hover:text-zinc-950"
            href="/results"
          >
            Results
          </Link>
          <Link
            className="transition-colors hover:text-zinc-950"
            href="/detail"
          >
            Detail
          </Link>
          <span className="text-zinc-300">Torzo alpha</span>
        </nav>
      </motion.footer>
    </>
  );
}
