"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSupabaseLiveQuery } from "@/hooks/useSupabaseLiveQuery";
import { VerseText } from "./VerseText";
import { VerseActionBar } from "./VerseActionBar";
import { NoteModal } from "./NoteModal";
import { BookIntroduction } from "./BookIntroduction";
import { SelectionProvider, useSelection } from "@/components/providers/SelectionProvider";
import {
  getHighlightsForChapter,
  getNotesForChapter,
  getBookmarksForChapter,
  type Highlight,
  type Note,
  type Bookmark,
} from "@/lib/db/index";
import type { Verse } from "@/lib/types";

interface ChapterViewProps {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
  introduction?: string;
}

function ChapterContent({
  bookId,
  bookName,
  chapterNumber,
  verses,
  introduction,
}: ChapterViewProps) {
  const { toggleVerse, isSelected, clearSelection, setContext } = useSelection();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Set context when chapter changes
  useEffect(() => {
    setContext(bookId, chapterNumber);
  }, [bookId, chapterNumber, setContext]);

  // Load data with live updates (works with both Dexie and Supabase)
  const highlights = useSupabaseLiveQuery(
    () => getHighlightsForChapter(bookId, chapterNumber),
    [bookId, chapterNumber, refreshKey]
  );

  const notes = useSupabaseLiveQuery(
    () => getNotesForChapter(bookId, chapterNumber),
    [bookId, chapterNumber, refreshKey]
  );

  const bookmarks = useSupabaseLiveQuery(
    () => getBookmarksForChapter(bookId, chapterNumber),
    [bookId, chapterNumber, refreshKey]
  );

  // Build lookup maps
  const highlightMap = new Map<number, Highlight["color"]>();
  highlights?.forEach((h) => highlightMap.set(h.verse, h.color));

  const noteVerses = new Set<number>();
  notes?.forEach((n) => {
    for (let v = n.verseStart; v <= n.verseEnd; v++) {
      noteVerses.add(v);
    }
  });

  const bookmarkVerses = new Set<number>();
  bookmarks?.forEach((b) => {
    for (let v = b.verseStart; v <= b.verseEnd; v++) {
      bookmarkVerses.add(v);
    }
  });

  const handleVerseSelect = useCallback(
    (verseNumber: number, text: string) => {
      toggleVerse(verseNumber, text);
    },
    [toggleVerse]
  );

  const handleDataChange = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleClickOutside = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-6 py-12 md:py-16"
        onClick={handleClickOutside}
      >
        {/* Kapitelüberschrift */}
        <header className="mb-12 text-center">
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-2">
            {bookName}
          </p>
          <h1 className="chapter-title text-4xl md:text-5xl text-[var(--text-primary)]">
            Kapitel {chapterNumber}
          </h1>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-px bg-[var(--border)]" />
          </div>
        </header>

        {/* Bucheinleitung - nur bei Kapitel 1 */}
        {chapterNumber === 1 && introduction && (
          <BookIntroduction introduction={introduction} bookName={bookName} />
        )}

        {/* Bibeltext */}
        <div className="bible-text leading-relaxed text-[var(--text-primary)]">
          {verses.map((verse) => (
            <VerseText
              key={verse.number}
              number={verse.number}
              text={verse.text}
              heading={verse.heading}
              footnotes={verse.footnotes}
              highlight={highlightMap.get(verse.number) || null}
              hasNote={noteVerses.has(verse.number)}
              isBookmarked={bookmarkVerses.has(verse.number)}
              isSelected={isSelected(verse.number)}
              onSelect={handleVerseSelect}
            />
          ))}
        </div>

        {/* Kapitel-Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="flex justify-center">
            <p className="text-[var(--text-muted)] text-sm">
              {verses.length} Verse
            </p>
          </div>
        </footer>
      </motion.article>

      {/* ActionBar */}
      <VerseActionBar
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
        onHighlightChange={handleDataChange}
        currentHighlights={highlightMap}
        currentBookmarks={bookmarkVerses}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSaved={handleDataChange}
      />
    </>
  );
}

export function ChapterView(props: ChapterViewProps) {
  return (
    <SelectionProvider initialBookId={props.bookId} initialChapter={props.chapterNumber}>
      <ChapterContent {...props} />
    </SelectionProvider>
  );
}
