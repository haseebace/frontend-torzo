"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Zap } from "lucide-react";
import { useTorboxCachedHashes } from "@/components/torrent/torbox-cache-status-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVisitedTorrents } from "@/lib/hooks/use-visited-torrents";

export interface TorrentResult {
  id: string;
  title: string;
  info_hash?: string | null;
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
  const cachedHashes = useTorboxCachedHashes();
  const normalizedHash = result.info_hash?.trim().toLowerCase();
  const isCachedOnTorbox = normalizedHash
    ? cachedHashes.has(normalizedHash)
    : false;

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
        "group block rounded-[22px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
        className,
      )}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="rounded-[22px] border-0 bg-card px-0 py-0 shadow-none ring-0 group-hover:shadow-[0_6px_16px_#e1e1e399]">
        <CardContent className="flex min-h-[114px] flex-col justify-between gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-8 md:p-6">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 md:max-w-[624px] md:gap-4">
            <div className="flex min-w-0 flex-col items-start gap-2">
              {(showVisited || isCachedOnTorbox) && (
                <div className="flex flex-wrap items-center gap-2">
                  {showVisited && (
                    <Badge variant="default">
                      <Eye aria-hidden="true" />
                      Visited
                    </Badge>
                  )}
                  {isCachedOnTorbox && (
                    <Badge variant="success">
                      <Zap aria-hidden="true" />
                      Cached on TorBox
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex w-full items-center gap-3">
                <h2 className="min-w-0 flex-1 truncate font-sans text-sm font-extrabold leading-7 text-foreground md:text-lg md:leading-9">
                  {result.title}
                </h2>
              </div>
            </div>
            <div className="hidden flex-wrap items-center gap-2.5 md:flex md:gap-4">
              <Badge variant="secondary">{result.category}</Badge>
              <Badge variant="secondary">{provider}</Badge>
            </div>
          </div>

          <div className="grid w-full shrink-0 grid-cols-3 gap-2.5 md:flex md:min-w-32 md:w-auto md:flex-col md:gap-4">
            <Badge variant="success" className="w-full justify-center">
              {result.seeders.toLocaleString()} Seeders
            </Badge>
            <Badge variant="destructive" className="w-full justify-center">
              {result.leechers.toLocaleString()} Leechers
            </Badge>
            <Badge variant="secondary" className="w-full justify-center">
              {result.size_human}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
