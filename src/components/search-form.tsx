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
import { useCallback, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SearchBar,
  searchActivationSpring,
  searchInteractionSpring,
} from "@/components/ui/search-bar";
import { useMagneticHover } from "@/animations";
import { torzoCornerSmoothing, useFigmaCorner } from "@/figma-radius";
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

type ApplySuggestionsOptions = {
  isQueryUpdate?: boolean;
  finishLoading?: boolean;
};

function getSuggestionKey(suggestion: TmdbSuggestion) {
  return `${suggestion.mediaType}:${suggestion.id}`;
}

function hasMeaningfulSuggestionOverlap(
  previous: TmdbSuggestion[],
  next: TmdbSuggestion[],
) {
  if (previous.length === 0 || next.length === 0) return false;

  const previousIds = new Set(
    previous.map(getSuggestionKey),
  );
  const sharedCount = next.filter((suggestion) =>
    previousIds.has(getSuggestionKey(suggestion)),
  ).length;

  return sharedCount > 0;
}

const dropdownEase = [0.22, 1, 0.36, 1] as const;

const suggestionSpring = searchInteractionSpring;

const suggestionUpdateExitTransition = {
  duration: 0.14,
  ease: dropdownEase,
};

const suggestionEntranceSpring = {
  type: "spring" as const,
  stiffness: 230,
  damping: 21,
  mass: 2.5,
};

const suggestionEntranceListVariants = {
  hidden: {},
  visible: {
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.12,
    },
  },
};

const suggestionEntranceRowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 60,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      default: suggestionEntranceSpring,
      opacity: {
        duration: 0.7,
        ease: dropdownEase,
      },
      scale: {
        duration: 0.7,
        ease: dropdownEase,
      },
    },
  },
};

const suggestionUpdateSpring = {
  type: "spring" as const,
  stiffness: 150,
  damping: 22,
  mass: 1.05,
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

const suggestionUpdateScaleDuration = 0.476;

const suggestionUpdateVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    filter: "blur(50px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      default: suggestionUpdateSpring,
      opacity: {
        duration: suggestionUpdateScaleDuration / 2,
        ease: dropdownEase,
      },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(0px)",
    transition: suggestionUpdateExitTransition,
  },
};

