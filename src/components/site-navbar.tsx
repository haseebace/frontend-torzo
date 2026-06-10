"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatedMenuToggle } from "@/components/animated-menu-toggle";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { easeOut, menuItemSpring } from "@/animations";

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const toggleMenu = () => {
    setIsOpen((current) => !current);
  };

  const reduceMotion = useReducedMotion();

  return (
    <>
      <header className={`relative z-[110] flex h-[72px] w-full px-4 md:px-12 ${isHomepage ? "origin-center animate-homepage-enter" : ""}`}>
        <nav className="relative flex w-full items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[33px] font-extrabold leading-none text-foreground"
          >
            <span className="md:hidden">T.</span>
            <span className="hidden md:inline">Torzo.</span>
          </Link>

          <AnimatedMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />

          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="ghost"
              className="h-[40px] px-5 font-sans rounded-full"
            >
              <Link href="/how-to-use">How to Use</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-[40px] px-5 font-sans rounded-full"
            >
              <Link href="/library">Library</Link>
            </Button>
            <ThemeToggle
              size="icon-sm"
              className="h-[40px] w-[40px] rounded-full"
            />
            <Button asChild className="h-[50px] px-6 font-sans">
              <Link href="/manage">Manage</Link>
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-foreground/10 px-4 py-5 text-foreground backdrop-blur-xl md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.22, ease: easeOut }}
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="font-sans text-[33px] font-extrabold leading-none text-foreground"
              >
                T.
              </Link>
              <span className="size-[50px]" aria-hidden="true" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={reduceMotion ? { duration: 0 } : { ...menuItemSpring, delay: 0.08 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-[50px] px-8 font-sans"
                >
                  <Link href="/how-to-use">How to Use</Link>
                </Button>
              </motion.div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={reduceMotion ? { duration: 0 } : { ...menuItemSpring, delay: 0.12 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-[50px] px-8 font-sans"
                >
                  <Link href="/library">Library</Link>
                </Button>
              </motion.div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={reduceMotion ? { duration: 0 } : { ...menuItemSpring, delay: 0.16 }}
              >
                <ThemeToggle
                  size="icon"
                  className="h-[50px] w-[50px] rounded-full"
                />
              </motion.div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={reduceMotion ? { duration: 0 } : { ...menuItemSpring, delay: 0.20 }}
              >
                <Button asChild className="h-[50px] px-8 font-sans">
                  <Link href="/manage">Manage</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
