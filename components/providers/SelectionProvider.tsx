"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface VerseInfo {
  verse: number;
  text: string;
}

interface SelectionContextType {
  selectedVerses: Map<number, VerseInfo>;
  bookId: string;
  chapter: number;
  setContext: (bookId: string, chapter: number) => void;
  toggleVerse: (verse: number, text: string) => void;
  clearSelection: () => void;
  isSelected: (verse: number) => boolean;
  getSelectedVerseNumbers: () => number[];
  getSelectedTexts: () => { verse: number; text: string }[];
  getVerseRange: () => { start: number; end: number } | null;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}

interface SelectionProviderProps {
  children: ReactNode;
  initialBookId?: string;
  initialChapter?: number;
}

export function SelectionProvider({
  children,
  initialBookId = "",
  initialChapter = 1,
}: SelectionProviderProps) {
  const [selectedVerses, setSelectedVerses] = useState<Map<number, VerseInfo>>(new Map());
  const [bookId, setBookId] = useState(initialBookId);
  const [chapter, setChapter] = useState(initialChapter);

  const setContext = useCallback((newBookId: string, newChapter: number) => {
    setBookId(newBookId);
    setChapter(newChapter);
    setSelectedVerses(new Map()); // Clear selection when context changes
  }, []);

  const toggleVerse = useCallback((verse: number, text: string) => {
    setSelectedVerses((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(verse)) {
        newMap.delete(verse);
      } else {
        newMap.set(verse, { verse, text });
      }
      return newMap;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVerses(new Map());
  }, []);

  const isSelected = useCallback(
    (verse: number) => selectedVerses.has(verse),
    [selectedVerses]
  );

  const getSelectedVerseNumbers = useCallback(() => {
    return Array.from(selectedVerses.keys()).sort((a, b) => a - b);
  }, [selectedVerses]);

  const getSelectedTexts = useCallback(() => {
    return Array.from(selectedVerses.values()).sort((a, b) => a.verse - b.verse);
  }, [selectedVerses]);

  const getVerseRange = useCallback(() => {
    const verses = getSelectedVerseNumbers();
    if (verses.length === 0) return null;
    return { start: verses[0], end: verses[verses.length - 1] };
  }, [getSelectedVerseNumbers]);

  return (
    <SelectionContext.Provider
      value={{
        selectedVerses,
        bookId,
        chapter,
        setContext,
        toggleVerse,
        clearSelection,
        isSelected,
        getSelectedVerseNumbers,
        getSelectedTexts,
        getVerseRange,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
