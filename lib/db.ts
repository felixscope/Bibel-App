import Dexie, { type EntityTable } from "dexie";

// Datentypen
export interface Highlight {
  id?: string | number; // string for Supabase UUID, number for Dexie
  bookId: string;
  chapter: number;
  verse: number;
  color: "yellow" | "green" | "blue" | "pink" | "orange";
  translationId: string;
  createdAt: Date;
}

export interface Note {
  id?: string | number; // string for Supabase UUID, number for Dexie
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  content: string;
  translationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id?: string | number; // string for Supabase UUID, number for Dexie
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  translationId: string;
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
    this.version(2).stores({
      highlights: "++id, bookId, chapter, verse, translationId, [bookId+chapter], [bookId+chapter+verse]",
      notes: "++id, bookId, chapter, verseStart, translationId, [bookId+chapter]",
      bookmarks: "++id, bookId, chapter, verseStart, translationId, [bookId+chapter], createdAt",
    });
  }
}

export const db = new BibelDatabase();

// ==================== HIGHLIGHTS ====================

export async function addHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  color: Highlight["color"],
  translationId: string
): Promise<void> {
  // Erst existierende Highlights für diesen Vers + Übersetzung löschen
  await db.highlights
    .where("[bookId+chapter+verse]")
    .equals([bookId, chapter, verse])
    .filter((h) => h.translationId === translationId)
    .delete();

  await db.highlights.add({
    bookId,
    chapter,
    verse,
    color,
    translationId,
    createdAt: new Date(),
  });
}

export async function addHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  color: Highlight["color"],
  translationId: string
): Promise<void> {
  // Erst existierende Highlights für diese Verse + Übersetzung löschen
  await db.highlights
    .where("[bookId+chapter+verse]")
    .anyOf(verses.map((v) => [bookId, chapter, v]))
    .filter((h) => h.translationId === translationId)
    .delete();

  // Neue Highlights hinzufügen
  const highlights: Highlight[] = verses.map((verse) => ({
    bookId,
    chapter,
    verse,
    color,
    translationId,
    createdAt: new Date(),
  }));

  await db.highlights.bulkAdd(highlights);
}

export async function removeHighlight(
  bookId: string,
  chapter: number,
  verse: number,
  translationId: string
): Promise<void> {
  await db.highlights
    .where("[bookId+chapter+verse]")
    .equals([bookId, chapter, verse])
    .filter((h) => h.translationId === translationId)
    .delete();
}

export async function removeHighlightsForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  await db.highlights
    .where("[bookId+chapter+verse]")
    .anyOf(verses.map((v) => [bookId, chapter, v]))
    .filter((h) => h.translationId === translationId)
    .delete();
}

export async function getHighlightsForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Highlight[]> {
  return db.highlights
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .filter((h) => h.translationId === translationId)
    .toArray();
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
  await db.notes.add({
    bookId,
    chapter,
    verseStart,
    verseEnd,
    content,
    translationId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateNote(
  id: string | number,
  content: string
): Promise<void> {
  if (typeof id === 'number') {
    await db.notes.update(id, {
      content,
      updatedAt: new Date(),
    });
  } else {
    throw new Error("Numeric ID required for Dexie operations");
  }
}

export async function deleteNote(id: string | number): Promise<void> {
  if (typeof id === 'number') {
    await db.notes.delete(id);
  } else {
    throw new Error("Numeric ID required for Dexie operations");
  }
}

export async function getNotesForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Note[]> {
  return db.notes
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .filter((n) => n.translationId === translationId)
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
  verseEnd: number,
  translationId: string
): Promise<void> {
  await db.bookmarks.add({
    bookId,
    chapter,
    verseStart,
    verseEnd,
    translationId,
    createdAt: new Date(),
  });
}

export async function deleteBookmark(id: string | number): Promise<void> {
  if (typeof id === 'number') {
    await db.bookmarks.delete(id);
  } else {
    throw new Error("Numeric ID required for Dexie operations");
  }
}

export async function getBookmarksForChapter(
  bookId: string,
  chapter: number,
  translationId: string
): Promise<Bookmark[]> {
  return db.bookmarks
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .filter((b) => b.translationId === translationId)
    .toArray();
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  return db.bookmarks.orderBy("createdAt").reverse().toArray();
}

export async function deleteBookmarksForVerses(
  bookId: string,
  chapter: number,
  verses: number[],
  translationId: string
): Promise<void> {
  // Finde und lösche alle Lesezeichen für diese Übersetzung, die die angegebenen Verse enthalten
  const bookmarks = await db.bookmarks
    .where("[bookId+chapter]")
    .equals([bookId, chapter])
    .filter((b) => b.translationId === translationId)
    .toArray();

  const idsToDelete: number[] = [];
  for (const bookmark of bookmarks) {
    // Prüfe ob mindestens ein Vers des Lesezeichens in der Auswahl ist
    for (let v = bookmark.verseStart; v <= bookmark.verseEnd; v++) {
      if (verses.includes(v)) {
        if (bookmark.id && typeof bookmark.id === 'number') {
          idsToDelete.push(bookmark.id);
        }
        break;
      }
    }
  }

  if (idsToDelete.length > 0) {
    await db.bookmarks.bulkDelete(idsToDelete);
  }
}

// ==================== UTILITY ====================

export function getVerseKey(bookId: string, chapter: number, verse: number): string {
  return `${bookId}-${chapter}-${verse}`;
}
