"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAllNotes, deleteNote, updateNote, type Note } from "@/lib/db";
import { getBookById } from "@/lib/types";

export default function NotizenPage() {
  const notes = useLiveQuery(() => getAllNotes());
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSave = async () => {
    if (!editingNote?.id || !editContent.trim()) return;
    await updateNote(editingNote.id, editContent.trim());
    setEditingNote(null);
    setEditContent("");
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    setDeleteConfirm(null);
  };

  const getVerseLabel = (note: Note) => {
    const book = getBookById(note.bookId);
    const bookName = book?.name || note.bookId;
    const verseRange = note.verseStart === note.verseEnd
      ? `${note.verseStart}`
      : `${note.verseStart}-${note.verseEnd}`;
    return `${bookName} ${note.chapter}:${verseRange}`;
  };

  const getVerseLink = (note: Note) => {
    return `/lesen/${note.bookId}/${note.chapter}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="chapter-title text-3xl md:text-4xl text-[var(--text-primary)] mb-2">
            Meine Notizen
          </h1>
          <p className="text-[var(--text-muted)]">
            {notes?.length || 0} {notes?.length === 1 ? "Notiz" : "Notizen"} gespeichert
          </p>
        </header>

        {/* Notes List */}
        {!notes || notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              Noch keine Notizen
            </h3>
            <p className="text-[var(--text-muted)] mb-6">
              Wähle einen Vers aus und tippe auf "Notiz", um deine Gedanken festzuhalten.
            </p>
            <Link
              href="/lesen/genesis/1"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Zur Bibel
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 shadow-sm"
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={getVerseLink(note)}
                        className="text-sm font-medium text-[var(--accent)] hover:underline"
                      >
                        {getVerseLabel(note)}
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        title="Bearbeiten"
                      >
                        <svg
                          className="w-4 h-4 text-[var(--text-muted)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirm(note.id!)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Löschen"
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
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
                  </div>

                  {/* Note Content */}
                  <p className="text-[var(--text-primary)] whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {/* Go to Verse Button */}
                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <Link
                      href={getVerseLink(note)}
                      className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Zum Text springen
                    </Link>
                  </div>

                  {/* Delete Confirmation */}
                  <AnimatePresence>
                    {deleteConfirm === note.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-[var(--border)]"
                      >
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Notiz wirklich löschen?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            Abbrechen
                          </button>
                          <button
                            onClick={() => handleDelete(note.id!)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Löschen
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
            >
              {/* Backdrop */}
              <div
                onClick={() => setEditingNote(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-20 left-4 right-4 mx-auto max-w-lg bg-[var(--bg-elevated)] rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                  <div>
                    <h2 className="chapter-title text-xl text-[var(--text-primary)]">
                      Notiz bearbeiten
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">
                      {getVerseLabel(editingNote)}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-[var(--text-secondary)]"
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

                {/* Content */}
                <div className="p-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-40 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => setEditingNote(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!editContent.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Speichern
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
