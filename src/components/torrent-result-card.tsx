"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { TorrentSizeBadge } from "@/components/torrent/torrent-size-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVisitedTorrents } from "@/lib/hooks/use-visited-torrents";

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

export function TorrentResultCard({
  result,
  className,
}: TorrentResultCardProps) {
  const router = useRouter();
  const { isVisited } = useVisitedTorrents();
  const showVisited = isVisited(result.id);

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
        "group block rounded-[22px] transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
        className,
      )}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="rounded-[22px] border-0 bg-card px-0 py-0 shadow-none ring-0 transition-[box-shadow,transform] duration-300 ease-out group-hover:shadow-sm">
        <CardContent className="flex min-h-[114px] flex-col justify-between gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-8 md:p-6">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 md:max-w-[624px] md:gap-4">
            <div className="flex min-w-0 flex-col items-start gap-2">
              {showVisited && (
                <Badge>
                  <Eye aria-hidden="true" />
                  Visited
                </Badge>
              )}
              <div className="flex w-full items-center gap-3">
                <h2 className="min-w-0 flex-1 truncate font-sans text-sm font-extrabold leading-7 text-foreground md:text-lg md:leading-9">
                  {result.title}
                </h2>
                <Badge className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-foreground-strong md:hidden">
                  {result.size_human}
                </Badge>
              </div>
            </div>
            <div className="hidden flex-wrap items-center gap-2.5 md:flex md:gap-4">
              <Badge>{result.category}</Badge>
              <Badge>{provider}</Badge>
            </div>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2.5 md:w-auto md:gap-4">
            <TorrentSizeBadge
              sizeHuman={result.size_human}
              sizeBytes={result.size_bytes}
              className="hidden md:flex"
            />
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 md:flex md:min-w-32 md:flex-col md:gap-4">
              <Badge className="w-full md:w-32">
                {result.seeders.toLocaleString()} Seeders
              </Badge>
              <Badge className="w-full md:w-32">
                {result.leechers.toLocaleString()} Leechers
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
