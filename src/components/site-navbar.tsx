"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatedMenuToggle } from "@/components/animated-menu-toggle";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((current) => !current);
  };

  return (
    <>
      <header className="relative z-[110] flex h-[60px] w-full border-b border-border-subtle px-4 md:px-10">
        <nav className="relative flex w-full items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[33px] font-extrabold leading-none text-text-primary"
          >
            <span className="md:hidden">T.</span>
            <span className="hidden md:inline">Torzo.</span>
          </Link>

          <AnimatedMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle
              size="icon-sm"
              className="h-10 w-10 rounded-full border border-border-subtle bg-bg-card p-3 text-text-primary hover:border-border-subtle hover:bg-bg-card hover:text-text-primary [&_svg]:size-3.5"
            />
            <Button
              asChild
              className="h-auto rounded-full border border-border-subtle bg-bg-card px-[18px] py-3 font-sans text-sm font-medium text-text-primary hover:border-border-subtle hover:bg-bg-card hover:text-text-primary"
            >
              <Link href="/manage">Manage</Link>
            </Button>
          </div>
        </nav>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-text-primary/10 px-4 py-5 text-text-primary backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="font-sans text-[33px] font-extrabold leading-none text-text-primary"
              >
                T.
              </Link>
              <span className="size-[50px]" aria-hidden="true" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <div>
                <Button
                  asChild
                  variant="ghost"
                  className="h-[50px] px-8 font-sans"
                >
                  <Link href="/how-to-use">How to Use</Link>
                </Button>
              </div>
              <div>
                <Button
                  asChild
                  variant="ghost"
                  className="h-[50px] px-8 font-sans"
                >
                  <Link href="/library">Library</Link>
                </Button>
              </div>
              <div>
                <ThemeToggle
                  size="icon"
                  className="h-[50px] w-[50px] rounded-full"
                />
              </div>
              <div>
                <Button asChild className="h-[50px] px-8 font-sans">
                  <Link href="/manage">Manage</Link>
                </Button>
              </div>
            </div>
        </div>
      ) : null}
    </>
  );
}
