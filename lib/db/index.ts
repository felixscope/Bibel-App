/**
 * Unified database interface that automatically switches between
 * Dexie (local storage) and Supabase (cloud sync) based on auth status
 */

import { createClient } from "@/lib/supabase/client";
import * as dexieDb from "../db";
import * as supabaseAdapter from "./supabase-adapter";

// Check if user is authenticated
async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
}

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  color: dexieDb.Highlight["color"]
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.addHighlight(bookId, chapter, verse, color);
  }
  return dexieDb.addHighlight(bookId, chapter, verse, color);
}

export async function addHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  color: dexieDb.Highlight["color"]
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.addHighlightsForVerses(bookId, chapter, verses, color);
  }
  return dexieDb.addHighlightsForVerses(bookId, chapter, verses, color);
}

export async function removeHighlight(
  bookId: string,
  chapter: number,
  verse: number
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.removeHighlight(bookId, chapter, verse);
  }
  return dexieDb.removeHighlight(bookId, chapter, verse);
}

export async function removeHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[]
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.removeHighlightsForVerses(bookId, chapter, verses);
  }
  return dexieDb.removeHighlightsForVerses(bookId, chapter, verses);
}

export async function getHighlightsForChapter(
  bookId: string,
  chapter: number
): Promise<dexieDb.Highlight[]> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.getHighlightsForChapter(bookId, chapter);
  }
  return dexieDb.getHighlightsForChapter(bookId, chapter);
}

// ==================== NOTES ====================

export async function addNote(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  content: string
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.addNote(bookId, chapter, verseStart, verseEnd, content);
  }
  return dexieDb.addNote(bookId, chapter, verseStart, verseEnd, content);
}

export async function updateNote(id: string | number, content: string): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.updateNote(id, content);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.updateNote(numericId, content);
}

export async function deleteNote(id: string | number): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteNote(id);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.deleteNote(numericId);
}

export async function getNotesForChapter(
  bookId: string,
  chapter: number
): Promise<dexieDb.Note[]> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.getNotesForChapter(bookId, chapter);
  }
  return dexieDb.getNotesForChapter(bookId, chapter);
}

export async function getAllNotes(): Promise<dexieDb.Note[]> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.getAllNotes();
  }
  return dexieDb.getAllNotes();
}

// ==================== BOOKMARKS ====================

export async function addBookmark(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.addBookmark(bookId, chapter, verseStart, verseEnd);
  }
  return dexieDb.addBookmark(bookId, chapter, verseStart, verseEnd);
}

export async function deleteBookmark(id: string | number): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteBookmark(id);
  }
  // DexieDB expects numeric IDs
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dexieDb.deleteBookmark(numericId);
}

export async function getBookmarksForChapter(
  bookId: string,
  chapter: number
): Promise<dexieDb.Bookmark[]> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.getBookmarksForChapter(bookId, chapter);
  }
  return dexieDb.getBookmarksForChapter(bookId, chapter);
}

export async function getAllBookmarks(): Promise<dexieDb.Bookmark[]> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.getAllBookmarks();
  }
  return dexieDb.getAllBookmarks();
}

export async function deleteBookmarksForVerses(
  bookId: string,
  chapter: number,
  verses: number[]
): Promise<void> {
  const authed = await isAuthenticated();
  if (authed) {
    return supabaseAdapter.deleteBookmarksForVerses(bookId, chapter, verses);
  }
  return dexieDb.deleteBookmarksForVerses(bookId, chapter, verses);
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return dexieDb.getVerseKey(bookId, chapter, verse);
}

// Re-export types
export type { Highlight, Note, Bookmark } from "../db";
