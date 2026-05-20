"use client";

import { ArrowRight, Film, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchFormProps = {
  id: string;
  defaultValue?: string;
  className?: string;
  variant?: "default" | "hero";
};

type TmdbSuggestion = {
  id: number;
  title: string;
  releaseYear: string | null;
  posterUrl: string | null;
  overview: string;
};

function SearchSubmitButton({ isSubmitting, variant = "default" }: { isSubmitting: boolean, variant?: "default" | "hero" }) {
  return (
    <button
      type="submit"
      aria-label={isSubmitting ? "Searching" : "Search"}
      aria-busy={isSubmitting}
      className={cn(
        buttonVariants({ variant: "torzoPill" }),
        "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center transition-[opacity,transform,background-color,box-shadow] duration-300 ease-[var(--ui-ease-enter)]",
        variant === "hero" ? "h-[55px] w-[55px]" : "h-12 w-12",
        "md:right-2 md:opacity-0 md:pointer-events-none md:scale-90",
        variant === "hero" ? "md:h-[59px] md:w-[59px] md:right-1.5" : "md:h-13 md:w-13 md:right-1.5",
        "md:group-focus-within:scale-100 md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto",
        "active:translate-y-[-50%] motion-reduce:transition-none md:motion-reduce:scale-100"
      )}
    >
      {isSubmitting ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <ArrowRight className="size-5" />
      )}
    </button>
  );
}

export function SearchForm({ id, defaultValue, className, variant = "default" }: SearchFormProps) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState(defaultValue ?? "");
  const [selectedMovie, setSelectedMovie] = useState<TmdbSuggestion | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<TmdbSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const hasUserTypedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasUserTypedRef.current) {
      return;
    }

    if (selectedMovie && query === selectedMovie.title) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    const abortController = new AbortController();
    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(trimmedQuery)}`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as {
          results?: TmdbSuggestion[];
        };

        setSuggestions(data.results ?? []);
        setIsSuggestionsOpen(true);
      } catch {
        if (!abortController.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      abortController.abort();
      clearTimeout(debounceTimer);
    };
  }, [query, selectedMovie]);

  const clearBlurTimer = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const handleSuggestionSelect = (movie: TmdbSuggestion) => {
    clearBlurTimer();
    setIsSubmitting(true);
    setSelectedMovie(movie);
    setQuery(movie.title);
    setIsSuggestionsOpen(false);
    setSuggestions([]);
    
    // Automatically navigate using only tmdbId
    router.push(`/results?tmdbId=${movie.id}`);
  };

  const showSuggestions =
    isSuggestionsOpen &&
    Boolean(query.trim()) &&
    !selectedMovie &&
    (isLoading || suggestions.length > 0);

  return (
    <form
      action="/results"
      autoComplete="off"
      onSubmit={() => setIsSubmitting(true)}
      className={cn(
        "group w-full max-w-3xl md:transition-[max-width] md:duration-300 md:ease-[var(--ui-ease-enter)] md:focus-within:max-w-[52rem]",
        className
      )}
    >
      <label className="sr-only" htmlFor={id}>
        Search torrents
      </label>
      <div className={cn("relative", variant === "hero" ? "h-[71px]" : "h-16")}>
        <span className={cn(
          "pointer-events-none absolute inset-y-0 left-5 z-10 flex items-center text-muted-foreground transition-colors group-focus-within:text-foreground-strong",
          variant === "hero" && "left-6"
        )}>
          <Search className="size-5" />
        </span>
        
        {/* Only include q if no selectedMovie, to avoid query overlap */}
        <Input
          id={id}
          name={!selectedMovie ? "q" : undefined}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showSuggestions}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={query}
          placeholder="Search movies, shows, games, software..."
          className={cn(
            "pl-12 pr-16 bg-[oklch(0.985_0.008_357.793)] placeholder:text-[12px] md:placeholder:text-[14px] [--ui-shadow-input-hover:0_0_30px_oklch(0.644_0.245_16.285_/_12%)] [--ui-shadow-input-focus:0_0_0_4px_oklch(0.644_0.245_16.285_/_8%),0_0_40px_oklch(0.644_0.245_16.285_/_15%)] hover:shadow-ui-input-hover focus-visible:shadow-ui-input-focus",
            variant === "hero" ? "h-[71px] rounded-full pl-14" : "h-16"
          )}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => {
              setIsSuggestionsOpen(false);
            }, 120);
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;

            hasUserTypedRef.current = true;
            setIsSubmitting(false);
            setQuery(nextQuery);
            setSelectedMovie(null);

            if (!nextQuery.trim()) {
              setSuggestions([]);
              setIsLoading(false);
              setIsSuggestionsOpen(false);
            }
          }}
          onFocus={() => {
            clearBlurTimer();
          }}
        />

        {selectedMovie ? (
          <input type="hidden" name="tmdbId" value={selectedMovie.id} />
        ) : null}

        {!selectedMovie && isLoading ? (
          <span className="pointer-events-none absolute inset-y-0 right-16 z-10 hidden items-center text-text-soft md:flex">
            <Loader2 className="size-4 animate-spin" />
          </span>
        ) : null}

        <SearchSubmitButton isSubmitting={isSubmitting} variant={variant} />

        {showSuggestions ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface py-1 shadow-ui-popover md:max-h-72"
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching TMDB
              </div>
            ) : (
              suggestions.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSuggestionSelect(movie)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none"
                >
                  <span className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-subtle text-text-soft">
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl}
                        alt=""
                        width={40}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Film className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="min-w-0 truncate text-sm font-medium text-foreground">
                        {movie.title}
                      </span>
                      {movie.releaseYear ? (
                        <span className="shrink-0 text-xs text-text-soft">
                          {movie.releaseYear}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}
