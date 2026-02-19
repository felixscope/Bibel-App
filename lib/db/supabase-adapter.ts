import { createClient } from "@/lib/supabase/client";
import type { Highlight, Note, Bookmark } from "../db";

/**
 * Supabase adapter that provides the same API as the Dexie db
 * This allows us to replace Dexie with Supabase without changing component code
 *
 * userId is passed from the dispatch layer (lib/db/index.ts) which gets it
 * from globalUserId set by AuthProvider. This avoids a network call to
 * supabase.auth.getUser() on every DB operation.
 */

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  userId: string,
  bookId: string,
  chapter: number,
  verse: number,
  color: Highlight["color"],
  translationId: string
): Promise<void> {
  const supabase = createClient();

  // Delete existing highlight for this verse + translation
  await supabase
    .from("highlights")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("verse", verse)
    .eq("translation_id", translationId);

  // Insert new highlight
  const { error } = await supabase.from("highlights").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse,
    color,
    translation_id: translationId,
  } as any);

  if (error) throw error;
}

export async function addHighlightsForVerses(
  userId: string,
  bookId: string,
  chapter: number,
  verses: number[],
  color: Highlight["color"],
  translationId: string
): Promise<void> {
  const supabase = createClient();

  // Delete existing highlights for these verses + translation
  for (const verse of verses) {
    await supabase
      .from("highlights")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .eq("chapter", chapter)
      .eq("verse", verse)
      .eq("translation_id", translationId);
  }

  // Insert new highlights
  const highlights = verses.map((verse) => ({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse,
    color,
    translation_id: translationId,
  }));

  const { error } = await supabase.from("highlights").insert(highlights as any);
  if (error) throw error;
}

export async function removeHighlight(
  userId: string,
  bookId: string,
  chapter: number,
  verse: number,
  translationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("highlights")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("verse", verse)
    .eq("translation_id", translationId);

  if (error) throw error;
}

export async function removeHighlightsForVerses(
  userId: string,
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  const supabase = createClient();

  for (const verse of verses) {
    const { error } = await supabase
      .from("highlights")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .eq("chapter", chapter)
      .eq("verse", verse)
      .eq("translation_id", translationId);

    if (error) throw error;
  }
}

export async function getHighlightsForChapter(
  userId: string,
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Highlight[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("translation_id", translationId);

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((h: any) => ({
    id: h.id,
    bookId: h.book_id,
    chapter: h.chapter,
    verse: h.verse,
    color: h.color as Highlight["color"],
    translationId: h.translation_id,
    createdAt: new Date(h.created_at),
  }));
}

// ==================== NOTES ====================

export async function addNote(
  userId: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  content: string,
  translationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("notes").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
    content,
    translation_id: translationId,
  } as any);

  if (error) throw error;
}

export async function updateNote(userId: string, id: string | number, content: string): Promise<void> {
  const supabase = createClient();

  // @ts-expect-error - Supabase client type inference issue with Database generic
  const { error } = await supabase.from("notes").update({ content, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function deleteNote(userId: string, id: string | number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getNotesForChapter(
  userId: string,
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Note[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("translation_id", translationId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((n: any) => ({
    id: n.id,
    bookId: n.book_id,
    chapter: n.chapter,
    verseStart: n.verse_start,
    verseEnd: n.verse_end,
    content: n.content,
    translationId: n.translation_id,
    createdAt: new Date(n.created_at),
    updatedAt: new Date(n.updated_at),
  }));
}

export async function getAllNotes(userId: string): Promise<Note[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((n: any) => ({
    id: n.id,
    bookId: n.book_id,
    chapter: n.chapter,
    verseStart: n.verse_start,
    verseEnd: n.verse_end,
    content: n.content,
    translationId: n.translation_id ?? "einheitsuebersetzung",
    createdAt: new Date(n.created_at),
    updatedAt: new Date(n.updated_at),
  }));
}

// ==================== BOOKMARKS ====================

export async function addBookmark(
  userId: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
    translation_id: translationId,
  } as any);

  if (error) throw error;
}

export async function deleteBookmark(userId: string, id: string | number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getBookmarksForChapter(
  userId: string,
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Bookmark[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("translation_id", translationId);

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((b: any) => ({
    id: b.id,
    bookId: b.book_id,
    chapter: b.chapter,
    verseStart: b.verse_start,
    verseEnd: b.verse_end,
    translationId: b.translation_id,
    createdAt: new Date(b.created_at),
  }));
}

export async function getAllBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((b: any) => ({
    id: b.id,
    bookId: b.book_id,
    chapter: b.chapter,
    verseStart: b.verse_start,
    verseEnd: b.verse_end,
    translationId: b.translation_id ?? "einheitsuebersetzung",
    createdAt: new Date(b.created_at),
  }));
}

export async function deleteBookmarksForVerses(
  userId: string,
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  const supabase = createClient();

  // Get all bookmarks for this chapter + translation
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("translation_id", translationId);

  if (!bookmarks) return;

  // Find bookmarks that overlap with selected verses
  const idsToDelete: string[] = [];
  for (const bookmark of bookmarks as any[]) {
    for (let v = bookmark.verse_start; v <= bookmark.verse_end; v++) {
      if (verses.includes(v)) {
        idsToDelete.push(bookmark.id);
        break;
      }
    }
  }

  // Delete matching bookmarks
  if (idsToDelete.length > 0) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .in("id", idsToDelete)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return `${bookId}-${chapter}-${verse}`;
}
