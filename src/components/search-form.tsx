"use client";

import { ArrowRight, Film, Loader2 } from "lucide-react";
import Form from "next/form";
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
        "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center",
        variant === "hero" ? "h-[55px] w-[55px]" : "h-12 w-12",
        variant === "hero" ? "md:h-[59px] md:w-[59px] md:right-1.5" : "md:h-13 md:w-13 md:right-1.5",
        "active:scale-100 active:not-aria-[haspopup]:translate-y-[-50%]"
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasUserTypedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

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
        setActiveIndex(-1);
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

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const option = listboxRef.current.querySelectorAll('[role="option"]')[activeIndex] as HTMLElement;
      if (option) {
        option.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

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
    setActiveIndex(-1);
    
    // Automatically navigate using only tmdbId
    router.push(`/results?tmdbId=${movie.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          event.preventDefault();
          handleSuggestionSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsSuggestionsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const showSuggestions =
    isSuggestionsOpen &&
    Boolean(query.trim()) &&
    !selectedMovie &&
    (isLoading || suggestions.length > 0);

  return (
    <Form
      action="/results"
      autoComplete="off"
      onSubmit={() => setIsSubmitting(true)}
      className={cn(
        "group w-full max-w-3xl",
        className
      )}
    >
      <label className="sr-only" htmlFor={id}>
        Search media
      </label>
      <div className={cn("relative", variant === "hero" ? "h-[71px]" : "h-16")}>
        <Input
          id={id}
          name={!selectedMovie ? "q" : undefined}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showSuggestions}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={query}
          placeholder="Search movies, shows, games, software..."
          className={cn(
            "bg-card pr-16 placeholder:text-[12px] placeholder:text-text-subtle md:placeholder:text-[14px] hover:shadow-sm",
            variant === "hero" ? "h-[71px] rounded-full" : "h-16"
          )}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => {
              setIsSuggestionsOpen(false);
              setActiveIndex(-1);
            }, 120);
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;

            hasUserTypedRef.current = true;
            setIsSubmitting(false);
            setQuery(nextQuery);
            setSelectedMovie(null);
            setActiveIndex(-1);

            if (!nextQuery.trim()) {
              setSuggestions([]);
              setIsLoading(false);
              setIsSuggestionsOpen(false);
            }
          }}
          onFocus={() => {
            clearBlurTimer();
          }}
          onKeyDown={handleKeyDown}
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
            ref={listboxRef}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface py-1 shadow-sm md:max-h-72"
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching TMDB
              </div>
            ) : (
              suggestions.map((movie, index) => (
                <button
                  key={movie.id}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSuggestionSelect(movie)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left transition-[background-color,transform] duration-200 ease-out focus-visible:outline-none active:scale-[0.96] motion-reduce:active:scale-100",
                    index === activeIndex
                      ? "bg-surface-subtle"
                      : "hover:bg-surface-subtle"
                  )}
                >
                  {movie.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt=""
                      width={32}
                      height={45}
                      className="h-[45px] w-8 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-[45px] w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-text-soft">
                      <Film className="size-4" />
                    </span>
                  )}
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
    </Form>
  );
}
