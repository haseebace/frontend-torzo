import Image from "next/image";
import Link from "next/link";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-10 xl:px-[150px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white via-white/85 to-white/0" />
      <nav className="relative flex w-full items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800 transition-colors hover:text-zinc-950"
        >
          <span className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2">
            <Image
              src="/icon.svg"
              alt=""
              width={24}
              height={24}
              className="size-full"
            />
          </span>
          Torzo
        </Link>
      </nav>
    </header>
  );
}
