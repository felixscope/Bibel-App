import { Book, TRANSLATIONS, TranslationId } from "./types";

// Cache für geladene Bücher
const bookCache = new Map<string, Book>();

// Mapping von Buch-ID zu Testament
const bookTestament: Record<string, "old" | "new"> = {
  // Altes Testament
  genesis: "old", exodus: "old", leviticus: "old", numbers: "old", deuteronomy: "old",
  joshua: "old", judges: "old", ruth: "old", "1samuel": "old", "2samuel": "old",
  "1kings": "old", "2kings": "old", "1chronicles": "old", "2chronicles": "old",
  ezra: "old", nehemiah: "old", esther: "old", job: "old", psalms: "old",
  proverbs: "old", ecclesiastes: "old", songofsolomon: "old", isaiah: "old",
  jeremiah: "old", lamentations: "old", ezekiel: "old", daniel: "old",
  hosea: "old", joel: "old", amos: "old", obadiah: "old", jonah: "old",
  micah: "old", nahum: "old", habakkuk: "old", zephaniah: "old", haggai: "old",
  zechariah: "old", malachi: "old",
  // Apokryphen (Einheitsübersetzung)
  tobit: "old", judith: "old", "1maccabees": "old", "2maccabees": "old",
  wisdom: "old", sirach: "old", baruch: "old",
  // Neues Testament
  matthew: "new", mark: "new", luke: "new", john: "new", acts: "new",
  romans: "new", "1corinthians": "new", "2corinthians": "new", galatians: "new",
  ephesians: "new", philippians: "new", colossians: "new",
  "1thessalonians": "new", "2thessalonians": "new", "1timothy": "new",
  "2timothy": "new", titus: "new", philemon: "new", hebrews: "new",
  james: "new", "1peter": "new", "2peter": "new", "1john": "new",
  "2john": "new", "3john": "new", jude: "new", revelation: "new",
};

export async function loadBook(
  translationId: TranslationId,
  bookId: string
): Promise<Book | null> {
  const cacheKey = `${translationId}:${bookId}`;

  if (bookCache.has(cacheKey)) {
    return bookCache.get(cacheKey)!;
  }

  const translation = TRANSLATIONS[translationId];
  const testament = bookTestament[bookId];

  if (!testament) {
    console.error(`Unknown book: ${bookId}`);
    return null;
  }

  // TEMPORÄR: Nur NT-Bücher laden bis AT-Dateien korrigiert sind
  if (testament === "old") {
    console.warn(`AT book ${bookId} temporarily disabled - files need to be fixed`);
    return null;
  }

  // Da wir AT-Bücher oben blockieren, ist dies immer "NT"
  const folder = "NT";

  try {
    const module = await import(
      `@/data/bibel/${translation.folder}/${folder}/${bookId}.ts`
    );

    // Bücher mit Zahlen am Anfang (1kings, 2chronicles) haben "_" prefix im Export
    const exportName = bookId.match(/^\d/) ? `_${bookId}` : bookId;
    const book = module[exportName] as Book;

    if (book) {
      bookCache.set(cacheKey, book);
      return book;
    }

    return null;
  } catch (error) {
    console.error(`Failed to load book ${bookId} for ${translationId}:`, error);
    return null;
  }
}

export async function loadVorwort(translationId: TranslationId): Promise<string | null> {
  const translation = TRANSLATIONS[translationId];

  try {
    const module = await import(
      `@/data/bibel/${translation.folder}/vorwort.ts`
    );

    // Verschiedene Export-Namen: vorwort oder einleitung
    const text = module.vorwort || module.einleitung;

    if (typeof text === "string" && !text.includes("404")) {
      return text;
    }

    return null;
  } catch {
    return null;
  }
}

// Prüft ob ein Buch in einer Übersetzung verfügbar ist
export function isBookAvailable(translationId: TranslationId, bookId: string): boolean {
  // Apokryphen nur in Einheitsübersetzung
  const apocrypha = ["tobit", "judith", "1maccabees", "2maccabees", "wisdom", "sirach", "baruch"];

  if (apocrypha.includes(bookId)) {
    return translationId === "einheitsuebersetzung";
  }

  return bookId in bookTestament;
}

// Gibt alle verfügbaren Bücher für eine Übersetzung zurück
export function getAvailableBooks(translationId: TranslationId): string[] {
  return Object.keys(bookTestament).filter(bookId =>
    isBookAvailable(translationId, bookId)
  );
}
