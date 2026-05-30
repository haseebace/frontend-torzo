"use client";

import type { Transition } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiteNavbar } from "@/components/site-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  standardSpring,
  gentleSpring,
  bouncySpring,
  stiffSpring,
  magneticSpring,
  menuItemSpring,
  iconSwapSpring,
  morphSpring,
  contentSwapSpring,
  easeOut,
  easeSmooth,
  easeExpo,
  easeHomepage,
  fadeIn,
  fadeInSlow,
  scaleIn,
  homepageEnter,
  magneticHover,
  microInteraction,
  morphContainer,
  morphContent,
  useMagneticHover,
  MagneticHoverBackground,
} from "@/animations";

const demoFiles = [
  { name: "The.Matrix.1999.2160p.UHD.BluRay.x265-TERRA.mkv", size: "18.4 GB" },
  { name: "Inception.2010.1080p.BluRay.x264-SPARKS.mkv", size: "9.8 GB" },
  { name: "Interstellar.2014.2160p.UHD.BluRay.x265-RARBG.mkv", size: "22.1 GB" },
  { name: "Dune.Part.One.2021.1080p.BluRay.x264-SLOT.mkv", size: "11.3 GB" },
];

const demoItems = ["Action", "Sci-Fi", "Thriller", "Adventure"];

function SpringDemo({
  name,
  description,
  transition,
  useCase,
}: {
  name: string;
  description: string;
  transition: Transition;
  useCase: string;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[1px] text-muted-foreground">
          {name}
        </div>
        <p className="mt-1.5 text-sm leading-snug text-foreground-strong">
          {description}
        </p>
      </div>

      <div className="relative mb-4 flex h-24 items-center justify-center overflow-hidden rounded-xl bg-secondary/60">
        <motion.div
          className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm"
          animate={{
            x: isActive ? 52 : -52,
            scale: isActive ? 1.02 : 1,
          }}
          transition={transition}
        >
          {name.replace(/Spring$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")}
        </motion.div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsActive(!isActive)}
          className="h-9 px-4 text-xs"
        >
          {isActive ? "Reset" : "Trigger"}
        </Button>
        <Badge variant="outline" className="text-[10px]">
          {useCase}
        </Badge>
      </div>

      <div className="mt-3 rounded-lg bg-background/60 p-2.5 text-[10px] leading-tight text-muted-foreground">
        type: spring • stiffness: {transition.stiffness} • damping: {transition.damping}
        {transition.bounce !== undefined ? ` • bounce: ${transition.bounce}` : ""}
      </div>
    </div>
  );
}

function EasingRunner({
  name,
  easing,
  description,
}: {
  name: string;
  easing: readonly number[] | string;
  description: string;
}) {
  const [key, setKey] = useState(0);

  const run = () => setKey((k) => k + 1);

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-xs font-medium tracking-[0.5px] text-foreground-strong">
            {name}
          </div>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={run}
          className="h-7 px-2.5 text-[11px]"
        >
          Run
        </Button>
      </div>

      <div className="relative h-9 rounded-lg bg-secondary/70">
        <motion.div
          key={key}
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-primary shadow-sm"
          initial={{ left: "8px" }}
          animate={{ left: "calc(100% - 28px)" }}
          transition={{
            duration: name.includes("Homepage") ? 2.2 : 1.1,
            ease: easing as any,
          }}
        />
      </div>

      <div className="mt-2 text-[9px] text-muted-foreground/80">
        ease: {Array.isArray(easing) ? `[${easing.join(", ")}]` : easing}
      </div>
    </div>
  );
}

