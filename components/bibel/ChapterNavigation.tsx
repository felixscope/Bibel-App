"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ChapterNavigationProps {
  bookId: string;
  currentChapter: number;
  totalChapters: number;
}

export function ChapterNavigation({
  bookId,
  currentChapter,
  totalChapters,
}: ChapterNavigationProps) {
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <nav className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full shadow-lg px-2 py-2"
      >
        {/* Vorheriges Kapitel */}
        {hasPrev ? (
          <Link
            href={`/lesen/${bookId}/${currentChapter - 1}`}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center opacity-30">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
        )}

        {/* Kapitelanzeige */}
        <div className="px-4 py-2 min-w-[80px] text-center">
          <span className="text-[var(--text-primary)] font-medium">
            {currentChapter}
          </span>
          <span className="text-[var(--text-muted)] mx-1">/</span>
          <span className="text-[var(--text-muted)]">
            {totalChapters}
          </span>
        </div>

        {/* Nächstes Kapitel */}
        {hasNext ? (
          <Link
            href={`/lesen/${bookId}/${currentChapter + 1}`}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center opacity-30">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        )}
      </motion.div>
    </nav>
  );
}
