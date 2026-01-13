"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSelection } from "@/components/providers/SelectionProvider";
import { useToast } from "@/components/providers/ToastProvider";
import {
  addHighlightsForVerses,
  removeHighlightsForVerses,
  addBookmark,
  type Highlight,
} from "@/lib/db";
import { getBookById } from "@/lib/types";
import clsx from "clsx";

const HIGHLIGHT_COLORS: Highlight["color"][] = ["yellow", "green", "blue", "pink", "orange"];

const COLOR_CLASSES: Record<Highlight["color"], string> = {
  yellow: "bg-[#FEF9C3] border-[#EAB308]",
  green: "bg-[#DCFCE7] border-[#22C55E]",
  blue: "bg-[#DBEAFE] border-[#3B82F6]",
  pink: "bg-[#FCE7F3] border-[#EC4899]",
  orange: "bg-[#FFEDD5] border-[#F97316]",
};

interface VerseActionBarProps {
  onOpenNoteModal: () => void;
  onHighlightChange?: () => void;
  currentHighlights?: Map<number, Highlight["color"]>;
  currentBookmarks?: Set<number>;
}

export function VerseActionBar({
  onOpenNoteModal,
  onHighlightChange,
  currentHighlights = new Map(),
  currentBookmarks = new Set(),
}: VerseActionBarProps) {
  const {
    selectedVerses,
    bookId,
    chapter,
    clearSelection,
    getSelectedVerseNumbers,
    getSelectedTexts,
    getVerseRange,
  } = useSelection();

  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Client-side only
  if (typeof window !== "undefined" && !mounted) {
    setMounted(true);
  }

  const selectedCount = selectedVerses.size;
  const book = getBookById(bookId);
  const verseRange = getVerseRange();

  // Ermitteln, welche Farbe die ausgewählten Verse haben
  const getSelectedVersesColor = (): Highlight["color"] | null => {
    const verses = getSelectedVerseNumbers();
    if (verses.length === 0) return null;

    const firstColor = currentHighlights.get(verses[0]);
    if (!firstColor) return null;

    // Prüfe ob alle ausgewählten Verse die gleiche Farbe haben
    const allSameColor = verses.every((v) => currentHighlights.get(v) === firstColor);
    return allSameColor ? firstColor : null;
  };

  const selectedColor = getSelectedVersesColor();

  // Prüfe ob ausgewählte Verse bereits als Lesezeichen markiert sind
  const isBookmarked = (): boolean => {
    const verses = getSelectedVerseNumbers();
    if (verses.length === 0) return false;
    return verses.some((v) => currentBookmarks.has(v));
  };

  const versesAreBookmarked = isBookmarked();

  const handleHighlight = async (color: Highlight["color"]) => {
    const verses = getSelectedVerseNumbers();
    if (verses.length === 0) return;

    // Check if all selected verses already have this color
    const allHaveSameColor = verses.every(
      (v) => currentHighlights.get(v) === color
    );

    if (allHaveSameColor) {
      // Remove highlights
      await removeHighlightsForVerses(bookId, chapter, verses);
      showToast("Markierung entfernt", "remove");
    } else {
      // Add highlights
      await addHighlightsForVerses(bookId, chapter, verses, color);
      showToast("Markiert", "highlight");
    }

    onHighlightChange?.();
    clearSelection();
  };

  const handleBookmark = async () => {
    if (!verseRange) return;

    await addBookmark(bookId, chapter, verseRange.start, verseRange.end);
    showToast("Lesezeichen gespeichert", "bookmark");
    onHighlightChange?.();
    clearSelection();
  };

  const handleCopy = async () => {
    const texts = getSelectedTexts();
    if (texts.length === 0) return;

    const formattedText = texts
      .map((t) => `${t.verse} ${t.text}`)
      .join("\n");

    const reference =
      verseRange && book
        ? `\n\n— ${book.name} ${chapter}:${verseRange.start}${verseRange.end !== verseRange.start ? `-${verseRange.end}` : ""}`
        : "";

    try {
      await navigator.clipboard.writeText(formattedText + reference);
      showToast("Kopiert", "copy");
      clearSelection();
    } catch {
      showToast("Kopieren fehlgeschlagen", "remove");
    }
  };

  if (selectedCount === 0 || !mounted) return null;

  const actionBar = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 md:bottom-8 left-4 right-4 mx-auto max-w-md z-[9998]"
      >
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-lg p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {selectedCount} {selectedCount === 1 ? "Vers" : "Verse"} ausgewählt
            </span>
            <button
              onClick={clearSelection}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg
                className="w-5 h-5 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Farb-Buttons */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[var(--text-muted)] mr-1">Farbe:</span>
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleHighlight(color)}
                className={clsx(
                  "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
                  COLOR_CLASSES[color],
                  selectedColor === color && "ring-2 ring-offset-2 ring-[var(--accent)] scale-110"
                )}
                title={`${color} markieren`}
              >
                {selectedColor === color && (
                  <svg
                    className="w-full h-full p-1 text-[var(--text-primary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Aktions-Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNoteModal}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg
                className="w-4 h-4 text-[var(--text-secondary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Notiz
              </span>
            </button>

            <button
              onClick={handleBookmark}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors",
                versesAreBookmarked
                  ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                  : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <svg
                className={clsx("w-4 h-4", versesAreBookmarked ? "text-[var(--accent)]" : "text-[var(--text-secondary)]")}
                fill={versesAreBookmarked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
              <span className={clsx("text-sm font-medium", versesAreBookmarked ? "text-[var(--accent)]" : "text-[var(--text-primary)]")}>
                {versesAreBookmarked ? "Gemerkt" : "Merken"}
              </span>
            </button>

            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg
                className="w-4 h-4 text-[var(--text-secondary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Kopieren
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(actionBar, document.body);
}