function TransitionDemo({
  name,
  transition,
  description,
}: {
  name: string;
  transition: Transition;
  description: string;
}) {
  const [show, setShow] = useState(true);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="mb-3">
        <div className="text-xs uppercase tracking-[1px] text-muted-foreground">
          {name}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex min-h-[92px] items-center justify-center rounded-xl bg-secondary/50">
        <AnimatePresence mode="wait">
          {show && (
            <motion.div
              className="rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm"
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={transition}
            >
              Hello from {name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => setShow(!show)}
        className="mt-4 h-9 w-full text-xs"
      >
        {show ? "Exit" : "Enter"}
      </Button>
    </div>
  );
}

function MagneticListDemo() {
  const { containerProps, setHoveredIndex, getBackgroundProps } =
    useMagneticHover({
      layoutId: "demo-magnetic-list",
    });

  return (
    <div
      {...containerProps}
      className="divide-y divide-border/70 rounded-2xl border border-border bg-surface-elevated"
    >
      {demoFiles.map((file, i) => {
        const bgProps = getBackgroundProps(i);
        return (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <AnimatePresence>
              {bgProps.isActive && (
                <MagneticHoverBackground
                  {...bgProps}
                  className="rounded-[18px] bg-surface-subtle"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center gap-3 px-4 py-3 text-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                📄
              </span>
              <div className="min-w-0 flex-1 truncate font-medium text-foreground-strong">
                {file.name}
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {file.size}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MagneticPillsDemo() {
  const { containerProps, setHoveredIndex, getBackgroundProps } =
    useMagneticHover({
      layoutId: "demo-magnetic-pills",
    });

  return (
    <div
      {...containerProps}
      className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-elevated p-4"
    >
      {demoItems.map((label, i) => {
        const bgProps = getBackgroundProps(i);
        return (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <AnimatePresence>
              {bgProps.isActive && (
                <MagneticHoverBackground
                  {...bgProps}
                  className="rounded-full bg-primary"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground-strong">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MORPHING TRANSITIONS — Expert-level shape + content morphs
// ─────────────────────────────────────────────────────────────────────────────

function ButtonToInputMorph() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const collapse = () => {
    setIsExpanded(false);
    setTimeout(() => setQuery(""), 180);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        collapse();
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-xs uppercase tracking-[1px] text-muted-foreground">
        Button → Input Morph
      </div>

      {/* SVG Gooey Filter - hidden from layout, provides liquid merging effect */}
      <svg className="pointer-events-none absolute -z-50 h-0 w-0 opacity-0">
        <defs>
          <filter id="gooey-morph" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <motion.div
        ref={containerRef}
        layout
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`group relative flex items-center overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm transition-colors will-change-transform ${
          isExpanded
            ? "w-full max-w-md h-[58px] bg-card"
            : "h-[52px] w-[260px] cursor-pointer px-6 hover:bg-secondary/60"
        }`}
        transition={morphContainer}
      >
        {/* Gooey / liquid overlay that creates the soft merging feel */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/5"
          animate={{
            opacity: isExpanded ? 0.6 : 0.15,
            scale: isExpanded ? 1.015 : 1,
          }}
          transition={{
            ...morphContent,
            duration: 0.4,
          }}
          style={{
            filter: isExpanded ? "url(#gooey-morph)" : "none",
          }}
        />

        {/* Collapsed label */}
        <AnimatePresence mode="wait">
          {!isExpanded && (
            <motion.div
              key="label"
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 3, scale: 0.985 }}
              transition={morphContent}
              className="flex items-center gap-3 text-sm font-medium text-foreground-strong"
            >
              <span className="text-lg opacity-70">⌘</span>
              Search movies &amp; shows
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded input state */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: -4, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.985 }}
              transition={morphContent}
              className="flex w-full items-center gap-3 px-5"
            >
              <span className="text-lg opacity-60">⌘</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") collapse();
                  if (e.key === "Enter" && query.trim()) collapse();
                }}
                placeholder="Start typing to search..."
                className="flex-1 bg-transparent text-[15px] text-foreground-strong placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  collapse();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary/60 hover:text-foreground-strong"
                aria-label="Close search"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-3 max-w-[260px] text-center text-[11px] leading-snug text-muted-foreground">
        Clean shape morph with a soft gooey layer. No heavy blur fighting the layout.
        The liquid edge comes from the filtered overlay blending during expansion.
      </p>
    </div>
  );
}

function SelectToDropdownMorph() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = ["Action", "Drama", "Sci-Fi", "Thriller", "Comedy", "Horror"];

  const close = () => {
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-xs uppercase tracking-[1px] text-muted-foreground">
        Select → Dropdown Morph
      </div>

      <div ref={containerRef} className="relative w-full max-w-[260px]">
        {/* Trigger that morphs */}
        <motion.button
          layout
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-left text-sm font-medium text-foreground-strong shadow-sm transition-colors ${
            isOpen ? "rounded-b-none border-b-0 bg-card" : "hover:bg-secondary/60"
          }`}
          transition={morphContainer}
        >
          <span>{selected ? selected : "Choose a genre"}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={iconSwapSpring}
            className="text-muted-foreground"
          >
            ▾
          </motion.span>
        </motion.button>

        {/* Expanding panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.96, y: -4 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", scale: 0.985, y: -4 }}
              transition={morphContent}
              className="absolute left-0 right-0 z-10 overflow-hidden rounded-2xl rounded-t-none border border-border bg-card shadow-sm"
            >
              <div className="divide-y divide-border/70 py-1">
                {options.map((option, index) => (
                  <motion.button
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setTimeout(close, 120);
                    }}
                    initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                      transition: {
                        ...morphContent,
                        delay: 0.02 * index,
                      },
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm text-foreground-strong hover:bg-secondary/60 active:bg-secondary"
                  >
                    {option}
                    {selected === option && (
                      <span className="ml-auto text-xs text-muted-foreground">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-center text-[11px] leading-snug text-muted-foreground">
        The trigger and panel share the same morph language. Options arrive with
        a soft staggered blur-to-focus motion.
      </p>
    </div>
  );
}

export function AnimationsDemo() {
  const [showManual, setShowManual] = useState(false);

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-5xl animate-page-fade-in px-4 pb-24 pt-10 md:px-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-[2px] text-muted-foreground">
              INTERNAL
            </div>
            <Badge variant="outline">Developer only</Badge>
          </div>
          <h1 className="mt-2 text-5xl font-black tracking-tighter text-foreground-strong">
            Animation System
          </h1>
          <p className="mt-3 max-w-prose text-lg text-muted-foreground">
            Visual reference for everything exported from{" "}
            <code className="rounded bg-secondary px-1.5 py-px text-sm">
              @/animations
            </code>
            . Springs, easings, transitions, magnetic hover, and new high-end morphing patterns.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="text-sm text-link underline-offset-4 hover:underline"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>

        {/* Philosophy note */}
        <div className="mb-12 rounded-2xl border border-border bg-surface-elevated p-5 text-sm">
          <div className="font-medium text-foreground-strong">Philosophy</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Springs, easings, and transitions live in pure <code>.ts</code> files</li>
            <li>Components never contain animation logic — they import from here</li>
            <li>Prefer <code>useMagneticHover</code> + <code>MagneticHoverBackground</code> for list hovers</li>
            <li>Always use the shared tokens instead of ad-hoc values</li>
          </ul>
        </div>

        {/* SPRINGS */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground">
                CORE
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground-strong">
                Springs
              </h2>
            </div>
            <Badge variant="secondary" className="hidden md:block">
              Framer Motion Transition objects
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SpringDemo
              name="standardSpring"
              description="Snappy but not aggressive. The default for most UI interactions."
              transition={standardSpring}
              useCase="hovers, buttons"
            />
            <SpringDemo
              name="gentleSpring"
              description="Softer and more relaxed. Great for larger elements and page-level motion."
              transition={gentleSpring}
              useCase="page transitions"
            />
            <SpringDemo
              name="bouncySpring"
              description="Playful with visible overshoot. Use sparingly for delight moments."
              transition={bouncySpring}
              useCase="onboarding, success"
            />
            <SpringDemo
              name="stiffSpring"
              description="Fast with almost no bounce. Perfect for toggles and instant feedback."
              transition={stiffSpring}
              useCase="switches, toggles"
            />
            <SpringDemo
              name="magneticSpring"
              description="The exact spring used by the magnetic hover background effect."
              transition={magneticSpring}
              useCase="list hovers"
            />
            <SpringDemo
              name="menuItemSpring"
              description="Bouncy entrance with high elasticity. Used for mobile menu and dropdowns."
              transition={menuItemSpring}
              useCase="menus, dropdowns"
            />
            <SpringDemo
              name="iconSwapSpring"
              description="Extremely fast, zero bounce. For icon transitions (hamburger → close)."
              transition={iconSwapSpring}
              useCase="icon toggles"
            />
          </div>
        </section>

        {/* EASINGS */}
        <section className="mb-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground">
              CORE
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground-strong">
              Easings
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Cubic-bezier curves. Use with CSS <code>transition-timing-function</code> or Framer Motion <code>ease</code>.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <EasingRunner
              name="easeOut"
              easing={easeOut}
              description="Fast start, slow end — the workhorse"
            />
            <EasingRunner
              name="easeSmooth"
              easing={easeSmooth}
              description="Balanced, natural acceleration"
            />
            <EasingRunner
              name="easeExpo"
              easing={easeExpo}
              description="Very dramatic — big elements & page fades"
            />
            <EasingRunner
              name="easeHomepage"
              easing={easeHomepage}
              description="The signature dramatic homepage entrance"
            />
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Click any "Run" button to see the curve in action. Notice how dramatically different <span className="font-medium text-foreground-strong">easeHomepage</span> feels.
          </p>
        </section>

        {/* TRANSITIONS */}
        <section className="mb-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground">
              PRESETS
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground-strong">
              Transitions
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Ready-to-use combinations of duration + easing (or spring).
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TransitionDemo
              name="fadeIn"
              transition={fadeIn}
              description="Standard 0.3s opacity fade"
            />
            <TransitionDemo
              name="fadeInSlow"
              transition={fadeInSlow}
              description="Page-level 1s fade"
            />
            <TransitionDemo
              name="scaleIn"
              transition={scaleIn}
              description="Gentle scale + fade"
            />
            <TransitionDemo
              name="microInteraction"
              transition={microInteraction}
              description="Standard spring micro-interaction"
            />
            <TransitionDemo
              name="magneticHover"
              transition={magneticHover}
              description="Alias of magneticSpring for hover backgrounds"
            />
            <div className="flex flex-col rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-3">
                <div className="text-xs uppercase tracking-[1px] text-muted-foreground">
                  homepageEnter
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  3-second dramatic entrance used on homepage hero
                </p>
              </div>
              <div className="mt-auto text-[11px] text-muted-foreground/70">
                Applied via the <code>animate-homepage-enter</code> utility class on the homepage header.
              </div>
            </div>
          </div>
        </section>

        {/* MAGNETIC HOVER */}
        <section className="mb-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground">
              HOOK + COMPONENT
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground-strong">
              Magnetic Hover
            </h2>
            <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
              The flagship primitive. A shared <code>layoutId</code> motion background that smoothly follows your cursor across list items.
              Used in production inside <code>TorrentFileList</code>.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Vertical list (production style) */}
            <div className="lg:col-span-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>VERTICAL LIST</span>
                <span className="text-[10px]">(exact production pattern)</span>
              </div>
              <MagneticListDemo />
            </div>

            {/* Horizontal pills */}
            <div className="lg:col-span-2">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                HORIZONTAL PILLS
              </div>
              <MagneticPillsDemo />

              <div className="mt-4 text-xs text-muted-foreground">
                Same hook, different layout. The background automatically animates between any set of siblings.
              </div>
            </div>
          </div>

          {/* Manual implementation toggle */}
          <div className="mt-8">
            <button
              onClick={() => setShowManual(!showManual)}
              className="text-sm font-medium text-link underline-offset-4 hover:underline"
            >
              {showManual ? "Hide" : "Show"} manual implementation (no wrapper component)
            </button>

            <AnimatePresence>
              {showManual && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden rounded-2xl border border-border bg-secondary p-5 text-sm text-foreground"
                >
                  <pre className="overflow-x-auto text-xs leading-relaxed">
{`const { containerProps, setHoveredIndex, getBackgroundProps } = useMagneticHover({
  layoutId: "my-custom-list",
});

return (
  <div {...containerProps}>
    {items.map((item, i) => {
      const bg = getBackgroundProps(i);
      return (
        <div key={i} className="relative" onMouseEnter={() => setHoveredIndex(i)}>
          <AnimatePresence>
            {bg.isActive && (
              <motion.div
                layoutId={bg.layoutId}
                className="absolute inset-0 rounded-xl bg-surface-subtle"
                initial={bg.initial}
                animate={bg.animate}
                exit={bg.exit}
                transition={bg.transition}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10">{item}</div>
        </div>
      );
    })}
  </div>
);`}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* MORPHING TRANSITIONS */}
        <section className="mb-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[1.5px] text-muted-foreground">
              NEW
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground-strong">
              Morphing Transitions
            </h2>
            <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
              Shape-changing interactions that feel alive. The container uses a weighty <code>morphSpring</code> while inner content cross-fades with blur, fade, and micro-scale using <code>contentSwapSpring</code>. These are the same primitives used in premium interfaces.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-elevated p-6">
              <ButtonToInputMorph />
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated p-6">
              <SelectToDropdownMorph />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface-elevated p-5 text-sm">
            <div className="font-medium text-foreground-strong">Motion Design Notes</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>The outer container always drives the spatial change using <code>layout</code> + <code>morphSpring</code> (low stiffness, higher mass).</li>
              <li>Content layers are completely separate from the shape. They only handle opacity + blur + tiny scale — never fight the layout animation.</li>
              <li>Stagger on the dropdown options creates a soft “liquid” arrival without feeling busy.</li>
              <li>Exit states are deliberately more blurred than enter states. This creates an elegant “dissolve back into the trigger” feeling.</li>
            </ul>
          </div>
        </section>

        {/* Quick reference */}
        <section>
          <div className="mb-4 text-sm font-medium text-muted-foreground">
            Quick import reference
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-5 text-xs leading-relaxed text-muted-foreground">
            import &#123; morphSpring, contentSwapSpring, morphContainer, morphContent, useMagneticHover &#125; from "@/animations";
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Source: <code className="rounded bg-secondary px-1 py-px text-[10px]">src/animations/</code> — springs.ts (new morphSpring), transitions.ts (morphContainer), and custom patterns on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
