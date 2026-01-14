"use client";

import { useRef } from "react";
import clsx from "clsx";

interface VerseTextProps {
  number: number;
  text: string;
  highlight?: "yellow" | "green" | "blue" | "pink" | "orange" | null;
  hasNote?: boolean;
  isBookmarked?: boolean;
  isSelected?: boolean;
  onSelect?: (verseNumber: number, text: string) => void;
}

export function VerseText({
  number,
  text,
  highlight = null,
  hasNote = false,
  isBookmarked = false,
  isSelected = false,
  onSelect,
}: VerseTextProps) {
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

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
