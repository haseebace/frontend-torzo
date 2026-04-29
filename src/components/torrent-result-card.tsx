import Link from "next/link";
import { Calendar, ArrowDown, ArrowUp, HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface TorrentResult {
  title: string;
  type: string;
  uploadedDate: string;
  size: string;
  seeders: string;
  leechers: string;
}

export function TorrentResultCard({ result }: { result: TorrentResult }) {
  return (
    <Link
      href="/detail"
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400/20"
    >
      <Card className="grid gap-3 rounded-xl border border-transparent bg-[var(--result-card-background)] py-4 text-sm transition-all group-hover:border-zinc-200 group-hover:shadow-[0_4px_18px_rgba(24,24,27,0.04)] group-focus-visible:border-zinc-300 md:grid-cols-[1fr_auto]">
        <CardContent className="contents p-0">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 pl-[5px] md:mb-3 md:pl-0">
              <h2 className="min-w-0 flex-1 truncate text-[12px] font-medium leading-5 text-zinc-700 transition-colors group-hover:text-zinc-950 md:text-base md:leading-6">
                {result.title}
              </h2>
              <span className="shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium uppercase leading-4 tracking-[0.1em] text-zinc-600 md:hidden">
                {result.type}
              </span>
            </div>
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 md:flex">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                {result.type}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                Uploaded {result.uploadedDate}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 pl-[5px] pr-[5px] md:justify-end md:pl-0 md:pr-0">
            <div className="grid grid-cols-3 gap-3 text-left text-xs md:text-right">
              <div className="w-16">
                <p className="font-semibold text-zinc-800">
                  {result.size}
                </p>
                <p className="inline-flex items-center justify-start gap-1 text-zinc-400 md:justify-end">
                  <HardDrive className="hidden size-3 md:block" />
                  size
                </p>
              </div>
              <div className="w-16">
                <p className="font-semibold text-zinc-800">
                  {result.seeders}
                </p>
                <p className="inline-flex items-center justify-start gap-1 text-zinc-400 md:justify-end">
                  <ArrowUp className="hidden size-3 md:block" />
                  seed
                </p>
              </div>
              <div className="w-16">
                <p className="font-semibold text-zinc-800">
                  {result.leechers}
                </p>
                <p className="inline-flex items-center justify-start gap-1 text-zinc-400 md:justify-end">
                  <ArrowDown className="hidden size-3 md:block" />
                  leech
                </p>
              </div>
            </div>
            <span className="shrink-0 pb-0.5 text-right text-[10px] leading-4 text-zinc-500 md:hidden">
              {result.uploadedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
