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
      <header className="relative z-[110] flex w-full items-center border-b border-light-200 bg-bg-surface px-4 py-2 md:px-[60px]">
        <nav className="relative flex w-full items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[34px] font-extrabold leading-none text-primary-text"
          >
            <span className="md:hidden">T.</span>
            <span className="hidden md:inline">Torzo</span>
          </Link>

          <AnimatedMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle
              size="icon-sm"
              className="size-10 rounded-full border border-border-subtle bg-bg-canvas p-3 text-primary-text hover:border-border-subtle hover:bg-bg-canvas hover:text-primary-text [&_svg]:size-3.5"
            />
            <Button
              asChild
              className="h-auto min-h-0 w-fit rounded-full border border-border-subtle bg-bg-canvas px-[24px] py-[16px] font-sans text-[16px] font-normal leading-none text-primary-text hover:border-border-subtle hover:bg-bg-canvas hover:text-primary-text"
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
