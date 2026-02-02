"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { searchBible, getVerseContext, type SearchResult } from "@/lib/search";
import { motion, AnimatePresence } from "framer-motion";

export default function SuchePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { translation } = useTranslation();
  const searchTimeout = useRef<NodeJS.Timeout>(null);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const searchResults = await searchBible(searchQuery, translation, {
          maxResults: 50,
        });
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [translation]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  return (
    <MainLayout>
      <TopBar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="chapter-title text-3xl text-[var(--text-primary)] mb-6">
          Suche
        </h1>

        {/* Suchfeld */}
        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="In der Bibel suchen..."
            className="w-full px-4 py-3 pl-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            autoFocus
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
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

          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Results count */}
        {hasSearched && !isSearching && (
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {results.length === 0
              ? "Keine Ergebnisse gefunden"
              : `${results.length} Ergebnis${results.length !== 1 ? "se" : ""} gefunden`}
          </p>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {results.map((result, index) => {
                const context = getVerseContext(
                  result.text,
                  result.matchStart,
                  result.matchEnd,
                  60
                );

                return (
                  <motion.div
                    key={`${result.bookId}-${result.chapter}-${result.verse}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Link
                      href={`/lesen/${result.bookId}/${result.chapter}`}
                      className="block p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)] transition-colors"
                    >
                      {/* Reference */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--accent)]">
                          {result.bookName} {result.chapter},{result.verse}
                        </span>
                      </div>

                      {/* Verse text with highlighted match */}
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        <span className="text-[var(--text-muted)]">{context.before}</span>
                        <span className="bg-[var(--accent-bg)] text-[var(--accent)] px-0.5 rounded font-medium">
                          {context.match}
                        </span>
                        <span className="text-[var(--text-muted)]">{context.after}</span>
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : !hasSearched ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--text-muted)]"
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
              </div>
              <p className="text-[var(--text-muted)]">
                Gib einen Suchbegriff ein, um in der Bibel zu suchen
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                Mindestens 2 Zeichen
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
