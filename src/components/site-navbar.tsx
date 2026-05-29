"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatedMenuToggle } from "@/components/animated-menu-toggle";
import { Button } from "@/components/ui/button";
import { easeOut, menuItemSpring } from "@/animations";

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const toggleMenu = () => {
    setIsOpen((current) => !current);
  };

  return (
    <header className={`relative z-50 flex h-[90px] w-full px-4 md:px-12 ${isHomepage ? "origin-center animate-homepage-enter" : ""}`}>
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="font-sans text-[33px] font-extrabold leading-none text-primary"
        >
          <span className="md:hidden">T.</span>
          <span className="hidden md:inline">Torzo.</span>
        </Link>

        <AnimatedMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="ghost"
            className="h-[50px] px-5 font-sans"
          >
            <Link href="/how-to-use">How to Use</Link>
          </Button>
          <Button asChild className="h-[50px] px-6 font-sans">
            <Link href="/manage">Manage</Link>
          </Button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-black/10 px-4 py-5 text-foreground backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.22, ease: easeOut }}
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="font-sans text-[33px] font-extrabold leading-none text-primary"
              >
                T.
              </Link>
              <span className="size-[50px]" aria-hidden="true" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                transition={{ ...menuItemSpring, delay: 0.08 }}
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
                initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                transition={{ ...menuItemSpring, delay: 0.12 }}
              >
                <Button asChild className="h-[50px] px-8 font-sans">
                  <Link href="/manage">Manage</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