function SmoothBox({
  radius,
  className,
  style,
  children,
  ...props
}: ComponentProps<typeof motion.div> & { radius: number }) {
  const [ref, cornerStyle] = useFigmaCorner<HTMLDivElement>(radius, torzoCornerSmoothing)

  return (
    <motion.div
      ref={ref}
      style={{ ...cornerStyle, ...style }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function SuggestionPanel({
  panelRef,
  style,
  ...props
}: ComponentProps<typeof motion.div> & { panelRef: RefObject<HTMLDivElement | null> }) {
  const [cornerRef, cornerStyle] = useFigmaCorner<HTMLDivElement>(24, torzoCornerSmoothing)
  const setNode = (node: HTMLDivElement | null) => {
    cornerRef.current = node
    panelRef.current = node
  }

  return <motion.div ref={setNode} style={{ ...cornerStyle, ...style }} {...props} />
}

function SmoothPoster({ children }: { children: ReactNode }) {
  const [ref, cornerStyle] = useFigmaCorner<HTMLSpanElement>(8, torzoCornerSmoothing)

  return (
    <span ref={ref} style={cornerStyle} className="block h-12 w-8 shrink-0 overflow-hidden">
      {children}
    </span>
  )
}

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
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0,
            transition: reduceMotion ? { duration: 0 } : searchInteractionSpring,
          }}
          style={{ transformOrigin: "center center" }}
          transition={reduceMotion ? { duration: 0 } : searchActivationSpring}
          className={cn(
            buttonVariants({ variant: "torzoPill" }),
            "absolute right-2.5 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center bg-primary-action p-3 text-on-primary hover:bg-primary-action",
          )}
        >
          {isSubmitting ? (
            <Loader2 className="size-5" />
          ) : (
            <ArrowRight className="size-[18px]" />
          )}
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function SearchForm({ id, defaultValue, className, variant = "default" }: SearchFormProps) {
  const pinSuggestions = variant === "hero" && !defaultValue;
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
  const [updateEnteringKeys, setUpdateEnteringKeys] = useState<string[]>([]);
  const [isSuggestionUpdateExiting, setIsSuggestionUpdateExiting] =
    useState(false);
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
  const applySuggestions = useCallback(
    (
      nextSuggestions: TmdbSuggestion[],
      {
        isQueryUpdate = false,
        finishLoading = false,
      }: ApplySuggestionsOptions = {},
    ) => {
      const previousSuggestions = suggestionsRef.current;
      const previousKeys = new Set(previousSuggestions.map(getSuggestionKey));

      setShouldAnimateLayout(
        hasMeaningfulSuggestionOverlap(previousSuggestions, nextSuggestions),
      );
      setUpdateEnteringKeys(
        isQueryUpdate
          ? nextSuggestions
              .map(getSuggestionKey)
              .filter((key) => !previousKeys.has(key))
          : [],
      );
      setIsSuggestionUpdateExiting(
        isQueryUpdate &&
          previousSuggestions.length > 0 &&
          nextSuggestions.length === 0,
      );
      suggestionsRef.current = nextSuggestions;
      setSuggestions(nextSuggestions);
      setIsSuggestionsOpen(true);
      setActiveIndex(-1);
      if (finishLoading) setIsLoading(false);
    },
    [],
  );
  const animatedDropdownVariants = reduceMotion
    ? {
        hidden: { scale: 0.98, scaleY: 0.98 },
        visible: { scale: 1, scaleY: 1, transition: { duration: 0.01 } },
        exit: { scale: 1, scaleY: 1, transition: { duration: 0.01 } },
      }
    : dropdownVariants;
  const animatedSuggestionUpdateVariants = reduceMotion
    ? {
        hidden: { opacity: 1, scale: 1 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : suggestionUpdateVariants;
  const animatedSuggestionEntranceListVariants = reduceMotion
    ? {
        hidden: {},
        visible: { transition: { duration: 0.01 } },
      }
    : suggestionEntranceListVariants;
  const animatedSuggestionEntranceRowVariants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.01 } },
      }
    : suggestionEntranceRowVariants;

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
      return;
    }

    let cancelled = false;

    if (!trimmedQuery) {
      const cachedDiscovery = getCachedTmdbDiscovery();

      if (cachedDiscovery) {
        applySuggestions(cachedDiscovery, {
          isQueryUpdate: hasUserTypedRef.current,
          finishLoading: true,
        });
        return () => {
          cancelled = true;
        };
      }

      void prefetchTmdbDiscovery()
        .then((nextSuggestions) => {
          if (cancelled) return;
          applySuggestions(nextSuggestions, {
            isQueryUpdate: hasUserTypedRef.current,
          });
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
          const hadSuggestions = suggestionsRef.current.length > 0;
          suggestionsRef.current = [];
          setSuggestions([]);
          setShouldAnimateLayout(false);
          setUpdateEnteringKeys([]);
          setIsSuggestionUpdateExiting(hadSuggestions);
          return;
        }

        const data = (await response.json()) as {
          results?: TmdbSuggestion[];
        };

        if (cancelled) return;

        applySuggestions(data.results ?? [], { isQueryUpdate: true });
      } catch {
        if (!cancelled) {
          const hadSuggestions = suggestionsRef.current.length > 0;
          suggestionsRef.current = [];
          setSuggestions([]);
          setShouldAnimateLayout(false);
          setUpdateEnteringKeys([]);
          setIsSuggestionUpdateExiting(hadSuggestions);
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
    enteringKeys: string[],
  ) =>
    suggestions.map((movie, index) => {
      const suggestionKey = getSuggestionKey(movie);
      const isHighlighted = index === activeIndex;
      const isUpdateEntry = !animateEntrance && enteringKeys.includes(suggestionKey);
      const useLayout = enableLayout && !reduceMotion && !isUpdateEntry;

      return (
        <SmoothBox
          radius={16}
          key={suggestionKey}
          inherit={animateEntrance ? undefined : true}
          layout={useLayout ? "position" : false}
          transition={
            animateEntrance
              ? undefined
              : isUpdateEntry
                ? undefined
                : useLayout
                  ? { ...suggestionSpring, layout: searchInteractionSpring }
                  : { duration: 0.16, ease: dropdownEase }
          }
          className="relative isolate flex items-start gap-2 overflow-hidden bg-bg-elevated p-2"
          initial={
            animateEntrance
              ? undefined
              : isUpdateEntry
                ? "hidden"
                : false
          }
          animate={animateEntrance ? undefined : "visible"}
          exit={animateEntrance ? undefined : "exit"}
          variants={
            animateEntrance
              ? animatedSuggestionEntranceRowVariants
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
              className="pointer-events-none absolute inset-0 z-0 bg-bg-hover"
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
              "relative z-10 flex w-full items-start gap-2 text-left focus-visible:outline-none",
              !isHero && index === activeIndex
                ? "bg-bg-secondary"
                : undefined,
            )}
          >
            {movie.posterUrl ? (
              <SmoothPoster>
                <Image
                  src={movie.posterUrl}
                  alt=""
                  width={32}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </SmoothPoster>
            ) : (
              <SmoothPoster>
                <span className="flex h-full w-full items-center justify-center bg-bg-hover text-muted-text">
                  <Film className="size-4" />
                </span>
              </SmoothPoster>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-2 py-0.5">
              <span className="min-w-0 truncate text-sm font-medium text-primary-text">
                {movie.title}
              </span>
              <span className="text-xs font-normal text-muted-text">
                {movie.releaseYear ? `${movie.releaseYear} - ` : ""}
                {movie.mediaType === "tv" ? "TV series" : "Movie"}
              </span>
            </span>
          </button>
        </SmoothBox>
      );
    });

  const suggestionRows = (
    <LayoutGroup id={`${listboxId}-suggestions`}>
      <AnimatePresence
        initial={isSuggestionModalEntering}
        mode="popLayout"
        onExitComplete={() => setIsSuggestionUpdateExiting(false)}
      >
        {renderSuggestionRows(
          shouldAnimateLayout && !isSuggestionModalEntering,
          isSuggestionModalEntering,
          updateEnteringKeys,
        )}
      </AnimatePresence>
    </LayoutGroup>
  );

  const suggestionsPanelContent = (
    <>
      {isLoading && suggestions.length === 0 && !isSuggestionUpdateExiting ? (
        <div className="px-4 py-3 text-sm text-text-muted">Searching TMDB</div>
      ) : isSuggestionModalEntering ? (
        <motion.div
          variants={animatedSuggestionEntranceListVariants}
          initial="hidden"
          animate="visible"
          inherit={false}
          className="flex flex-col gap-2"
        >
          {suggestionRows}
        </motion.div>
      ) : (
        suggestionRows
      )}
    </>
  );

  const suggestionPanelClassName =
    "scrollbar-none z-50 flex max-h-[440px] flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain border border-border-subtle bg-bg-surface p-4";

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
    <SearchBar
      active={isHero && isHeroActive}
      reduceMotion={reduceMotion}
      className={cn("group w-full bg-bg-surface", isHero && "h-[62px]")}
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
      <div className={cn("relative", isHero ? "h-[62px]" : "h-16")}>
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
          placeholder={isHero ? "Search anything that you like" : "Search movies, shows, games, software..."}
          variant="surface"
          className={cn(
            "bg-transparent pr-16 text-[16px] font-medium text-primary-text placeholder:font-medium placeholder:text-muted-text focus-visible:border-0 md:text-sm",
            isHero
              ? "h-[62px] rounded-full pl-4"
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
              const hadSuggestions = suggestionsRef.current.length > 0;
              suggestionsRef.current = [];
              setSuggestions([]);
              setIsLoading(isHero);
              setIsSuggestionsOpen(isHero);
              setShouldAnimateLayout(false);
              setUpdateEnteringKeys([]);
              setIsSuggestionUpdateExiting(hadSuggestions);
              setIsSuggestionModalEntering(false);
            } else {
              setIsSuggestionModalEntering(false);
              setUpdateEnteringKeys([]);
              setIsLoading(true);
              setIsSuggestionsOpen(true);
            }
          }}
          onFocus={() => {
            clearBlurTimer();
            if (isHero) {
              const hasQuery = Boolean(query.trim());
              const cachedDiscovery = getCachedTmdbDiscovery();

              setIsHeroFocused(true);
              setIsSuggestionModalEntering(!hasQuery);
              if (!hasQuery && cachedDiscovery) {
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

        {isHero && !pinSuggestions ? (
          <AnimatePresence>
            {showSuggestions ? (
              <SuggestionPanel
                panelRef={listboxRef}
                key="hero-suggestions"
                id={listboxId}
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
                className={cn(suggestionPanelClassName, "absolute left-0 right-0 top-[calc(100%+16px)]")}
              >
                {suggestionsPanelContent}
              </SuggestionPanel>
            ) : null}
          </AnimatePresence>
        ) : !isHero && showSuggestions ? (
          <SuggestionPanel
            panelRef={listboxRef}
            id={listboxId}
            role="listbox"
            {...suggestionContainerProps}
            onMouseLeave={handleSuggestionMouseLeave}
            className={cn(suggestionPanelClassName, "absolute left-0 right-0 top-[calc(100%+16px)]")}
          >
            {suggestionsPanelContent}
          </SuggestionPanel>
        ) : null}
      </div>
      </Form>
    </SearchBar>
    {pinSuggestions ? (
      <AnimatePresence>
        {showSuggestions ? (
          <SuggestionPanel
            panelRef={listboxRef}
            key="hero-suggestions"
            id={listboxId}
            role="listbox"
            {...suggestionContainerProps}
            onMouseLeave={handleSuggestionMouseLeave}
            variants={animatedDropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout={!reduceMotion}
            transition={{ layout: searchInteractionSpring }}
            style={{ transformOrigin: "top center" }}
            className={cn(suggestionPanelClassName, "relative w-full")}
          >
            {suggestionsPanelContent}
          </SuggestionPanel>
        ) : null}
      </AnimatePresence>
    ) : null}
    </div>
  );
}
