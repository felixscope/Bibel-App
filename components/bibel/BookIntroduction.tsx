"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookIntroductionProps {
  introduction: string;
  bookName: string;
}

export function BookIntroduction({ introduction, bookName }: BookIntroductionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!introduction) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
      >
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0 ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Einleitung zu {bookName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 mt-2 rounded-lg bg-[var(--bg-secondary)] border-l-2 border-[var(--text-muted)]">
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {introduction}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
