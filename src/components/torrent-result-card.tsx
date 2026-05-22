"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CircleArrowDown,
  CircleArrowUp,
  Film,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TorrentResult {
  id: string;
  title: string;
  category: string;
  uploaded_at: string | null;
  size_bytes: number;
  size_human: string;
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
  children: ReactNode;
  tone?: "default" | "seeders" | "leechers";
  className?: string;
};

function TorrentBadge({
  icon: Icon,
  children,
  tone = "default",
  className,
}: TorrentMetricProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[var(--torrent-badge-height)] shrink-0 items-center justify-center gap-[var(--torrent-badge-gap)] rounded-[var(--torrent-badge-radius)] px-[var(--torrent-badge-padding-x)] text-[length:var(--torrent-badge-font-size)] font-[var(--torrent-badge-font-weight)] leading-[var(--torrent-badge-line-height)] text-[var(--torrent-badge-text-color)]",
        tone === "seeders"
          ? "bg-[var(--torrent-seeder-badge-background-color)]"
          : tone === "leechers"
            ? "bg-[var(--torrent-leecher-badge-background-color)]"
            : "bg-[var(--torrent-badge-background-color)]",
        className,
      )}
    >
      <span className="truncate">{children}</span>
      <Icon className="size-4 stroke-[1.5]" aria-hidden="true" />
    </span>
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
        "group block rounded-[var(--torrent-card-radius)] transition-transform duration-200 ease-[var(--ui-ease-standard)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
        className,
      )}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="rounded-[var(--torrent-card-radius)] border-0 bg-[var(--torrent-card-background-color)] px-0 py-0 shadow-none ring-0 transition-[box-shadow,transform] duration-300 ease-[var(--ui-ease-standard)] group-hover:shadow-ui-result-hover">
        <CardContent className="flex min-h-[var(--torrent-card-min-height)] flex-col justify-between gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-[var(--torrent-card-column-gap)] md:p-[var(--torrent-card-padding)]">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 md:max-w-[var(--torrent-card-left-column-max-width)] md:gap-[var(--torrent-card-content-gap)]">
            <div className="flex min-w-0 items-center">
              <h2 className="min-w-0 flex-1 truncate font-sans text-[length:var(--torrent-card-title-mobile-font-size)] font-[var(--torrent-card-title-font-weight)] leading-[var(--torrent-card-title-mobile-line-height)] text-[var(--torrent-card-text-color)] md:[font-size:var(--torrent-card-title-font-size)] md:leading-[var(--torrent-card-title-line-height)]">
                {result.title}
              </h2>
            </div>
            <div className="hidden flex-wrap items-center gap-2.5 md:flex md:gap-[var(--torrent-card-content-gap)]">
              <TorrentBadge icon={Film}>
                {result.category}
              </TorrentBadge>
              <TorrentBadge icon={Globe}>
                {provider}
              </TorrentBadge>
            </div>
          </div>

          <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 md:flex md:w-auto md:min-w-[var(--torrent-card-status-column-width)] md:flex-col md:gap-[var(--torrent-card-content-gap)]">
            <TorrentBadge
              icon={CircleArrowUp}
              tone="seeders"
              className="w-full justify-between md:w-[var(--torrent-card-status-column-width)]"
            >
              {result.seeders.toLocaleString()} Seeders
            </TorrentBadge>
            <TorrentBadge
              icon={CircleArrowDown}
              tone="leechers"
              className="w-full justify-between md:w-[var(--torrent-card-status-column-width)]"
            >
              {result.leechers.toLocaleString()} Leechers
            </TorrentBadge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
