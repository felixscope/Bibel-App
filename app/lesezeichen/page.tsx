"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { getAllBookmarks, deleteBookmark, type Bookmark } from "@/lib/db";
import { getBookById } from "@/lib/types";

export default function LesezeichenPage() {
  const bookmarks = useLiveQuery(() => getAllBookmarks());
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteBookmark(id);
    setDeletingId(null);
  };

  const formatVerseRange = (bookmark: Bookmark) => {
    if (bookmark.verseStart === bookmark.verseEnd) {
      return `Vers ${bookmark.verseStart}`;
    }
    return `Verse ${bookmark.verseStart}-${bookmark.verseEnd}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Group bookmarks by book
  const groupedBookmarks = bookmarks?.reduce((acc, bookmark) => {
    const book = getBookById(bookmark.bookId);
    const bookName = book?.name || bookmark.bookId;
    if (!acc[bookName]) {
      acc[bookName] = [];
    }
    acc[bookName].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  return (
    <MainLayout>
      <TopBar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="chapter-title text-3xl text-[var(--text-primary)] mb-8">
          Lesezeichen
        </h1>

        {!bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-16">
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
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
            <p className="text-[var(--text-muted)] mb-2">
              Noch keine Lesezeichen vorhanden
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Tippe auf einen Vers und wähle &quot;Merken&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedBookmarks &&
              Object.entries(groupedBookmarks).map(([bookName, items]) => (
                <div key={bookName}>
                  <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
                    {bookName}
                  </h2>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {items.map((bookmark) => {
                        const book = getBookById(bookmark.bookId);
                        return (
                          <motion.div
                            key={bookmark.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="group"
                          >
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
                              <Link
                                href={`/lesen/${bookmark.bookId}/${bookmark.chapter}`}
                                className="flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0">
                                    <svg
                                      className="w-5 h-5 text-[var(--accent)]"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-[var(--text-primary)] truncate">
                                      {book?.shortName || bookmark.bookId} {bookmark.chapter}:{bookmark.verseStart}
                                      {bookmark.verseEnd !== bookmark.verseStart && `-${bookmark.verseEnd}`}
                                    </p>
                                    <p className="text-sm text-[var(--text-muted)]">
                                      {formatVerseRange(bookmark)} · {formatDate(bookmark.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                              <button
                                onClick={() => bookmark.id && handleDelete(bookmark.id)}
                                disabled={deletingId === bookmark.id}
                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-secondary)] transition-all"
                                title="Löschen"
                              >
                                <svg
                                  className="w-5 h-5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
