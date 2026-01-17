"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BIBLE_BOOKS } from "@/lib/types";
import clsx from "clsx";

interface BookSelectorProps {
  currentBookId?: string;
  currentChapter?: number;
}

// TEMPORÄR: AT deaktiviert bis Dateien korrigiert sind
const AT_TEMPORARILY_DISABLED = true;

export function BookSelector({ currentBookId, currentChapter }: BookSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTestament, setActiveTestament] = useState<"old" | "new">("new"); // Default: NT
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentBook = [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new].find(
    (b) => b.id === currentBookId
  );

  const books = activeTestament === "old" ? BIBLE_BOOKS.old : BIBLE_BOOKS.new;
  const selectedBookData = books.find((b) => b.id === selectedBook);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedBook(null);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
        >
          {/* Backdrop - klickbar zum Schließen */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 left-4 right-4 mx-auto max-w-lg bg-[var(--bg-elevated)] rounded-2xl shadow-xl overflow-hidden"
            style={{ maxHeight: "calc(100vh - 6rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="chapter-title text-xl text-[var(--text-primary)]">
                {selectedBook ? "Kapitel wählen" : "Buch wählen"}
              </h2>
              <button
                onClick={() => {
                  if (selectedBook) {
                    setSelectedBook(null);
                  } else {
                    closeModal();
                  }
                }}
                className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                {selectedBook ? (
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Testament Tabs */}
            {!selectedBook && (
              <div className="flex gap-2 p-4 border-b border-[var(--border)]">
                <button
                  onClick={() => !AT_TEMPORARILY_DISABLED && setActiveTestament("old")}
                  disabled={AT_TEMPORARILY_DISABLED}
                  className={clsx(
                    "flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors text-sm",
                    AT_TEMPORARILY_DISABLED && "opacity-50 cursor-not-allowed",
                    activeTestament === "old"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  )}
                  title={AT_TEMPORARILY_DISABLED ? "Altes Testament wird noch vorbereitet" : undefined}
                >
                  Altes Testament
                </button>
                <button
                  onClick={() => setActiveTestament("new")}
                  className={clsx(
                    "flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors text-sm",
                    activeTestament === "new"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  Neues Testament
                </button>
              </div>
            )}

            {/* Content */}
            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 16rem)" }}
            >
              <AnimatePresence mode="wait">
                {selectedBook && selectedBookData ? (
                  <motion.div
                    key="chapters"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-6 gap-2"
                  >
                    {Array.from({ length: selectedBookData.chapters }, (_, i) => i + 1).map(
                      (chapter) => (
                        <Link
                          key={chapter}
                          href={`/lesen/${selectedBook}/${chapter}`}
                          onClick={closeModal}
                          className={clsx(
                            "aspect-square flex items-center justify-center rounded-lg font-medium transition-all hover:scale-105 text-sm",
                            currentBookId === selectedBook && currentChapter === chapter
                              ? "bg-[var(--accent)] text-white"
                              : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                          )}
                        >
                          {chapter}
                        </Link>
                      )
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="books"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    {books.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => setSelectedBook(book.id)}
                        className={clsx(
                          "w-full flex items-center justify-between py-3 px-4 rounded-lg text-left transition-colors",
                          currentBookId === book.id
                            ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                            : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                        )}
                      >
                        <span className="font-medium text-sm">{book.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {book.chapters} Kap.
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)] transition-colors"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <span className="font-medium text-[var(--text-primary)]">
          {currentBook ? `${currentBook.shortName} ${currentChapter}` : "Buch wählen"}
        </span>
        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Modal via Portal - wird direkt in body gerendert */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
