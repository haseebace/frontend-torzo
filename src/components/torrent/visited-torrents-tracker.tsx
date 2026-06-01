"use client";

import { useEffect } from "react";
import { useVisitedTorrents } from "@/lib/hooks/use-visited-torrents";

type VisitedTorrentsTrackerProps = {
  id: string;
};

/**
 * Client component that marks a torrent as visited in localStorage
 * when the detail page mounts. Renders nothing.
 */
export function VisitedTorrentsTracker({ id }: VisitedTorrentsTrackerProps) {
  const { markVisited } = useVisitedTorrents();

  useEffect(() => {
    if (!id) return;
    markVisited(id);
  }, [id, markVisited]);

  return null;
}
