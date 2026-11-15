"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";

// Spring integrator from Design Bookmark motion.js.
// Stiffness and damping match spring-dropdown/dropdown.js (the values that
// drive the published bookmark). Named tokens in shared/tokens.css:
// soft 260 24, lead 620 36, trail 190 19, fade 420 32.
type Spring = { x: number; v: number; t: number; k: number; c: number };

function spring(x: number, k: number, c: number): Spring {
  return { x, v: 0, t: x, k, c };
}

function stepSpring(s: Spring, dt: number) {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const sortOptions = [
  { value: "relevance", label: "Most relevant", dot: "var(--muted-text)" },
  { value: "recent", label: "Recently added", dot: "var(--color-warning-foreground)" },
  { value: "size", label: "Largest size", dot: "var(--primary-text)" },
  { value: "seeders", label: "Most seeders", dot: "var(--seeder-text)" },
] as const;

const ROW = 44;
const PAD = 6;
const GAP = 8;
const MENU_HEIGHT = PAD * 2 + ROW * sortOptions.length;

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tickRefs = useRef<Array<SVGPathElement | null>>([]);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const foundIndex = sortOptions.findIndex((option) => option.value === defaultValue);
  const selectedIndex = foundIndex === -1 ? 3 : foundIndex;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedIndex);
  const [slotLabels, setSlotLabels] = useState<[string, string]>([
    sortOptions[selectedIndex].label,
    "",
  ]);
  const [slotColors, setSlotColors] = useState<[string, string]>([
    sortOptions[selectedIndex].dot,
    sortOptions[selectedIndex].dot,
  ]);

  const motionRef = useRef({
    open: false,
    selected: selectedIndex,
    hover: -1,
    front: 0,
    reduce: false,
    height: spring(0, 300, 23),
    lift: spring(0, 260, 24),
    chevron: spring(0, 300, 18),
    menuOpacity: spring(0, 400, 34),
    press: spring(1, 500, 18),
    roll: spring(1, 340, 26),
    highlightTop: spring(PAD, 620, 36),
    highlightBottom: spring(PAD + ROW, 620, 36),
    highlightOpacity: spring(0, 400, 32),
    rows: sortOptions.map(() => spring(0, 300, 24)),
    checks: sortOptions.map((_, index) => spring(index === selectedIndex ? 1 : 0, 260, 26)),
  });

  const applyReduce = (reduce: boolean) => {
    const motion = motionRef.current;
    motion.reduce = reduce;
    if (!reduce) return;
    const snap = (s: Spring) => {
      s.c = 2 * Math.sqrt(s.k);
    };
    snap(motion.height);
    snap(motion.lift);
    snap(motion.chevron);
    snap(motion.menuOpacity);
    snap(motion.press);
    snap(motion.roll);
    snap(motion.highlightTop);
    snap(motion.highlightBottom);
    snap(motion.highlightOpacity);
    motion.rows.forEach(snap);
    motion.checks.forEach(snap);
  };

  const paint = () => {
    const motion = motionRef.current;
    const lift = liftRef.current;
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    const highlight = highlightRef.current;
    const chevron = chevronRef.current;
    if (!lift || !trigger || !menu || !highlight || !chevron) return;

    lift.style.transform = `translateY(${motion.lift.x.toFixed(2)}px)`;
    trigger.style.transform = `scale(${motion.press.x.toFixed(4)})`;
    chevron.style.transform = `rotate(${(180 * motion.chevron.x).toFixed(2)}deg)`;

    const height = Math.max(0, motion.height.x);
    const opacity = clamp(motion.menuOpacity.x, 0, 1);
    menu.style.height = `${height.toFixed(2)}px`;
    menu.style.opacity = opacity.toFixed(3);
    menu.style.visibility = height < 1 ? "hidden" : "visible";
    menu.style.pointerEvents = motion.open ? "auto" : "none";
    menu.style.transform = `scaleX(${(0.9 + 0.1 * clamp(motion.height.x / MENU_HEIGHT, 0, 1.06)).toFixed(4)})`;

    motion.rows.forEach((row, index) => {
      const option = optionRefs.current[index];
      const tick = tickRefs.current[index];
      if (!option || !tick) return;
      const shown = clamp(row.x, 0, 1);
      option.style.opacity = shown.toFixed(3);
      option.style.transform = `translateY(${((row.x - 1) * 14).toFixed(2)}px)`;
      tick.style.strokeDashoffset = (22 * (1 - clamp(motion.checks[index].x, 0, 1))).toFixed(2);
    });

    highlight.style.opacity = (clamp(motion.highlightOpacity.x, 0, 1) * opacity).toFixed(3);
    const top = clamp(
      Math.min(motion.highlightTop.x, motion.highlightBottom.x - 16),
      PAD,
      MENU_HEIGHT - PAD - 16,
    );
    const bottom = clamp(motion.highlightBottom.x, top + 16, MENU_HEIGHT - PAD);
    highlight.style.height = `${(bottom - top).toFixed(2)}px`;
    highlight.style.transform = `translateY(${top.toFixed(2)}px)`;

    const roll = motion.roll.x;
    const current = slotRefs.current[motion.front];
    const previous = slotRefs.current[motion.front ^ 1];
    if (current && previous) {
      current.style.opacity = clamp(roll, 0, 1).toFixed(3);
      current.style.transform = `translateY(${((1 - roll) * 20).toFixed(2)}px)`;
      previous.style.opacity = clamp(1 - roll, 0, 1).toFixed(3);
      previous.style.transform = `translateY(${(-roll * 20).toFixed(2)}px)`;
    }
  };

  const hover = (index: number, snap = false) => {
    const motion = motionRef.current;
    if (index === motion.hover || index < 0 || index >= sortOptions.length) return;
    const top = PAD + index * ROW;
    if (snap || motion.hover < 0) {
      motion.highlightTop.x = motion.highlightTop.t = top;
      motion.highlightBottom.x = motion.highlightBottom.t = top + ROW;
      motion.highlightTop.v = motion.highlightBottom.v = 0;
    } else {
      const down = index > motion.hover;
      const lead = down ? motion.highlightBottom : motion.highlightTop;
      const trail = down ? motion.highlightTop : motion.highlightBottom;
      lead.k = 620;
      lead.c = motion.reduce ? 2 * Math.sqrt(620) : 36;
      trail.k = 200;
      trail.c = motion.reduce ? 2 * Math.sqrt(200) : 20;
      motion.highlightTop.t = top;
      motion.highlightBottom.t = top + ROW;
    }
    motion.hover = index;
    motion.highlightOpacity.t = 1;
    triggerRef.current?.setAttribute("aria-activedescendant", `${listboxId}-option-${index}`);
  };

  const setOpenMotion = (next: boolean) => {
    const motion = motionRef.current;
    if (motion.open === next) return;
    motion.open = next;
    setOpen(next);
    triggerRef.current?.setAttribute("aria-expanded", String(next));
    motion.height.t = next ? MENU_HEIGHT : 0;
    motion.lift.t = next ? -(GAP + MENU_HEIGHT) / 2 : 0;
    motion.chevron.t = next ? 1 : 0;
    motion.menuOpacity.t = next ? 1 : 0;
    const count = sortOptions.length;
    motion.rows.forEach((row, index) => {
      const delay = next ? 0.05 + index * 0.045 : (count - 1 - index) * 0.02;
      window.setTimeout(() => {
        if (motionRef.current.open === next) row.t = next ? 1 : 0;
      }, delay * 1000);
    });
    if (next) {
      hover(motion.selected, true);
    } else {
      motion.hover = -1;
      motion.highlightOpacity.t = 0;
      triggerRef.current?.removeAttribute("aria-activedescendant");
    }
  };

  const commitSort = (index: number) => {
    const option = sortOptions[index];
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option.value);
    params.set("page", "1");
    router.push(`/results?${params.toString()}`);
  };

  const selectOption = (index: number) => {
    const motion = motionRef.current;
    if (index !== motion.selected) {
      motion.selected = index;
      motion.front ^= 1;
      const incoming = motion.front;
      setSlotLabels((current) => {
        const next: [string, string] = [...current];
        next[incoming] = sortOptions[index].label;
        return next;
      });
      setSlotColors((current) => {
        const next: [string, string] = [...current];
        next[incoming] = sortOptions[index].dot;
        return next;
      });
      motion.roll.x = 0;
      motion.roll.v = 0;
      motion.roll.t = 1;
      setSelected(index);
    }
    motion.checks.forEach((check, optionIndex) => {
      check.t = optionIndex === index ? 1 : 0;
    });
    optionRefs.current.forEach((option, optionIndex) => {
      option?.setAttribute("aria-selected", String(optionIndex === index));
    });
    motion.press.x = 0.955;
    window.setTimeout(() => setOpenMotion(false), 240);
    commitSort(index);
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    applyReduce(reduce);
    const motion = motionRef.current;
    const slot = slotRefs.current[0];
    if (slot) slot.style.setProperty("--c", sortOptions[motion.selected].dot);
    paint();

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const current = motionRef.current;
      const springs = [
        current.height,
        current.lift,
        current.chevron,
        current.menuOpacity,
        current.press,
        current.roll,
        current.highlightTop,
        current.highlightBottom,
        current.highlightOpacity,
        ...current.rows,
        ...current.checks,
      ];
      for (let sub = 0; sub < 4; sub += 1) {
        springs.forEach((item) => stepSpring(item, dt / 4));
      }
      paint();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const motion = motionRef.current;
    if (motion.selected === selectedIndex) return;
    motion.selected = selectedIndex;
    motion.front = 0;
    motion.roll.x = 1;
    motion.roll.v = 0;
    motion.roll.t = 1;
    setSlotLabels([sortOptions[selectedIndex].label, ""]);
    setSlotColors([sortOptions[selectedIndex].dot, sortOptions[selectedIndex].dot]);
    motion.checks.forEach((check, index) => {
      check.x = check.t = index === selectedIndex ? 1 : 0;
      check.v = 0;
    });
    setSelected(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!motionRef.current.open) return;
      if (!rootRef.current?.contains(event.target as Node)) setOpenMotion(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const toggle = () => {
    motionRef.current.press.x = 0.965;
    setOpenMotion(!motionRef.current.open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!motionRef.current.open) setOpenMotion(true);
      else hover(motionRef.current.hover + (event.key === "ArrowDown" ? 1 : -1));
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && motionRef.current.open && motionRef.current.hover > -1) {
      event.preventDefault();
      selectOption(motionRef.current.hover);
      return;
    }
    if (event.key === "Escape" && motionRef.current.open) {
      event.preventDefault();
      setOpenMotion(false);
    }
  };

  return (
    <div ref={rootRef} className="relative z-50 h-[52px] w-[232px]">
      <div ref={liftRef} className="relative h-[52px] will-change-transform">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Sort results"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 flex items-center gap-2.5 rounded-2xl border border-border-subtle bg-bg-surface px-4 pr-3.5 text-primary-text shadow-sm outline-none will-change-transform focus-visible:border-4 focus-visible:border-secondary"
        >
          <span className="relative h-[52px] flex-1 overflow-hidden">
            {sortOptions.slice(0, 2).map((option, index) => (
              <span
                key={option.value}
                ref={(element) => {
                  slotRefs.current[index] = element;
                }}
                className="absolute inset-0 flex items-center gap-2.5 will-change-transform"
                style={{ ["--c" as string]: slotColors[index] }}
              >
                <i className="size-2.5 shrink-0 rounded-full bg-[var(--c)]" />
                <b className="truncate text-sm font-medium tracking-[-0.01em]">
                  {slotLabels[index]}
                </b>
              </span>
            ))}
          </span>
          <span ref={chevronRef} className="shrink-0 text-muted-text will-change-transform" aria-hidden="true">
            <ChevronDown className="size-5" />
          </span>
        </button>

        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-label="Sort results"
          className="absolute top-[60px] left-0 h-0 w-full origin-top overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-1.5 shadow-sm invisible"
        >
          <span
            ref={highlightRef}
            className="pointer-events-none absolute right-1.5 left-1.5 rounded-xl bg-bg-hover opacity-0"
          />
          {sortOptions.map((option, index) => (
            <div
              key={option.value}
              id={`${listboxId}-option-${index}`}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="option"
              aria-selected={selected === index}
              onPointerEnter={() => {
                if (motionRef.current.open) hover(index);
              }}
              onClick={() => {
                if (motionRef.current.open) selectOption(index);
              }}
              className="relative z-[1] flex h-11 cursor-pointer items-center gap-2.5 rounded-xl pr-2.5 pl-3 text-primary-text opacity-0"
              style={{ ["--c" as string]: option.dot }}
            >
              <i className="size-2.5 shrink-0 rounded-full bg-[var(--c)]" />
              <b className="flex-1 truncate text-sm font-medium tracking-[-0.01em]">{option.label}</b>
              <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path
                  ref={(element) => {
                    tickRefs.current[index] = element;
                  }}
                  d="M5 12.5l4.5 4.5L19 7.5"
                  style={{ strokeDasharray: 22 }}
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
