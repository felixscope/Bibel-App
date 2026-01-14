"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface VerseTextProps {
  number: number;
  text: string;
  footnotes?: string[];
  highlight?: "yellow" | "green" | "blue" | "pink" | "orange" | null;
  hasNote?: boolean;
  isBookmarked?: boolean;
  isSelected?: boolean;
  onSelect?: (verseNumber: number, text: string) => void;
}

export function VerseText({
  number,
  text,
  footnotes,
  highlight = null,
  hasNote = false,
  isBookmarked = false,
  isSelected = false,
  onSelect,
}: VerseTextProps) {
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const [showFootnote, setShowFootnote] = useState(false);
  const footnoteRef = useRef<HTMLSpanElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // Nur auslösen wenn der Finger sich weniger als 10px bewegt hat (kein Scroll)
    if (deltaX < 10 && deltaY < 10) {
      e.preventDefault();
      onSelect?.(number, text);
    }

    touchStartPos.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Auf Touch-Geräten wird handleTouchEnd verwendet
    if ("ontouchstart" in window) return;
    e.stopPropagation();
    onSelect?.(number, text);
  };

  const handleFootnoteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowFootnote(!showFootnote);
  };

  const hasFootnotes = footnotes && footnotes.length > 0;

  return (
    <span
      className={clsx(
        "verse-interactive relative inline",
        highlight && `verse-highlight verse-highlight-${highlight}`,
        isSelected && "verse-selected",
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Versnummer */}
      <sup className="verse-number">{number}</sup>

      {/* Verstext */}
      <span className="bible-text">{text}</span>

      {/* Fußnoten-Indikator */}
      {hasFootnotes && (
        <span
          ref={footnoteRef}
          className="relative inline"
        >
          <sup
            className="footnote-marker ml-0.5 cursor-pointer text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors select-none"
            onClick={handleFootnoteClick}
            onTouchEnd={handleFootnoteClick}
          >
            *
          </sup>

          {/* Fußnoten-Popup */}
          <AnimatePresence>
            {showFootnote && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 z-[9999] w-72 sm:w-80 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                  Fußnote zu Vers {number}
                </div>
                {footnotes?.map((note, index) => (
                  <p
                    key={index}
                    className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  >
                    {note}
                  </p>
                ))}
                <button
                  className="mt-2 text-xs text-[var(--accent)] hover:underline"
                  onClick={() => setShowFootnote(false)}
                >
                  Schließen
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      )}

      {/* Indikatoren */}
      {(hasNote || isBookmarked) && (
        <span className="inline-flex items-center gap-0.5 ml-1 align-super">
          {hasNote && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          )}
          {isBookmarked && (
            <svg
              className="w-3 h-3 text-[var(--accent)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          )}
        </span>
      )}

      {/* Leerzeichen nach dem Vers */}
      {" "}
    </span>
  );
}
