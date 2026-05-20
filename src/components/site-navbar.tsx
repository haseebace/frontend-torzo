"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatedMenuToggle } from "@/components/animated-menu-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((current) => !current);
  };

  return (
    <header className="relative z-50 flex h-[90px] w-full px-4 md:px-16">
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="font-heading text-[33px] font-extrabold leading-none text-primary"
        >
          Torzo.
        </Link>

        <AnimatedMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />

        <Button asChild className="hidden h-[50px] px-6 font-heading md:inline-flex">
          <Link href="/manage">Manage</Link>
        </Button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[100] flex-col bg-background px-4 py-5 text-foreground md:hidden",
          isOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-[33px] font-extrabold leading-none text-primary"
          >
            T.
          </Link>
          <span className="size-[50px]" aria-hidden="true" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Button asChild className="h-[50px] px-8 font-heading">
            <Link href="/manage">Manage</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
