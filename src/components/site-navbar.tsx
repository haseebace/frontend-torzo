import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 px-page py-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background via-background/85 to-background/0" />
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="font-heading text-[33px] font-extrabold leading-none text-primary"
        >
          Torzo.
        </Link>
        <Button asChild className="h-[50px] px-6 font-heading">
          <Link href="/manage">Manage</Link>
        </Button>
      </nav>
    </header>
  );
}
