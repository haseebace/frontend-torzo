"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = () => {
    // Here you would typically send the feedback
    console.log("Feedback sent:", feedback);
    setFeedback("");
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        ref={containerRef}
        layout
        className="cursor-pointer overflow-hidden border border-border bg-card shadow-sm"
        style={{ borderRadius: 14 }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Always visible header / button text */}
        <motion.div layout="position" className="flex items-center px-5 py-3">
          <span className="text-sm font-semibold text-foreground-strong">
            Feedback
          </span>
        </motion.div>

        {/* Expanded content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {/* Text area */}
              <div className="px-5 pb-4">
                <textarea
                  autoFocus
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  style={{ height: 120 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Dashed separator */}
              <div className="mx-5 border-t border-dashed border-border" />

              {/* Send button area */}
              <div className="flex justify-end px-5 py-4">
                <motion.button
                  layout="position"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSend();
                  }}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Send feedback
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
