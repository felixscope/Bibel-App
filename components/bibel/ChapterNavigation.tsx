"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Swipe Navigation für Mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

      // Mindestens 80px horizontal swipen, aber weniger als 50px vertikal
      if (Math.abs(deltaX) > 80 && deltaY < 50) {
        if (deltaX > 0 && hasPrev) {
          // Swipe nach rechts = vorheriges Kapitel
          router.push(`/lesen/${bookId}/${currentChapter - 1}`);
        } else if (deltaX < 0 && hasNext) {
          // Swipe nach links = nächstes Kapitel
          router.push(`/lesen/${bookId}/${currentChapter + 1}`);
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [bookId, currentChapter, hasPrev, hasNext, router]);

  return (
    <>
      {/* Desktop: Dezente Navigation am unteren Rand */}
      <nav className="hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex items-center gap-1 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border)] rounded-full shadow-sm px-1.5 py-1"
        >
          {/* Vorheriges Kapitel */}
          {hasPrev ? (
            <Link
              href={`/lesen/${bookId}/${currentChapter - 1}`}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center opacity-20">
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
          )}

          {/* Kapitelanzeige */}
          <div className="px-2 py-1 min-w-[50px] text-center">
            <span className="text-xs text-[var(--text-muted)]">
              {currentChapter}/{totalChapters}
            </span>
          </div>

          {/* Nächstes Kapitel */}
          {hasNext ? (
            <Link
              href={`/lesen/${bookId}/${currentChapter + 1}`}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center opacity-20">
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          )}
        </motion.div>
      </nav>

      {/* Mobile: Nur kleine Indikatoren an den Seiten */}
      <div className="md:hidden fixed inset-y-0 left-0 w-8 flex items-center justify-start pointer-events-none z-30">
        {hasPrev && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="ml-1"
          >
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </motion.div>
        )}
      </div>
      <div className="md:hidden fixed inset-y-0 right-0 w-8 flex items-center justify-end pointer-events-none z-30">
        {hasNext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="mr-1"
          >
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.div>
        )}
      </div>
    </>
  );
}
