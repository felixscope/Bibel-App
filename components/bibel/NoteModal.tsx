"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelection } from "@/components/providers/SelectionProvider";
import { addNote, updateNote, deleteNote, type Note } from "@/lib/db/index";
import { getBookById } from "@/lib/types";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNote?: Note | null;
  onSaved?: () => void;
}

export function NoteModal({ isOpen, onClose, existingNote, onSaved }: NoteModalProps) {
  const { bookId, chapter, getVerseRange, clearSelection } = useSelection();
  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const book = getBookById(bookId);
  const verseRange = getVerseRange();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setContent(existingNote?.content || "");
    }
  }, [isOpen, existingNote]);

  const getVerseLabel = () => {
    if (existingNote) {
      const existingBook = getBookById(existingNote.bookId);
      return `${existingBook?.name || existingNote.bookId} ${existingNote.chapter}:${existingNote.verseStart}${existingNote.verseEnd !== existingNote.verseStart ? `-${existingNote.verseEnd}` : ""}`;
    }
    if (!book || !verseRange) return "";
    return `${book.name} ${chapter}:${verseRange.start}${verseRange.end !== verseRange.start ? `-${verseRange.end}` : ""}`;
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      if (existingNote?.id) {
        await updateNote(existingNote.id, content.trim());
      } else if (verseRange) {
        await addNote(bookId, chapter, verseRange.start, verseRange.end, content.trim());
      }
      onSaved?.();
      clearSelection();
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNote?.id) return;

    setIsSaving(true);
    try {
      await deleteNote(existingNote.id);
      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  if (!mounted) return null;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
        >
          {/* Backdrop */}
          <div
            onClick={handleClose}
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
                  {existingNote ? "Notiz bearbeiten" : "Notiz hinzufügen"}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {getVerseLabel()}
                </p>
              </div>
              <button
                onClick={handleClose}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Schreibe deine Gedanken..."
                className="w-full h-40 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
              <div>
                {existingNote && (
                  <button
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                  >
                    Löschen
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  disabled={!content.trim() || isSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Speichern..." : "Speichern"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
