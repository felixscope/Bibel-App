import { createClient } from "@/lib/supabase/client";
import type { Highlight, Note, Bookmark } from "../db";

/**
 * Supabase adapter that provides the same API as the Dexie db
 * This allows us to replace Dexie with Supabase without changing component code
 */

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user.id;
}

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  color: Highlight["color"]
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // Delete existing highlight for this verse
  await supabase
    .from("highlights")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("verse", verse);

  // Insert new highlight
  const { error } = await supabase.from("highlights").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse,
    color,
  } as any);

  if (error) throw error;
}

export async function addHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  color: Highlight["color"]
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // Delete existing highlights for these verses
  for (const verse of verses) {
    await supabase
      .from("highlights")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .eq("chapter", chapter)
      .eq("verse", verse);
  }

  // Insert new highlights
  const highlights = verses.map((verse) => ({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse,
    color,
  }));

  const { error } = await supabase.from("highlights").insert(highlights as any);
  if (error) throw error;
}

export async function removeHighlight(
  bookId: string,
  chapter: number,
  verse: number
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("highlights")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("verse", verse);

  if (error) throw error;
}

export async function removeHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[]
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  for (const verse of verses) {
    await supabase
      .from("highlights")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .eq("chapter", chapter)
      .eq("verse", verse);
  }
}

export async function getHighlightsForChapter(
  bookId: string,
  chapter: number
): Promise<Highlight[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter);

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((h: any) => ({
    id: h.id,
    bookId: h.book_id,
    chapter: h.chapter,
    verse: h.verse,
    color: h.color as Highlight["color"],
    createdAt: new Date(h.created_at),
  }));
}

// ==================== NOTES ====================

export async function addNote(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  content: string
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("notes").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
    content,
  } as any);

  if (error) throw error;
}

export async function updateNote(id: string | number, content: string): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // @ts-expect-error - Supabase client type inference issue with Database generic
  const { error } = await supabase.from("notes").update({ content, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function deleteNote(id: string | number): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getNotesForChapter(
  bookId: string,
  chapter: number
): Promise<Note[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter)
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
    createdAt: new Date(n.created_at),
    updatedAt: new Date(n.updated_at),
  }));
}

export async function getAllNotes(): Promise<Note[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

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
    createdAt: new Date(n.created_at),
    updatedAt: new Date(n.updated_at),
  }));
}

// ==================== BOOKMARKS ====================

export async function addBookmark(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    book_id: bookId,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
  } as any);

  if (error) throw error;
}

export async function deleteBookmark(id: string | number): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getBookmarksForChapter(
  bookId: string,
  chapter: number
): Promise<Bookmark[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter);

  if (error) throw error;

  // Convert Supabase format to app format
  return (data || []).map((b: any) => ({
    id: b.id,
    bookId: b.book_id,
    chapter: b.chapter,
    verseStart: b.verse_start,
    verseEnd: b.verse_end,
    createdAt: new Date(b.created_at),
  }));
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

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
    createdAt: new Date(b.created_at),
  }));
}

export async function deleteBookmarksForVerses(
  bookId: string,
  chapter: number,
  verses: number[]
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // Get all bookmarks for this chapter
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("chapter", chapter);

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
    await supabase
      .from("bookmarks")
      .delete()
      .in("id", idsToDelete)
      .eq("user_id", userId);
  }
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return `${bookId}-${chapter}-${verse}`;
}
