"use client";

import { ArrowRight, Film, Loader2 } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SearchBar,
  searchInteractionSpring,
} from "@/components/ui/search-bar";
import { useMagneticHover } from "@/animations";
import { cn } from "@/lib/utils";
import {
  getCachedTmdbDiscovery,
  prefetchTmdbDiscovery,
} from "@/lib/tmdb-suggestion-cache";

type SearchFormProps = {
  id: string;
  defaultValue?: string;
  className?: string;
  variant?: "default" | "hero";
};

type TmdbSuggestion = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  releaseYear: string | null;
  posterUrl: string | null;
  overview: string;
};

function hasMeaningfulSuggestionOverlap(
  previous: TmdbSuggestion[],
  next: TmdbSuggestion[],
) {
  if (previous.length === 0 || next.length === 0) return false;

  const previousIds = new Set(
    previous.map((suggestion) => `${suggestion.mediaType}:${suggestion.id}`),
  );
  const sharedCount = next.filter((suggestion) =>
    previousIds.has(`${suggestion.mediaType}:${suggestion.id}`),
  ).length;

  return sharedCount > 0;
}

const dropdownEase = [0.22, 1, 0.36, 1] as const;

const suggestionSpring = searchInteractionSpring;

const suggestionEntranceSpring = {
  type: "spring" as const,
  stiffness: 210,
  damping: 19,
  mass: 0.9,
};

const suggestionUpdateSpring = {
  type: "spring" as const,
  stiffness: 230,
  damping: 26,
  mass: 0.9,
};

const dropdownVariants = {
  hidden: {
    scale: 0.97,
    scaleY: 0.92,
  },
  visible: {
    scale: 1,
    scaleY: 1,
    transition: {
      ...suggestionSpring,
      when: "beforeChildren",
      delayChildren: 0,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    scaleY: 0.98,
    transition: searchInteractionSpring,
  },
};

const suggestionRowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    filter: "blur(8px)",
  },
  visible: (index = 0) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ...suggestionEntranceSpring,
      delay: index * 0.09,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: searchInteractionSpring,
  },
};

const suggestionUpdateVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: suggestionUpdateSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(0px)",
    transition: searchInteractionSpring,
  },
};

