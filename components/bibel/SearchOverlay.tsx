"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getBookById, BIBLE_BOOKS, Book } from "@/lib/types";
import { loadBook } from "@/lib/bible-loader";
import { useTranslation } from "@/components/providers/TranslationProvider";

interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  matchStart: number;
  matchEnd: number;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadedBooks, setLoadedBooks] = useState<Map<string, Book>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { translation: translationId } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load NT books when overlay opens
  useEffect(() => {
    if (isOpen && loadedBooks.size === 0) {
      const loadNTBooks = async () => {
        const books = new Map<string, Book>();
        // Load only NT books
        for (const book of BIBLE_BOOKS.new) {
          const loaded = await loadBook(translationId, book.id);
          if (loaded) {
            books.set(book.id, loaded);
          }
        }
        setLoadedBooks(books);
      };
      loadNTBooks();
    }
  }, [isOpen, translationId, loadedBooks.size]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Search function - uses loaded books
  const searchBible = useCallback((searchQuery: string): SearchResult[] => {
    if (searchQuery.length < 2 || loadedBooks.size === 0) return [];

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];
    const maxResults = 50;

    for (const [bookId, bookData] of loadedBooks) {
      if (searchResults.length >= maxResults) break;

      const book = getBookById(bookId);
      const bookName = book?.name || bookId;

      for (const chapter of bookData.chapters) {
        if (searchResults.length >= maxResults) break;

        for (const verse of chapter.verses) {
          if (searchResults.length >= maxResults) break;

          const lowerText = verse.text.toLowerCase();
          const matchIndex = lowerText.indexOf(normalizedQuery);

          if (matchIndex !== -1) {
            searchResults.push({
              bookId,
              bookName,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
              matchStart: matchIndex,
              matchEnd: matchIndex + normalizedQuery.length,
            });
          }
        }
      }
    }

    return searchResults;
  }, [loadedBooks]);

  // Live search with debounce
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setResults(searchBible(query));
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, searchBible]);

  const handleResultClick = (result: SearchResult) => {
    router.push(`/lesen/${result.bookId}/${result.chapter}`);
    onClose();
  };

  // Highlight matched text
  const renderHighlightedText = (result: SearchResult) => {
    const { text, matchStart, matchEnd } = result;
    const before = text.slice(0, matchStart);
    const match = text.slice(matchStart, matchEnd);
    const after = text.slice(matchEnd);

    // Truncate long text
    const maxLength = 120;
    let displayBefore = before;
    let displayAfter = after;

    if (before.length > 40) {
      displayBefore = "..." + before.slice(-40);
    }
    if (after.length > maxLength - 40 - match.length) {
      displayAfter = after.slice(0, maxLength - 40 - match.length) + "...";
    }

    return (
      <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {displayBefore}
        <mark className="bg-[var(--accent-bg)] text-[var(--accent)] px-0.5 rounded font-medium">
          {match}
        </mark>
        {displayAfter}
      </span>
    );
  };

  if (!mounted) return null;

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-4 left-4 right-4 mx-auto max-w-2xl"
          >
            {/* Search Input */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]">
              <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
                <svg
                  className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Suche in der Bibel..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-lg outline-none"
                />
                {!query && (
                  <span className="hidden sm:inline text-xs text-[var(--text-muted)]/50 font-mono">
                    ⌘K
                  </span>
                )}
                {query && (
                  <button
                    onClick={() => setQuery("")}
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
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm text-[var(--text-muted)]"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loadedBooks.size === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-muted)]">
                      Lade Bibeltexte...
                    </p>
                  </div>
                ) : query.length < 2 ? (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-muted)]">
                      Gib mindestens 2 Zeichen ein...
                    </p>
                  </div>
                ) : isSearching ? (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-muted)]">
                      Suche...
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-muted)]">
                      Keine Ergebnisse für "{query}"
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    <div className="px-4 py-2 bg-[var(--bg-secondary)]">
                      <p className="text-xs text-[var(--text-muted)]">
                        {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"} gefunden
                      </p>
                    </div>
                    {results.map((result, index) => (
                      <motion.button
                        key={`${result.bookId}-${result.chapter}-${result.verse}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left p-4 hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="font-medium text-[var(--text-primary)]">
                            {result.bookName} {result.chapter}:{result.verse}
                          </span>
                          <span className="text-xs text-[var(--accent)] flex-shrink-0">
                            {result.bookName.length > 15 ? result.bookId : result.bookName}
                          </span>
                        </div>
                        {renderHighlightedText(result)}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
