import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-10 xl:px-[150px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white via-white/85 to-white/0" />
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800 transition-colors hover:text-zinc-950"
        >
          <span className="flex size-11 items-center justify-center">
            <Image
              src="/icon.svg"
              alt=""
              width={32}
              height={32}
              className="size-full"
            />
          </span>
        </Link>
        <Button asChild>
          <Link href="/manage">Manage</Link>
        </Button>
      </nav>
    </header>
  );
}
