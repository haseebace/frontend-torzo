"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  HardDrive,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatBytes, formatDate } from "@/lib/utils";

export interface TorrentResult {
  id: string;
  title: string;
  category: string;
  uploaded_at: string | null;
  size_bytes: number;
  seeders: number;
  leechers: number;
  sources: {
    provider: string;
    source_url: string;
  }[];
}

type TorrentResultCardProps = {
  result: TorrentResult;
  className?: string;
};

type TorrentMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function TorrentMetric({ icon: Icon, label, value }: TorrentMetricProps) {
  return (
    <div className="w-16">
      <p className="font-semibold text-zinc-800">{value}</p>
      <p className="inline-flex items-center justify-start gap-1 text-zinc-400 md:justify-end">
        <Icon className="hidden size-3 md:block" />
        {label}
      </p>
    </div>
  );
}

export function TorrentResultCard({
  result,
  className,
}: TorrentResultCardProps) {
  const router = useRouter();

  const primarySource = result.sources[0];
  const provider = primarySource?.provider || "unknown";
  const sourceUrl = primarySource?.source_url || "";

  const detailHref = `/detail?source=${provider}&source_url=${encodeURIComponent(sourceUrl)}`;

  const handleMouseEnter = useCallback(() => {
    router.prefetch(detailHref);
  }, [router, detailHref]);

  return (
    <Link
      href={detailHref}
      className={cn(
        "group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400/20",
        className,
      )}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="grid gap-3 rounded-xl bg-[var(--result-card-background)] pb-4 pt-1 text-sm ring-0 transition-all group-hover:ring-[1px] group-hover:ring-zinc-200 group-hover:shadow-[0_4px_18px_rgba(24,24,27,0.04)] group-focus-visible:border-zinc-300 md:grid-cols-[1fr_auto] md:px-5 md:py-4">
        <CardContent className="contents p-0">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 pl-[5px] md:hidden">
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                {result.category}
              </span>
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                {provider}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2 pl-[5px] md:mb-3 md:pl-0">
              <h2 className="min-w-0 flex-1 truncate text-[12px] font-medium leading-5 text-zinc-700 transition-colors group-hover:text-zinc-950 md:text-base md:leading-6">
                {result.title}
              </h2>
            </div>
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 md:flex">
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                {result.category}
              </span>
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                {provider}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                Uploaded {formatDate(result.uploaded_at)}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 pl-[5px] pr-[5px] md:justify-end md:pl-0 md:pr-0">
            <div className="grid grid-cols-3 gap-3 text-left text-xs md:text-right">
              <TorrentMetric
                icon={HardDrive}
                label="size"
                value={formatBytes(result.size_bytes)}
              />
              <TorrentMetric
                icon={ArrowUp}
                label="seed"
                value={result.seeders.toLocaleString()}
              />
              <TorrentMetric
                icon={ArrowDown}
                label="leech"
                value={result.leechers.toLocaleString()}
              />
            </div>
            <span className="shrink-0 pb-0.5 text-right text-[10px] leading-4 text-zinc-500 md:hidden">
              {formatDate(result.uploaded_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
