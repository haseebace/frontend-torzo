"use client";

import {
  MagneticHoverItem,
  MagneticHoverList,
  useMagneticHoverListState,
} from "@/animations/magnetic-hover-list";
import { TorboxCacheStatusProvider } from "@/components/torrent/torbox-cache-status-provider";
import {
  TorrentResultCard,
  type TorrentResult,
} from "@/components/torrent-result-card";

type TorrentResultsListProps = {
  results: TorrentResult[];
  tmdbId?: string;
  imdbId?: string;
  mediaType?: "movie" | "tv";
};

function TorrentResultRow({
  result,
  index,
  tmdbId,
  imdbId,
  mediaType,
}: {
  result: TorrentResult;
  index: number;
  tmdbId?: string;
  imdbId?: string;
  mediaType?: "movie" | "tv";
}) {
  const { hoverIndex } = useMagneticHoverListState();

  return (
    <MagneticHoverItem
      index={index}
      className="rounded-3xl"
      surfaceClassName="rounded-3xl bg-bg-surface"
      activeSurfaceClassName="rounded-3xl bg-light-100"
    >
      <TorrentResultCard
        result={result}
        magneticOverlay
        onMagneticFocus={() => hoverIndex(index)}
        tmdbId={tmdbId}
        imdbId={imdbId}
        mediaType={mediaType}
      />
    </MagneticHoverItem>
  );
}

export function TorrentResultsList({
  results,
  tmdbId,
  imdbId,
  mediaType,
}: TorrentResultsListProps) {
  return (
    <TorboxCacheStatusProvider
      hashes={results.map((result) => result.info_hash)}
    >
      <MagneticHoverList className="flex flex-col gap-4">
        {results.map((result, index) => (
          <TorrentResultRow
            key={result.id}
            result={result}
            index={index}
            tmdbId={tmdbId}
            imdbId={imdbId}
            mediaType={mediaType}
          />
        ))}
      </MagneticHoverList>
    </TorboxCacheStatusProvider>
  );
}