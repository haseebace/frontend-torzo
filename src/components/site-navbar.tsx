import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-10 xl:px-page">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background via-background/85 to-background/0" />
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-sm font-semibold text-foreground-strong transition-colors hover:text-foreground"
        >
          <span className="flex size-11 items-center justify-center">
            <Image
               src="/icon.svg"
               alt=""
               width={32}
               height={32}
               loading="eager"
               className="size-full"
             />
          </span>
        </Link>
        <Button asChild className="h-[45px] w-[100px] rounded-pill font-black">
          <Link href="/manage">Manage</Link>
        </Button>
      </nav>
    </header>
  );
}
