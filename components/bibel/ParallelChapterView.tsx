"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSupabaseLiveQuery } from "@/hooks/useSupabaseLiveQuery";
import { VerseText } from "./VerseText";
import { VerseActionBar } from "./VerseActionBar";
import { NoteModal } from "./NoteModal";
import { BibleChat } from "./BibleChat";
import { SelectionProvider, useSelection } from "@/components/providers/SelectionProvider";
import {
  getHighlightsForChapter,
  getNotesForChapter,
  getBookmarksForChapter,
  type Highlight,
} from "@/lib/db/index";
import type { Verse, TranslationId } from "@/lib/types";

export interface ParallelChapterViewProps {
  bookId: string;
  chapterNumber: number;
  primaryVerses: Verse[];
  primaryBookName: string;
  primaryTranslationId: TranslationId;
  primaryTranslationName: string;
  secondaryVerses: Verse[];
  secondaryTranslationId: TranslationId;
  secondaryTranslationName: string;
}

function ParallelContent({
  bookId,
  chapterNumber,
  primaryVerses,
  primaryBookName,
  primaryTranslationId,
  primaryTranslationName,
  secondaryVerses,
  secondaryTranslationId,
  secondaryTranslationName,
}: ParallelChapterViewProps) {
  const { toggleVerse, isSelected, clearSelection, setContext, setActiveTranslation, translationId, getSelectedTexts } = useSelection();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setContext(bookId, chapterNumber, primaryTranslationId);
  }, [bookId, chapterNumber, primaryTranslationId, setContext]);

  // Primary translation queries
  const highlights1 = useSupabaseLiveQuery(
    () => getHighlightsForChapter(bookId, chapterNumber, primaryTranslationId),
    [bookId, chapterNumber, primaryTranslationId, refreshKey]
  );
  const notes1 = useSupabaseLiveQuery(
    () => getNotesForChapter(bookId, chapterNumber, primaryTranslationId),
    [bookId, chapterNumber, primaryTranslationId, refreshKey]
  );
  const bookmarks1 = useSupabaseLiveQuery(
    () => getBookmarksForChapter(bookId, chapterNumber, primaryTranslationId),
    [bookId, chapterNumber, primaryTranslationId, refreshKey]
  );

  // Secondary translation queries
  const highlights2 = useSupabaseLiveQuery(
    () => getHighlightsForChapter(bookId, chapterNumber, secondaryTranslationId),
    [bookId, chapterNumber, secondaryTranslationId, refreshKey]
  );
  const notes2 = useSupabaseLiveQuery(
    () => getNotesForChapter(bookId, chapterNumber, secondaryTranslationId),
    [bookId, chapterNumber, secondaryTranslationId, refreshKey]
  );
  const bookmarks2 = useSupabaseLiveQuery(
    () => getBookmarksForChapter(bookId, chapterNumber, secondaryTranslationId),
    [bookId, chapterNumber, secondaryTranslationId, refreshKey]
  );

  // Lookup maps — primary
  const highlightMap1 = new Map<number, Highlight["color"]>();
  highlights1?.forEach((h) => highlightMap1.set(h.verse, h.color));
  const noteVerses1 = new Set<number>();
  notes1?.forEach((n) => { for (let v = n.verseStart; v <= n.verseEnd; v++) noteVerses1.add(v); });
  const bookmarkVerses1 = new Set<number>();
  bookmarks1?.forEach((b) => { for (let v = b.verseStart; v <= b.verseEnd; v++) bookmarkVerses1.add(v); });

  // Lookup maps — secondary
  const highlightMap2 = new Map<number, Highlight["color"]>();
  highlights2?.forEach((h) => highlightMap2.set(h.verse, h.color));
  const noteVerses2 = new Set<number>();
  notes2?.forEach((n) => { for (let v = n.verseStart; v <= n.verseEnd; v++) noteVerses2.add(v); });
  const bookmarkVerses2 = new Set<number>();
  bookmarks2?.forEach((b) => { for (let v = b.verseStart; v <= b.verseEnd; v++) bookmarkVerses2.add(v); });

  // When switching columns, clear existing selection and activate new translation
  const handlePrimarySelect = useCallback((n: number, text: string) => {
    if (translationId !== primaryTranslationId) {
      clearSelection();
    }
    setActiveTranslation(primaryTranslationId);
    toggleVerse(n, text);
  }, [translationId, primaryTranslationId, clearSelection, setActiveTranslation, toggleVerse]);

  const handleSecondarySelect = useCallback((n: number, text: string) => {
    if (translationId !== secondaryTranslationId) {
      clearSelection();
    }
    setActiveTranslation(secondaryTranslationId);
    toggleVerse(n, text);
  }, [translationId, secondaryTranslationId, clearSelection, setActiveTranslation, toggleVerse]);

  const handleDataChange = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleClickOutside = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // VerseActionBar gets maps for the currently active translation
  const activeHighlightMap = translationId === primaryTranslationId ? highlightMap1 : highlightMap2;
  const activeBookmarkVerses = translationId === primaryTranslationId ? bookmarkVerses1 : bookmarkVerses2;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 py-12 md:py-16"
        onClick={handleClickOutside}
      >
        {/* Kapitelüberschrift */}
        <header className="mb-8 text-center">
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-2">
            {primaryBookName}
          </p>
          <h1 className="chapter-title text-4xl md:text-5xl text-[var(--text-primary)]">
            Kapitel {chapterNumber}
          </h1>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-px bg-[var(--border)]" />
          </div>
        </header>

        {/* Übersetzungs-Labels (nur auf Desktop, voll ausgeschrieben) */}
        <div className="hidden md:grid md:grid-cols-2 mb-4 pb-3 border-b border-[var(--border)]">
          <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            {primaryTranslationName}
          </div>
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider pl-6">
            {secondaryTranslationName}
          </div>
        </div>

        {/* Verse — auf Mobile gestapelt, auf Desktop nebeneinander */}
        <div className="bible-text text-[var(--text-primary)]">
          {primaryVerses.map((verse) => {
            const secVerse = secondaryVerses.find((v) => v.number === verse.number);
            return (
              <div key={verse.number} className="grid grid-cols-1 md:grid-cols-2 mb-3 md:mb-1">
                <div className="md:pr-6" onClick={(e) => e.stopPropagation()}>
                  <span className="md:hidden text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">{primaryTranslationName}</span>
                  <VerseText
                    number={verse.number}
                    text={verse.text}
                    heading={verse.heading}
                    footnotes={verse.footnotes}
                    highlight={highlightMap1.get(verse.number) || null}
                    hasNote={noteVerses1.has(verse.number)}
                    isBookmarked={bookmarkVerses1.has(verse.number)}
                    isSelected={translationId === primaryTranslationId && isSelected(verse.number)}
                    onSelect={handlePrimarySelect}
                  />
                </div>
                <div className="md:pl-6 md:border-l border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
                  {secVerse && (
                    <>
                    <span className="md:hidden text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{secondaryTranslationName}</span>
                    <VerseText
                      number={secVerse.number}
                      text={secVerse.text}
                      heading={secVerse.heading}
                      footnotes={secVerse.footnotes}
                      highlight={highlightMap2.get(secVerse.number) || null}
                      hasNote={noteVerses2.has(secVerse.number)}
                      isBookmarked={bookmarkVerses2.has(secVerse.number)}
                      isSelected={translationId === secondaryTranslationId && isSelected(secVerse.number)}
                      onSelect={handleSecondarySelect}
                    />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="flex justify-center">
            <p className="text-[var(--text-muted)] text-sm">{primaryVerses.length} Verse</p>
          </div>
        </footer>
      </motion.article>

      <VerseActionBar
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
        onHighlightChange={handleDataChange}
        currentHighlights={activeHighlightMap}
        currentBookmarks={activeBookmarkVerses}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSaved={handleDataChange}
      />

      {/* KI-Begleiter */}
      <BibleChat
        bookName={primaryBookName}
        chapterNumber={chapterNumber}
        selectedVerses={getSelectedTexts()}
      />
    </>
  );
}

export function ParallelChapterView(props: ParallelChapterViewProps) {
  return (
    <SelectionProvider
      initialBookId={props.bookId}
      initialChapter={props.chapterNumber}
      initialTranslationId={props.primaryTranslationId}
    >
      <ParallelContent {...props} />
    </SelectionProvider>
  );
}