function SearchSubmitButton({
  isSubmitting,
  isVisible,
  reduceMotion,
  variant = "default",
}: {
  isSubmitting: boolean;
  isVisible: boolean;
  reduceMotion: boolean | null;
  variant?: "default" | "hero";
}) {
  const button = (
    <button
      type="submit"
      aria-label={isSubmitting ? "Searching" : "Search"}
      aria-busy={isSubmitting}
      className={cn(
        buttonVariants({ variant: "torzoPill" }),
        "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center",
        "h-12 w-12",
        variant === "hero"
          ? "md:right-1.5 md:h-12 md:w-12"
          : "md:right-1.5 md:h-13 md:w-13",
      )}
    >
      {isSubmitting ? (
        <Loader2 className="size-5" />
      ) : (
        <ArrowRight className="size-5" />
      )}
    </button>
  );

  if (variant !== "hero") return button;

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.button
          key="hero-search-submit"
          type="submit"
          aria-label={isSubmitting ? "Searching" : "Search"}
          aria-busy={isSubmitting}
          initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
          style={{ transformOrigin: "center center" }}
           transition={reduceMotion ? { duration: 0 } : searchInteractionSpring}
          className={cn(
            buttonVariants({ variant: "torzoPill" }),
            "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center",
            "h-12 w-12 bg-bg-black-button text-text-black-button hover:bg-bg-black-button md:right-1.5 md:h-12 md:w-12",
          )}
        >
          {isSubmitting ? (
            <Loader2 className="size-5" />
          ) : (
            <ArrowRight className="size-5" />
          )}
        </motion.button>
      ) : null}
    </AnimatePresence>
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
  const [shouldAnimateLayout, setShouldAnimateLayout] = useState(false);
  const [isSuggestionModalEntering, setIsSuggestionModalEntering] =
    useState(false);
  const [isHeroFocused, setIsHeroFocused] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasUserTypedRef = useRef(false);
  const suggestionsRef = useRef<TmdbSuggestion[]>([]);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isHero = variant === "hero";
  const isHeroActive = isHero && (isHeroFocused || isSubmitting);
  const {
    containerProps: suggestionContainerProps,
    hoveredIndex: hoveredSuggestionIndex,
    setHoveredIndex: setHoveredSuggestion,
  } = useMagneticHover({
    layoutId: `${listboxId}-suggestion-hover`,
  });
  const handleSuggestionMouseLeave = () => {
    suggestionContainerProps.onMouseLeave();
    setActiveIndex(-1);
  };
  const applySuggestions = useCallback((nextSuggestions: TmdbSuggestion[]) => {
    setShouldAnimateLayout(
      hasMeaningfulSuggestionOverlap(suggestionsRef.current, nextSuggestions),
    );
    suggestionsRef.current = nextSuggestions;
    setSuggestions(nextSuggestions);
    setIsSuggestionsOpen(true);
    setActiveIndex(-1);
  }, []);
  const animatedDropdownVariants = reduceMotion
    ? {
        hidden: { scale: 0.98, scaleY: 0.98 },
        visible: { scale: 1, scaleY: 1, transition: { duration: 0.01 } },
        exit: { scale: 1, scaleY: 1, transition: { duration: 0.01 } },
      }
    : dropdownVariants;
  const animatedSuggestionRowVariants = reduceMotion
    ? {
        hidden: { opacity: 1, scale: 1, filter: "blur(0px)" },
        visible: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.01 },
        },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : suggestionRowVariants;
  const animatedSuggestionUpdateVariants = reduceMotion
    ? {
        hidden: { opacity: 1, scale: 1 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : suggestionUpdateVariants;

  useEffect(() => {
    if (!hasUserTypedRef.current && !isHeroFocused) {
      return;
    }

    if (selectedMovie && query === selectedMovie.title) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery && !isHeroFocused) {
      suggestionsRef.current = [];
      setSuggestions([]);
      setShouldAnimateLayout(false);
      return;
    }

    let cancelled = false;

    if (!trimmedQuery) {
      const cachedDiscovery = getCachedTmdbDiscovery();

      if (cachedDiscovery) {
        applySuggestions(cachedDiscovery);
        setIsLoading(false);
        return () => {
          cancelled = true;
        };
      }

      setIsLoading(true);
      void prefetchTmdbDiscovery()
        .then((nextSuggestions) => {
          if (cancelled) return;
          applySuggestions(nextSuggestions);
        })
        .catch(() => {
          if (!cancelled) {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(trimmedQuery)}`,
        );

        if (cancelled) return;

        if (!response.ok) {
          suggestionsRef.current = [];
          setSuggestions([]);
          setShouldAnimateLayout(false);
          return;
        }

        const data = (await response.json()) as {
          results?: TmdbSuggestion[];
        };

        if (cancelled) return;

        applySuggestions(data.results ?? []);
      } catch {
        if (!cancelled) {
          suggestionsRef.current = [];
          setSuggestions([]);
          setShouldAnimateLayout(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [applySuggestions, isHeroFocused, query, selectedMovie]);

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
    suggestionsRef.current = [];
    setSuggestions([]);
    setIsLoading(false);
    setShouldAnimateLayout(false);
    setIsSuggestionModalEntering(false);
    setActiveIndex(-1);
    setHoveredSuggestion(null);
    
    // Automatically navigate using only tmdbId
    router.push(`/results?tmdbId=${movie.id}&mediaType=${movie.mediaType}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        {
          const nextIndex = activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0;
          setActiveIndex(nextIndex);
          if (isHero) setHoveredSuggestion(nextIndex);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        {
          const nextIndex = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
          setActiveIndex(nextIndex);
          if (isHero) setHoveredSuggestion(nextIndex);
        }
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
        setHoveredSuggestion(null);
        break;
    }
  };

  const showSuggestions =
    isSuggestionsOpen &&
    (Boolean(query.trim()) || isHeroFocused) &&
    !selectedMovie &&
    (isLoading || suggestions.length > 0);

  const renderSuggestionRows = (
    enableLayout: boolean,
    animateEntrance: boolean,
  ) =>
    suggestions.map((movie, index) => {
      const isHighlighted = index === activeIndex;

      return (
        <motion.div
          key={`${movie.mediaType}:${movie.id}`}
          layout={enableLayout && !reduceMotion ? "position" : false}
          transition={
            enableLayout
              ? { ...suggestionSpring, layout: searchInteractionSpring }
              : { duration: 0.16, ease: dropdownEase }
          }
          className="relative isolate flex min-h-[58px] items-center gap-3 rounded-[10px] bg-bg-canvas px-3 py-2"
          custom={index}
          initial={animateEntrance ? "hidden" : false}
          animate="visible"
          variants={
            animateEntrance
              ? animatedSuggestionRowVariants
              : animatedSuggestionUpdateVariants
          }
          onMouseEnter={() => {
            setActiveIndex(index);
            if (isHero) setHoveredSuggestion(index);
          }}
        >
          {isHero && (hoveredSuggestionIndex === index || isHighlighted) ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
              }
              className="pointer-events-none absolute inset-0 z-0 rounded-[10px] bg-bg-secondary"
            />
          ) : null}
          <button
            id={`${listboxId}-option-${index}`}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSuggestionSelect(movie)}
            className={cn(
              "relative z-10 flex w-full items-center gap-3 text-left focus-visible:outline-none",
              !isHero && index === activeIndex
                ? "bg-bg-secondary"
                : undefined,
            )}
          >
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt=""
                width={34}
                height={40}
                className="h-10 w-[34px] shrink-0 rounded-[5px] object-cover"
              />
            ) : (
              <span className="flex h-10 w-[34px] shrink-0 items-center justify-center rounded-[5px] border border-border-subtle bg-bg-secondary text-text-muted">
                <Film className="size-4" />
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span
                className={cn(
                  "min-w-0 truncate text-sm text-text-primary",
                  isHighlighted ? "font-semibold" : "font-medium",
                )}
              >
                {movie.title}
              </span>
              <span className="text-[11px] font-normal text-text-muted">
                {movie.mediaType === "tv" ? "Series" : "Movie"}
                {movie.releaseYear ? ` · ${movie.releaseYear}` : ""}
              </span>
            </span>
          </button>
        </motion.div>
      );
    });

  const suggestionsPanelContent = (
    <>
      {isLoading && suggestions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-text-muted">Searching TMDB</div>
      ) : (
        <LayoutGroup id={`${listboxId}-suggestions`}>
          <AnimatePresence
            initial={isSuggestionModalEntering}
            mode="popLayout"
          >
            {renderSuggestionRows(
              shouldAnimateLayout && !isSuggestionModalEntering,
              isSuggestionModalEntering,
            )}
          </AnimatePresence>
        </LayoutGroup>
      )}
    </>
  );

  return (
    <SearchBar
      active={isHero && isHeroActive}
      reduceMotion={reduceMotion}
      className={cn("group", className)}
    >
      <Form
        action="/results"
        autoComplete="off"
        onSubmit={() => setIsSubmitting(true)}
        className="w-full"
      >
      <label className="sr-only" htmlFor={id}>
        Search media
      </label>
      <div className="relative h-16">
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
          variant="surface"
          className={cn(
            "pr-16 text-text-primary placeholder:text-[12px] placeholder:text-text-muted md:placeholder:text-[14px]",
            isHero
              ? "h-16 rounded-full focus-visible:border-0"
              : "h-16",
          )}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => {
              setIsSuggestionsOpen(false);
              setActiveIndex(-1);
               setHoveredSuggestion(null);
               setIsHeroFocused(false);
               setIsSuggestionModalEntering(false);
             }, 120);
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;

            hasUserTypedRef.current = true;
            setIsSubmitting(false);
            setQuery(nextQuery);
            setSelectedMovie(null);
            setActiveIndex(-1);
            setHoveredSuggestion(null);

            if (!nextQuery.trim()) {
              suggestionsRef.current = [];
              setSuggestions([]);
              setIsLoading(isHero);
              setIsSuggestionsOpen(isHero);
              setShouldAnimateLayout(false);
              setIsSuggestionModalEntering(false);
            } else {
              setIsSuggestionModalEntering(false);
              setIsLoading(true);
              setIsSuggestionsOpen(true);
            }
          }}
          onFocus={() => {
            clearBlurTimer();
            if (isHero) {
              const cachedDiscovery = getCachedTmdbDiscovery();

               setIsHeroFocused(true);
               setIsSuggestionModalEntering(true);
               if (cachedDiscovery) {
                applySuggestions(cachedDiscovery);
                setIsLoading(false);
              } else {
                setIsLoading(true);
                setIsSuggestionsOpen(true);
              }
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {selectedMovie ? (
          <input type="hidden" name="tmdbId" value={selectedMovie.id} />
        ) : null}
        {selectedMovie ? (
          <input type="hidden" name="mediaType" value={selectedMovie.mediaType} />
        ) : null}

        <SearchSubmitButton
          isSubmitting={isSubmitting}
          isVisible={!isHero || isHeroActive}
          reduceMotion={reduceMotion}
          variant={variant}
        />

        {isHero ? (
          <AnimatePresence>
            {showSuggestions ? (
              <motion.div
                key="hero-suggestions"
                id={listboxId}
                ref={listboxRef}
                role="listbox"
                {...suggestionContainerProps}
                onMouseLeave={handleSuggestionMouseLeave}
                variants={animatedDropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout={!reduceMotion}
                transition={{ layout: searchInteractionSpring }}
                style={{ transformOrigin: "top left" }}
                className="scrollbar-none absolute left-0 right-0 top-[calc(100%+0.25rem)] z-50 flex max-h-[440px] flex-col gap-2.5 overflow-hidden overflow-y-auto overscroll-contain rounded-3xl border-4 border-border-subtle bg-bg-search-bar p-5 shadow-[0_6px_16px_#e1e1e399]"
              >
                {suggestionsPanelContent}
              </motion.div>
            ) : null}
          </AnimatePresence>
        ) : showSuggestions ? (
          <div
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            {...suggestionContainerProps}
            onMouseLeave={handleSuggestionMouseLeave}
            className="scrollbar-none absolute left-0 right-0 top-[calc(100%+0.25rem)] z-50 flex max-h-[440px] flex-col gap-2.5 overflow-y-auto overscroll-contain rounded-3xl border-4 border-border-subtle bg-bg-search-bar p-5 shadow-[0_6px_16px_#e1e1e399]"
          >
            {suggestionsPanelContent}
          </div>
        ) : null}
      </div>
      </Form>
    </SearchBar>
  );
}
