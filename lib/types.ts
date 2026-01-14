// Bibel-Datenstruktur
export interface Verse {
  number: number;
  text: string;
  footnotes?: string[];
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  shortName: string;
  chapters: Chapter[];
  testament: "old" | "new";
}

export interface BibleTranslation {
  id: string;
  name: string;
  shortName: string;
  language: string;
  books: Book[];
}

// Benutzer-Daten
export interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  color: "yellow" | "green" | "blue" | "pink" | "orange";
  createdAt: Date;
}

export interface Note {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapter: number;
  verse?: number;
  title?: string;
  createdAt: Date;
}

export interface ReadingProgress {
  id: string;
  planId: string;
  dayNumber: number;
  completed: boolean;
  completedAt?: Date;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  totalDays: number;
  readings: {
    day: number;
    passages: {
      bookId: string;
      startChapter: number;
      endChapter?: number;
      startVerse?: number;
      endVerse?: number;
    }[];
  }[];
}

// Einstellungen
export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl";
  fontFamily: "cormorant" | "serif" | "sans";
  lineHeight: "normal" | "relaxed" | "loose";
  showVerseNumbers: boolean;
  continuousReading: boolean;
}

// Bibelbuch-Metadaten (für Navigation)
export const BIBLE_BOOKS = {
  old: [
    { id: "genesis", name: "1. Mose (Genesis)", shortName: "1. Mose", chapters: 50 },
    { id: "exodus", name: "2. Mose (Exodus)", shortName: "2. Mose", chapters: 40 },
    { id: "leviticus", name: "3. Mose (Levitikus)", shortName: "3. Mose", chapters: 27 },
    { id: "numbers", name: "4. Mose (Numeri)", shortName: "4. Mose", chapters: 36 },
    { id: "deuteronomy", name: "5. Mose (Deuteronomium)", shortName: "5. Mose", chapters: 34 },
    { id: "joshua", name: "Josua", shortName: "Jos", chapters: 24 },
    { id: "judges", name: "Richter", shortName: "Ri", chapters: 21 },
    { id: "ruth", name: "Rut", shortName: "Rut", chapters: 4 },
    { id: "1samuel", name: "1. Samuel", shortName: "1. Sam", chapters: 31 },
    { id: "2samuel", name: "2. Samuel", shortName: "2. Sam", chapters: 24 },
    { id: "1kings", name: "1. Könige", shortName: "1. Kön", chapters: 22 },
    { id: "2kings", name: "2. Könige", shortName: "2. Kön", chapters: 25 },
    { id: "1chronicles", name: "1. Chronik", shortName: "1. Chr", chapters: 29 },
    { id: "2chronicles", name: "2. Chronik", shortName: "2. Chr", chapters: 36 },
    { id: "ezra", name: "Esra", shortName: "Esr", chapters: 10 },
    { id: "nehemiah", name: "Nehemia", shortName: "Neh", chapters: 13 },
    { id: "esther", name: "Ester", shortName: "Est", chapters: 10 },
    { id: "job", name: "Hiob", shortName: "Hi", chapters: 42 },
    { id: "psalms", name: "Psalmen", shortName: "Ps", chapters: 150 },
    { id: "proverbs", name: "Sprüche", shortName: "Spr", chapters: 31 },
    { id: "ecclesiastes", name: "Prediger", shortName: "Pred", chapters: 12 },
    { id: "songofsolomon", name: "Hohelied", shortName: "Hld", chapters: 8 },
    { id: "isaiah", name: "Jesaja", shortName: "Jes", chapters: 66 },
    { id: "jeremiah", name: "Jeremia", shortName: "Jer", chapters: 52 },
    { id: "lamentations", name: "Klagelieder", shortName: "Klgl", chapters: 5 },
    { id: "ezekiel", name: "Hesekiel", shortName: "Hes", chapters: 48 },
    { id: "daniel", name: "Daniel", shortName: "Dan", chapters: 12 },
    { id: "hosea", name: "Hosea", shortName: "Hos", chapters: 14 },
    { id: "joel", name: "Joel", shortName: "Joel", chapters: 4 },
    { id: "amos", name: "Amos", shortName: "Am", chapters: 9 },
    { id: "obadiah", name: "Obadja", shortName: "Obd", chapters: 1 },
    { id: "jonah", name: "Jona", shortName: "Jona", chapters: 4 },
    { id: "micah", name: "Micha", shortName: "Mi", chapters: 7 },
    { id: "nahum", name: "Nahum", shortName: "Nah", chapters: 3 },
    { id: "habakkuk", name: "Habakuk", shortName: "Hab", chapters: 3 },
    { id: "zephaniah", name: "Zefanja", shortName: "Zef", chapters: 3 },
    { id: "haggai", name: "Haggai", shortName: "Hag", chapters: 2 },
    { id: "zechariah", name: "Sacharja", shortName: "Sach", chapters: 14 },
    { id: "malachi", name: "Maleachi", shortName: "Mal", chapters: 3 },
  ],
  new: [
    { id: "matthew", name: "Matthäus", shortName: "Mt", chapters: 28 },
    { id: "mark", name: "Markus", shortName: "Mk", chapters: 16 },
    { id: "luke", name: "Lukas", shortName: "Lk", chapters: 24 },
    { id: "john", name: "Johannes", shortName: "Joh", chapters: 21 },
    { id: "acts", name: "Apostelgeschichte", shortName: "Apg", chapters: 28 },
    { id: "romans", name: "Römer", shortName: "Röm", chapters: 16 },
    { id: "1corinthians", name: "1. Korinther", shortName: "1. Kor", chapters: 16 },
    { id: "2corinthians", name: "2. Korinther", shortName: "2. Kor", chapters: 13 },
    { id: "galatians", name: "Galater", shortName: "Gal", chapters: 6 },
    { id: "ephesians", name: "Epheser", shortName: "Eph", chapters: 6 },
    { id: "philippians", name: "Philipper", shortName: "Phil", chapters: 4 },
    { id: "colossians", name: "Kolosser", shortName: "Kol", chapters: 4 },
    { id: "1thessalonians", name: "1. Thessalonicher", shortName: "1. Thess", chapters: 5 },
    { id: "2thessalonians", name: "2. Thessalonicher", shortName: "2. Thess", chapters: 3 },
    { id: "1timothy", name: "1. Timotheus", shortName: "1. Tim", chapters: 6 },
    { id: "2timothy", name: "2. Timotheus", shortName: "2. Tim", chapters: 4 },
    { id: "titus", name: "Titus", shortName: "Tit", chapters: 3 },
    { id: "philemon", name: "Philemon", shortName: "Phlm", chapters: 1 },
    { id: "hebrews", name: "Hebräer", shortName: "Hebr", chapters: 13 },
    { id: "james", name: "Jakobus", shortName: "Jak", chapters: 5 },
    { id: "1peter", name: "1. Petrus", shortName: "1. Petr", chapters: 5 },
    { id: "2peter", name: "2. Petrus", shortName: "2. Petr", chapters: 3 },
    { id: "1john", name: "1. Johannes", shortName: "1. Joh", chapters: 5 },
    { id: "2john", name: "2. Johannes", shortName: "2. Joh", chapters: 1 },
    { id: "3john", name: "3. Johannes", shortName: "3. Joh", chapters: 1 },
    { id: "jude", name: "Judas", shortName: "Jud", chapters: 1 },
    { id: "revelation", name: "Offenbarung", shortName: "Offb", chapters: 22 },
  ],
} as const;

export type BibleBookMeta = {
  id: string;
  name: string;
  shortName: string;
  chapters: number;
};

export function getBookById(id: string): BibleBookMeta | undefined {
  const allBooks = [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new];
  return allBooks.find((book) => book.id === id) as BibleBookMeta | undefined;
}

export function getBookIndex(id: string): number {
  const allBooks = [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new];
  return allBooks.findIndex((book) => book.id === id);
}
