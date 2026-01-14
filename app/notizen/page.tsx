"use client";

import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAllNotes, deleteNote, updateNote, type Note } from "@/lib/db";
import { getBookById } from "@/lib/types";
import { useToast } from "@/components/providers/ToastProvider";

// Importiere verfügbare Bibeldaten
import { genesis } from "@/data/bibel/genesis";
import { ruth } from "@/data/bibel/ruth";

const bibleData: Record<string, typeof genesis> = {
  genesis,
  ruth,
};

export default function NotizenPage() {
  const notes = useLiveQuery(() => getAllNotes());
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  // Gefilterte Notizen basierend auf Suche
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter((note) => {
      const book = getBookById(note.bookId);
      const bookName = book?.name || note.bookId;
      const verseText = getVerseText(note) || "";

      return (
        note.content.toLowerCase().includes(query) ||
        bookName.toLowerCase().includes(query) ||
        verseText.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery]);

  // Funktion um den Verstext für eine Notiz zu holen
  function getVerseText(note: Note): string | null {
    const bookData = bibleData[note.bookId];
    if (!bookData) return null;

    const chapter = bookData.chapters.find(c => c.number === note.chapter);
    if (!chapter) return null;

    const verses: string[] = [];
    for (let v = note.verseStart; v <= note.verseEnd; v++) {
      const verse = chapter.verses.find(vs => vs.number === v);
      if (verse) {
        verses.push(verse.text);
      }
    }

    return verses.length > 0 ? verses.join(" ") : null;
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSave = async () => {
    if (!editingNote?.id || !editContent.trim()) return;
    await updateNote(editingNote.id, editContent.trim());
    setEditingNote(null);
    setEditContent("");
    showToast("Notiz gespeichert", "check");
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    setDeleteConfirm(null);
    showToast("Notiz gelöscht", "remove");
  };

  const getVerseLabel = (note: Note) => {
    const book = getBookById(note.bookId);
    const bookName = book?.shortName || book?.name || note.bookId;
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
    });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <header className="mb-6">
          <h1 className="chapter-title text-2xl md:text-3xl text-[var(--text-primary)] mb-1">
            Meine Notizen
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {notes?.length || 0} {notes?.length === 1 ? "Notiz" : "Notizen"}
          </p>
        </header>

        {/* Suchfeld */}
        {notes && notes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <svg
                className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0"
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
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Notizen durchsuchen..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-[var(--text-muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-[var(--text-muted)] mt-2 px-1">
                {filteredNotes.length} {filteredNotes.length === 1 ? "Ergebnis" : "Ergebnisse"}
              </p>
            )}
          </div>
        )}

        {/* Notes List */}
        {!notes || notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--text-muted)]"
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
            <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
              Noch keine Notizen
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Wähle einen Vers aus und tippe auf "Notiz"
            </p>
            <Link
              href="/lesen/genesis/1"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Zur Bibel
            </Link>
          </motion.div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Keine Notizen gefunden für "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-sm"
                >
                  {/* Header mit Referenz und Buttons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={getVerseLink(note)}
                        className="text-xs font-medium text-[var(--accent)] hover:underline"
                      >
                        {getVerseLabel(note)}
                      </Link>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                        title="Bearbeiten"
                      >
                        <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(note.id!)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Löschen"
                      >
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                      <Link
                        href={getVerseLink(note)}
                        className="p-1.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                        title="Zum Vers"
                      >
                        <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Verstext - kompakt */}
                  {(() => {
                    const verseText = getVerseText(note);
                    return verseText ? (
                      <p className="text-[11px] text-[var(--text-muted)] italic mb-2 line-clamp-2">
                        "{verseText}"
                      </p>
                    ) : null;
                  })()}

                  {/* Notiz-Inhalt */}
                  <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap line-clamp-3">
                    {note.content}
                  </p>

                  {/* Delete Confirmation */}
                  <AnimatePresence>
                    {deleteConfirm === note.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-[var(--border)]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-secondary)]">Löschen?</span>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            Nein
                          </button>
                          <button
                            onClick={() => handleDelete(note.id!)}
                            className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Ja
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
              <div
                onClick={() => setEditingNote(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-20 left-4 right-4 mx-auto max-w-lg bg-[var(--bg-elevated)] rounded-xl shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
                  <div>
                    <h2 className="font-medium text-[var(--text-primary)]">Notiz bearbeiten</h2>
                    <p className="text-xs text-[var(--text-muted)]">{getVerseLabel(editingNote)}</p>
                  </div>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="p-1.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-32 p-2.5 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 p-3 border-t border-[var(--border)]">
                  <button
                    onClick={() => setEditingNote(null)}
                    className="px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!editContent.trim()}
                    className="px-3 py-1.5 rounded-lg text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
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
