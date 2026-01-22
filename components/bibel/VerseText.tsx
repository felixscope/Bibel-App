"use client";

import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface VerseTextProps {
  number: number;
  text: string;
  heading?: string;
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
  heading,
  footnotes,
  highlight = null,
  hasNote = false,
  isBookmarked = false,
  isSelected = false,
  onSelect,
}: VerseTextProps) {
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number>(0);
  const scrollStartY = useRef<number>(0);
  const pendingTap = useRef<NodeJS.Timeout | null>(null);
  const footnoteRef = useRef<HTMLDivElement>(null);

  // Cleanup pending tap bei Unmount
  useEffect(() => {
    return () => {
      if (pendingTap.current) {
        clearTimeout(pendingTap.current);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Pending tap abbrechen, falls vorhanden
    if (pendingTap.current) {
      clearTimeout(pendingTap.current);
      pendingTap.current = null;
    }
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
    scrollStartY.current = window.scrollY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
    const touchDuration = Date.now() - touchStartTime.current;
    const scrollDelta = Math.abs(window.scrollY - scrollStartY.current);
    const capturedScrollY = window.scrollY;

    touchStartPos.current = null;
    touchStartTime.current = 0;

    // Grundlegende Bedingungen für einen potenziellen Tap:
    // - Max 2px Touch-Bewegung
    // - Max 200ms Dauer
    // - Kein Scrollen während der Berührung
    if (deltaX <= 2 && deltaY <= 2 && touchDuration < 200 && scrollDelta === 0) {
      e.preventDefault();

      // Verzögerte Bestätigung: Warten, ob Momentum-Scrolling einsetzt
      pendingTap.current = setTimeout(() => {
        const finalScrollDelta = Math.abs(window.scrollY - capturedScrollY);
        // Nur wenn auch nach der Verzögerung kein Scrollen stattfand
        if (finalScrollDelta === 0) {
          onSelect?.(number, text);
        }
        pendingTap.current = null;
      }, 80);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Auf Touch-Geräten wird handleTouchEnd verwendet
    if ("ontouchstart" in window) return;
    e.stopPropagation();
    onSelect?.(number, text);
  };

  const [activeFootnoteIndex, setActiveFootnoteIndex] = useState<number | null>(null);

  const handleFootnoteClick = (index: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveFootnoteIndex(activeFootnoteIndex === index ? null : index);
  };

  const hasFootnotes = footnotes && footnotes.length > 0;

  // Text mit Fußnoten-Markern und Schrägstrichen formatieren
  const formatText = (inputText: string) => {
    let processedText = inputText;
    const parts: React.ReactNode[] = [];

    // Zuerst Fußnoten-Marker verarbeiten
    if (hasFootnotes) {
      const asteriskPattern = /\*/g;
      const matches = [...processedText.matchAll(asteriskPattern)];

      if (matches.length > 0) {
        let lastIndex = 0;

        matches.forEach((match, idx) => {
          // Nur verarbeiten wenn es eine entsprechende Fußnote gibt
          if (idx < footnotes!.length) {
            // Text vor dem Stern
            const beforeText = processedText.substring(lastIndex, match.index);
            if (beforeText) {
              parts.push(beforeText);
            }

            // Fußnoten-Marker (ersetze * durch klickbaren Marker mit *)
            parts.push(
              <sup
                key={`footnote-${idx}`}
                className="footnote-marker ml-0.5 px-1 py-0.5 cursor-pointer text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors select-none text-sm"
                onClick={handleFootnoteClick(idx)}
                onTouchEnd={handleFootnoteClick(idx)}
              >
                *
              </sup>
            );

            lastIndex = match.index! + 1;
          }
        });

        // Restlichen Text
        const remainingText = processedText.substring(lastIndex);
        if (remainingText) {
          parts.push(remainingText);
        }

        return parts;
      }
    }

    // Kein Fußnoten-Marker gefunden, prüfe auf Schrägstriche für poetische Darstellung
    if (processedText.includes(" / ")) {
      const lines = processedText.split(" / ");
      return lines.map((line, index) => (
        <span key={`line-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ));
    }

    return processedText;
  };

  // Heading parsen: "Hauptüberschrift | Abschnittsüberschrift" oder nur eine Überschrift
  const renderHeading = () => {
    if (!heading) return null;

    const parts = heading.split(" | ");

    if (parts.length === 2) {
      // Beide Überschriften vorhanden
      return (
        <span className="block mt-8 mb-6">
          {/* Hauptüberschrift (h2-Style) */}
          <span className="block text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">
            {parts[0].trim()}
          </span>
          {/* Abschnittsüberschrift (h4-Style) */}
          <span className="block text-lg md:text-xl font-semibold text-[var(--text-secondary)]">
            {parts[1].trim()}
          </span>
        </span>
      );
    } else {
      // Nur eine Überschrift - als Abschnittsüberschrift behandeln
      return (
        <span className="block mt-6 mb-4">
          <span className="block text-lg md:text-xl font-semibold text-[var(--text-secondary)]">
            {heading}
          </span>
        </span>
      );
    }
  };

  return (
    <>
      {/* Überschriften - vor dem Vers */}
      {renderHeading()}

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
        <span className="bible-text">{formatText(text)}</span>

      {/* Fußnoten-Popup */}
      {hasFootnotes && activeFootnoteIndex !== null && (
        <AnimatePresence>
          <motion.div
            ref={footnoteRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-20 z-[9999] w-[calc(100vw-2rem)] max-w-md p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">
              Fußnote zu Vers {number}
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {footnotes[activeFootnoteIndex]}
            </p>
            <button
              className="mt-3 px-3 py-2 w-full text-sm text-[var(--accent)] hover:bg-[var(--accent-bg)] rounded-lg transition-colors font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFootnoteIndex(null);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveFootnoteIndex(null);
              }}
            >
              Schließen
            </button>
          </motion.div>
        </AnimatePresence>
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
    </>
  );
}
