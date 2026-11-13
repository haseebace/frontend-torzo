"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { magneticSpring, useMagneticHover } from "@/animations";
import { TorboxCacheStatusProvider } from "@/components/torrent/torbox-cache-status-provider";
import {
  TorrentResultCard,
  type TorrentResult,
} from "@/components/torrent-result-card";

type TorrentResultsListProps = {
  results: TorrentResult[];
};

type OverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function TorrentResultsList({ results }: TorrentResultsListProps) {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [overlayRect, setOverlayRect] = useState<OverlayRect | null>(null);

  const { containerProps, setHoveredIndex, hoveredIndex } = useMagneticHover({
    layoutId: "torrent-results-hover",
  });

  const measureOverlay = useCallback((index: number) => {
    const container = listRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) {
      return;
    }

    const containerBox = container.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();

    setOverlayRect({
      top: itemBox.top - containerBox.top + container.scrollTop,
      left: itemBox.left - containerBox.left + container.scrollLeft,
      width: itemBox.width,
      height: itemBox.height,
    });
  }, []);

  useLayoutEffect(() => {
    if (hoveredIndex === null) {
      setOverlayRect(null);
      return;
    }

    measureOverlay(hoveredIndex);

    const handleReposition = () => {
      if (hoveredIndex !== null) {
        measureOverlay(hoveredIndex);
      }
    };

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [hoveredIndex, measureOverlay, results]);

  return (
    <TorboxCacheStatusProvider
      hashes={results.map((result) => result.info_hash)}
    >
      <div
        ref={listRef}
        {...containerProps}
        className="relative flex flex-col gap-4"
      >
        {hoveredIndex !== null && overlayRect && !reduceMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-0 rounded-3xl bg-light-100"
            initial={false}
            animate={{
              top: overlayRect.top,
              left: overlayRect.left,
              width: overlayRect.width,
              height: overlayRect.height,
            }}
            transition={magneticSpring}
          />
        ) : null}

        {results.map((result, index) => {
          const isActive = hoveredIndex === index;

          return (
            <div
              key={result.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="relative z-10"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <TorrentResultCard
                result={result}
                magneticOverlay
                isMagneticActive={isActive}
                onMagneticFocus={() => setHoveredIndex(index)}
              />
            </div>
          );
        })}
      </div>
    </TorboxCacheStatusProvider>
  );
}
