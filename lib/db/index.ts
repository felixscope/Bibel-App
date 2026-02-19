/**
 * Unified database interface that automatically switches between
 * Dexie (local storage) and Supabase (cloud sync) based on auth status
 *
 * IMPORTANT: userId is passed from components (from useAuth hook) to avoid
 * calling getSession() which can hang due to Supabase SSR issues.
 */

import * as dexieDb from "../db";
import * as supabaseAdapter from "./supabase-adapter";

// Global auth state - set by AuthProvider, read by DB functions
let globalUserId: string | null = null;

export function setGlobalUserId(userId: string | null): void {
  globalUserId = userId;
}

export function getGlobalUserId(): string | null {
  return globalUserId;
}

// Check if user is authenticated using global state (no async needed)
function isAuthenticated(): boolean {
  return !!globalUserId;
}

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  color: dexieDb.Highlight["color"],
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.addHighlight(globalUserId!, bookId, chapter, verse, color, translationId);
  }
  return dexieDb.addHighlight(bookId, chapter, verse, color, translationId);
}

export async function addHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  color: dexieDb.Highlight["color"],
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.addHighlightsForVerses(globalUserId!, bookId, chapter, verses, color, translationId);
  }
  return dexieDb.addHighlightsForVerses(bookId, chapter, verses, color, translationId);
}

export async function removeHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.removeHighlight(globalUserId!, bookId, chapter, verse, translationId);
  }
  return dexieDb.removeHighlight(bookId, chapter, verse, translationId);
}

export async function removeHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.removeHighlightsForVerses(globalUserId!, bookId, chapter, verses, translationId);
  }
  return dexieDb.removeHighlightsForVerses(bookId, chapter, verses, translationId);
}

export async function getHighlightsForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<dexieDb.Highlight[]> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.getHighlightsForChapter(globalUserId!, bookId, chapter, translationId);
  }
  return dexieDb.getHighlightsForChapter(bookId, chapter, translationId);
}

// ==================== NOTES ====================

export async function addNote(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  content: string,
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.addNote(globalUserId!, bookId, chapter, verseStart, verseEnd, content, translationId);
  }
  return dexieDb.addNote(bookId, chapter, verseStart, verseEnd, content, translationId);
}

export async function updateNote(id: string | number, content: string): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.updateNote(globalUserId!, id, content);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.updateNote(numericId, content);
}

export async function deleteNote(id: string | number): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteNote(globalUserId!, id);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.deleteNote(numericId);
}

export async function getNotesForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<dexieDb.Note[]> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.getNotesForChapter(globalUserId!, bookId, chapter, translationId);
  }
  return dexieDb.getNotesForChapter(bookId, chapter, translationId);
}

export async function getAllNotes(): Promise<dexieDb.Note[]> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.getAllNotes(globalUserId!);
  }
  return dexieDb.getAllNotes();
}

// ==================== BOOKMARKS ====================

export async function addBookmark(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.addBookmark(globalUserId!, bookId, chapter, verseStart, verseEnd, translationId);
  }
  return dexieDb.addBookmark(bookId, chapter, verseStart, verseEnd, translationId);
}

export async function deleteBookmark(id: string | number): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteBookmark(globalUserId!, id);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.deleteBookmark(numericId);
}

export async function getBookmarksForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<dexieDb.Bookmark[]> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.getBookmarksForChapter(globalUserId!, bookId, chapter, translationId);
  }
  return dexieDb.getBookmarksForChapter(bookId, chapter, translationId);
}

export async function getAllBookmarks(): Promise<dexieDb.Bookmark[]> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.getAllBookmarks(globalUserId!);
  }
  return dexieDb.getAllBookmarks();
}

export async function deleteBookmarksForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  const authed = isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteBookmarksForVerses(globalUserId!, bookId, chapter, verses, translationId);
  }
  return dexieDb.deleteBookmarksForVerses(bookId, chapter, verses, translationId);
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return dexieDb.getVerseKey(bookId, chapter, verse);
}

// Re-export types
export type { Highlight, Note, Bookmark } from "../db";
