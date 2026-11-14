"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTorboxCachedHashes } from "@/components/torrent/torbox-cache-status-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatRawSize } from "@/lib/utils";
import { useVisitedTorrents } from "@/lib/hooks/use-visited-torrents";

export interface TorrentResult {
  id: string;
  title: string;
  info_hash?: string | null;
  category: string | null;
  uploaded_at: string | null;
  size_bytes?: string | number | null;
  seeders: string | number | null;
  leechers: string | number | null;
  sources: {
    provider: string;
    source_url: string;
  }[];
}

type TorrentResultCardProps = {
  result: TorrentResult;
  className?: string;
  variant?: "default" | "stacked";
  /** List renders hover via an absolutely positioned pill between separate cards. */
  magneticOverlay?: boolean;
  isMagneticActive?: boolean;
  onMagneticEnter?: () => void;
  onMagneticFocus?: () => void;
  tmdbId?: string;
  imdbId?: string;
  mediaType?: "movie" | "tv";
};

const metaBadgeClassName =
  "border-0 bg-bg-secondary-badge px-4 py-2 text-xs font-bold normal-case text-primary-text";
const visitedBadgeClassName =
  "border-0 bg-bg-primary-badge px-4 py-2 text-xs font-bold normal-case text-on-primary";
const seederBadgeClassName =
  "border-0 bg-bg-seeder px-4 py-2 text-xs font-bold normal-case text-seeder-text";
const leecherBadgeClassName =
  "border-0 bg-bg-leecher px-4 py-2 text-xs font-bold normal-case text-leecher-text";
const badgeCellClassName = "w-full min-w-0 justify-center";
const metaBadgeGridClassName =
  "hidden w-fit max-w-full gap-2 md:grid md:grid-cols-[5.25rem_8rem_5.5rem_4.75rem_4.75rem]";
const mobileStatsGridClassName =
  "grid w-full grid-cols-3 gap-2 md:hidden";

function formatProviderLabel(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "rargb" || normalized === "rarbg") return "RARBG";
  if (normalized === "yts") return "YTS";
  if (normalized === "thepiratebay" || normalized === "the-pirate-bay") {
    return "The Pirate Bay";
  }
  if (normalized === "torrentgalaxy" || normalized === "torrent-galaxy") {
    return "TorrentGalaxy";
  }

  return normalized
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCount(value: string | number | null) {
  return Number(value ?? 0).toLocaleString("en-US");
}

export function TorrentResultCard({
  result,
  className,
  variant = "default",
  magneticOverlay = false,
  isMagneticActive = false,
  onMagneticEnter,
  onMagneticFocus,
  tmdbId,
  imdbId,
  mediaType,
}: TorrentResultCardProps) {
  const isStacked = variant === "stacked";
  const reduceMotion = useReducedMotion();
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

  const detailParams = new URLSearchParams({
    source: provider,
    source_url: sourceUrl,
  });
  if (tmdbId) detailParams.set("tmdbId", tmdbId);
  if (imdbId) detailParams.set("imdbId", imdbId);
  if (mediaType) detailParams.set("mediaType", mediaType);
  const detailHref = `/detail?${detailParams.toString()}`;

  const handleMouseEnter = useCallback(() => {
    router.prefetch(detailHref);
  }, [router, detailHref]);

  const categoryLabel =
    result.category?.trim().toLowerCase() === "tv"
      ? "TV Series"
      : result.category?.trim();
  const providerLabel = formatProviderLabel(provider);

  const usesLayeredMagnetic = magneticOverlay && !isStacked;

  return (
    <div
      className={cn("relative", !isStacked && !usesLayeredMagnetic && "rounded-3xl")}
      onMouseEnter={onMagneticEnter}
      onFocus={onMagneticFocus}
    >
      <Link
        href={detailHref}
        className={cn(
          "relative block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-text/15",
          isStacked ? "rounded-none" : "rounded-3xl",
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onFocus={() => onMagneticFocus?.()}
      >
        <Card
          className={cn(
            "border-0 px-0 py-0 shadow-none ring-0",
            isStacked
              ? cn(
                  "rounded-none",
                  isMagneticActive && reduceMotion
                    ? "bg-light-100"
                    : "bg-transparent",
                )
              : cn(
                  "rounded-3xl",
                  usesLayeredMagnetic
                    ? "bg-transparent"
                    : "transition-colors duration-200 ease-out",
                  !usesLayeredMagnetic &&
                    (isMagneticActive ? "bg-light-100" : "bg-bg-surface"),
                ),
          )}
        >
        <CardContent className="flex flex-col gap-3 p-4 md:p-5">
          {(showVisited || isCachedOnTorbox) && (
            <div className="flex flex-wrap items-center gap-2">
              {showVisited && (
                <Badge className={visitedBadgeClassName}>Visited</Badge>
              )}
              {isCachedOnTorbox && (
                <Badge className={seederBadgeClassName}>
                  <Zap aria-hidden="true" />
                  Cached on TorBox
                </Badge>
              )}
            </div>
          )}
          <h2 className="min-w-0 truncate text-sm font-extrabold text-primary-text md:text-lg">
            {result.title}
          </h2>
          <div
            className={mobileStatsGridClassName}
            aria-label="Size, seeders, and leechers"
          >
            <Badge className={cn(metaBadgeClassName, badgeCellClassName)}>
              {formatRawSize(result.size_bytes)}
            </Badge>
            <Badge className={cn(seederBadgeClassName, badgeCellClassName)}>
              {formatCount(result.seeders)}
            </Badge>
            <Badge className={cn(leecherBadgeClassName, badgeCellClassName)}>
              {formatCount(result.leechers)}
            </Badge>
          </div>
          <div className={metaBadgeGridClassName}>
            {categoryLabel ? (
              <Badge className={cn(metaBadgeClassName, badgeCellClassName)}>
                {categoryLabel}
              </Badge>
            ) : (
              <span aria-hidden="true" className="min-w-0" />
            )}
            <Badge
              className={cn(metaBadgeClassName, badgeCellClassName, "truncate")}
              title={providerLabel}
            >
              {providerLabel}
            </Badge>
            <Badge className={cn(metaBadgeClassName, badgeCellClassName)}>
              {formatRawSize(result.size_bytes)}
            </Badge>
            <Badge className={cn(seederBadgeClassName, badgeCellClassName)}>
              {formatCount(result.seeders)}
            </Badge>
            <Badge className={cn(leecherBadgeClassName, badgeCellClassName)}>
              {formatCount(result.leechers)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
    </div>
  );
}
