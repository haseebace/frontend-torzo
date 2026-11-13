"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { searchActivationSpring } from "@/components/ui/search-bar";

const sortLayoutSpring = {
  type: "spring" as const,
  visualDuration: 0.36,
  bounce: 0,
};

const sortOptions = [
  { value: "relevance", label: "Most relevant" },
  { value: "recent", label: "Recently added" },
  { value: "size", label: "Largest size" },
  { value: "seeders", label: "Most seeders" },
] as const;

const sortListVariants = {
  hidden: {
    opacity: 1,
    transition: {
      when: "afterChildren" as const,
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.12,
    },
  },
};

const sortOptionVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 18,
    filter: "blur(6px)",
    transition: {
      type: "tween" as const,
      duration: 0.16,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      default: searchActivationSpring,
      opacity: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      scale: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  },
};

const reducedMotionListVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

const reducedMotionOptionVariants = {
  hidden: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.01 },
  },
};

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isListMounted, setIsListMounted] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption =
    sortOptions.find((option) => option.value === defaultValue) ?? sortOptions[3];

  const closeSelect = () => {
    setIsOpen(false);
    setIsListReady(false);
    setActiveIndex(-1);
  };

  const openSelect = () => {
    setIsListMounted(true);
    setIsOpen(true);
    setIsListReady(true);
    setActiveIndex(-1);
  };

  const toggleSelect = () => {
    if (isOpen) {
      closeSelect();
    } else {
      openSelect();
    }
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    closeSelect();
    router.push(`/results?${params.toString()}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSelect();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) openSelect();
      setActiveIndex((index) => (index + 1) % sortOptions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) openSelect();
      setActiveIndex((index) =>
        index <= 0 ? sortOptions.length - 1 : index - 1,
      );
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeSelect();
    }
  };

  useEffect(() => {
    if (!isListMounted) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeSelect();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isListMounted]);

  useEffect(() => {
    if (isListReady && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, isListReady]);

  return (
    <div className="relative h-12 w-[180px]">
      <motion.div
        ref={rootRef}
        layout={true}
        layoutDependency={isListMounted}
        transition={{ layout: sortLayoutSpring }}
        className="absolute left-0 right-0 top-0 z-50 overflow-hidden rounded-[10px] border border-border-subtle bg-bg-surface text-primary-text"
        style={{ transformOrigin: "top center", borderRadius: 10 }}
      >
        <motion.button
          ref={triggerRef}
          layout={true}
          transition={{ layout: sortLayoutSpring }}
          type="button"
          aria-label="Sort results"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isListMounted ? listboxId : undefined}
          onClick={toggleSelect}
          onKeyDown={handleKeyDown}
          className="flex h-12 w-full items-center justify-between px-3.5 text-left text-sm font-medium outline-none focus-visible:ring-4 focus-visible:ring-focus"
        >
          <span>{selectedOption.label}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0.01 } : searchActivationSpring}
            aria-hidden="true"
          >
            <ChevronDown className="size-4 text-primary-text" />
          </motion.span>
        </motion.button>

        {isListMounted ? (
          <motion.div
            id={listboxId}
            layout={true}
            transition={{ layout: sortLayoutSpring }}
            role="listbox"
            aria-label="Sort results"
            variants={reduceMotion ? reducedMotionListVariants : sortListVariants}
            initial="hidden"
            animate={isOpen && isListReady ? "visible" : "hidden"}
            onAnimationComplete={(definition) => {
              if (!isOpen && definition === "hidden") {
                setIsListMounted(false);
                setIsListReady(false);
              }
            }}
            className="border-t border-border-subtle p-1.5"
          >
            {sortOptions.map((option, index) => (
              <motion.button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                key={option.value}
                type="button"
                role="option"
                aria-selected={selectedOption.value === option.value}
                tabIndex={activeIndex === index ? 0 : -1}
                variants={
                  reduceMotion
                    ? reducedMotionOptionVariants
                    : sortOptionVariants
                }
                onClick={() => handleSortChange(option.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closeSelect();
                    triggerRef.current?.focus();
                  }
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const direction = event.key === "ArrowDown" ? 1 : -1;
                    setActiveIndex(
                      (index + direction + sortOptions.length) % sortOptions.length,
                    );
                  }
                }}
                className="flex min-h-[38px] w-full items-center justify-between gap-2 rounded-[7px] px-2.5 py-0 text-left text-[13px] font-normal text-primary-text outline-none hover:bg-bg-hover focus-visible:bg-bg-hover aria-selected:bg-bg-hover aria-selected:font-semibold"
              >
                <span>{option.label}</span>
                {selectedOption.value === option.value ? (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                ) : null}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}
