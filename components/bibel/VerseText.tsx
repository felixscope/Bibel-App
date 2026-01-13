"use client";

import clsx from "clsx";

interface VerseTextProps {
  number: number;
  text: string;
  isFirst?: boolean;
  highlight?: "yellow" | "green" | "blue" | "pink" | "orange" | null;
  hasNote?: boolean;
  isBookmarked?: boolean;
  isSelected?: boolean;
  onSelect?: (verseNumber: number, text: string) => void;
}

export function VerseText({
  number,
  text,
  isFirst = false,
  highlight = null,
  hasNote = false,
  isBookmarked = false,
  isSelected = false,
  onSelect,
}: VerseTextProps) {
  // Illuminierte Initiale für den ersten Vers
  const renderText = () => {
    if (isFirst && text.length > 0) {
      const firstChar = text[0];
      const restText = text.slice(1);
      return (
        <>
          <span className="drop-cap">{firstChar}</span>
          {restText}
        </>
      );
    }
    return text;
  };

  return (
    <span
      className={clsx(
        "verse-interactive relative inline",
        highlight && `verse-highlight verse-highlight-${highlight}`,
        isSelected && "verse-selected",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(number, text);
      }}
    >
      {/* Versnummer */}
      <sup className="verse-number">{number}</sup>

      {/* Verstext */}
      <span className="bible-text">{renderText()}</span>

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

      {/* Selection-Indikator */}
      {isSelected && (
        <span className="absolute -left-1 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />
      )}

      {/* Leerzeichen nach dem Vers */}
      {" "}
    </span>
  );
}
