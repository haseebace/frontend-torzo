"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type MediaItem = {
  id: number;
  title: string;
  posterUrl: string | null;
};

type TrendingSliderProps = {
  endpoint: string;
  title: string;
  ariaLabel: string;
};

function TrendingSlider({ endpoint, title, ariaLabel }: TrendingSliderProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTrending() {
      try {
        const res = await fetch(endpoint, {
          signal: abortController.signal,
        });
        if (res.ok) {
          const data = (await res.json()) as { results?: MediaItem[] };
          setItems(data.results ?? []);
        }
      } catch {
        // silent fail
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchTrending();
    return () => abortController.abort();
  }, [endpoint]);

  if (!isLoading && items.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className="mx-auto w-full px-4 md:px-12 pb-16">
      <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground-strong md:text-[28px] mb-5">
        {title}
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[225px] w-[150px] shrink-0 snap-start rounded-2xl"
                />
              ))
            : items.map((item) => (
                <Link
                  key={item.id}
                  href={`/results?tmdbId=${item.id}`}
                  prefetch={false}
                  className={cn(
                    "group relative h-[225px] w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl",
                    "transition-[transform,box-shadow] duration-300 ease-out",
                    "hover:scale-[0.97] hover:shadow-sm",
                    "active:scale-[0.95] motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                >
                  {item.posterUrl ? (
                    <Image
                      src={item.posterUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="150px"
                      quality={75}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground text-xs">
                      {item.title}
                    </div>
                  )}
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingTvSlider() {
  return (
    <TrendingSlider
      endpoint="/api/tmdb/trending-tv"
      title="Trending TV"
      ariaLabel="Trending TV Series"
    />
  );
}

export function TrendingMoviesSlider() {
  return (
    <TrendingSlider
      endpoint="/api/tmdb/trending-movies"
      title="Trending Movies"
      ariaLabel="Trending Movies"
    />
  );
}
