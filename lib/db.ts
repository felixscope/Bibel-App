import Dexie, { type EntityTable } from "dexie";

// Datentypen
export interface Highlight {
  id?: number;
  bookId: string;
  chapter: number;
  verse: number;
  color: "yellow" | "green" | "blue" | "pink" | "orange";
  createdAt: Date;
}

export interface Note {
  id?: number;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id?: number;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  createdAt: Date;
}

// Datenbank-Klasse
class BibelDatabase extends Dexie {
  highlights!: EntityTable<Highlight, "id">;
  notes!: EntityTable<Note, "id">;
  bookmarks!: EntityTable<Bookmark, "id">;

  constructor() {
    super("BibelApp");
    this.version(1).stores({
      highlights: "++id, bookId, chapter, verse, [bookId+chapter], [bookId+chapter+verse]",
      notes: "++id, bookId, chapter, verseStart, [bookId+chapter]",
      bookmarks: "++id, bookId, chapter, verseStart, [bookId+chapter], createdAt",
    });
  }
}

export const db = new BibelDatabase();

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  color: Highlight["color"]
): Promise<void> {
  // Erst existierende Highlights für diesen Vers löschen
  await db.highlights
    .where({ bookId, chapter, verse })
    .delete();

  await db.highlights.add({
    bookId,
    chapter,
    verse,
    color,
    createdAt: new Date(),
  });
}

export async function addHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  color: Highlight["color"]
): Promise<void> {
  // Erst existierende Highlights für diese Verse löschen
  await db.highlights
    .where("[bookId+chapter+verse]")
    .anyOf(verses.map((v) => [bookId, chapter, v]))
    .delete();

  // Neue Highlights hinzufügen
  const highlights: Highlight[] = verses.map((verse) => ({
    bookId,
    chapter,
    verse,
    color,
    createdAt: new Date(),
  }));

  await db.highlights.bulkAdd(highlights);
}

export async function removeHighlight(
  bookId: string,
  chapter: number,
  verse: number
): Promise<void> {
  await db.highlights
    .where({ bookId, chapter, verse })
    .delete();
}

export async function removeHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[]
): Promise<void> {
  await db.highlights
    .where("[bookId+chapter+verse]")
    .anyOf(verses.map((v) => [bookId, chapter, v]))
    .delete();
}

export async function getHighlightsForChapter(
  bookId: string,
  chapter: number
): Promise<Highlight[]> {
  return db.highlights
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .toArray();
}

// ==================== NOTES ====================

export async function addNote(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  content: string
): Promise<void> {
  await db.notes.add({
    bookId,
    chapter,
    verseStart,
    verseEnd,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateNote(
  id: number,
  content: string
): Promise<void> {
  await db.notes.update(id, {
    content,
    updatedAt: new Date(),
  });
}

export async function deleteNote(id: number): Promise<void> {
  await db.notes.delete(id);
}

export async function getNotesForChapter(
  bookId: string,
  chapter: number
): Promise<Note[]> {
  return db.notes
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .toArray();
}

export async function getAllNotes(): Promise<Note[]> {
  return db.notes.toArray();
}

// ==================== BOOKMARKS ====================

export async function addBookmark(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number
): Promise<void> {
  await db.bookmarks.add({
    bookId,
    chapter,
    verseStart,
    verseEnd,
    createdAt: new Date(),
  });
}

export async function deleteBookmark(id: number): Promise<void> {
  await db.bookmarks.delete(id);
}

export async function getBookmarksForChapter(
  bookId: string,
  chapter: number
): Promise<Bookmark[]> {
  return db.bookmarks
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .toArray();
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  return db.bookmarks.orderBy("createdAt").reverse().toArray();
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return `${bookId}-${chapter}-${verse}`;
}
