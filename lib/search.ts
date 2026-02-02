import { loadBook, getAvailableBooks } from "./bible-loader";
import { TranslationId, getBookById } from "./types";

export interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  matchStart: number;
  matchEnd: number;
}

/**
 * Search the Bible for a query string
 * Returns matching verses with context
 */
export async function searchBible(
  query: string,
  translationId: TranslationId,
  options?: {
    maxResults?: number;
    bookFilter?: string[];
  }
): Promise<SearchResult[]> {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const results: SearchResult[] = [];
  const maxResults = options?.maxResults ?? 100;
  const availableBooks = options?.bookFilter ?? getAvailableBooks(translationId);

  // Search through each available book
  for (const bookId of availableBooks) {
    if (results.length >= maxResults) break;

    const book = await loadBook(translationId, bookId);
    if (!book) continue;

    const bookMeta = getBookById(bookId);
    const bookName = bookMeta?.name ?? book.name;

    // Search through each chapter
    for (const chapter of book.chapters) {
      if (results.length >= maxResults) break;

      // Search through each verse
      for (const verse of chapter.verses) {
        if (results.length >= maxResults) break;

        const normalizedText = verse.text.toLowerCase();
        const matchIndex = normalizedText.indexOf(normalizedQuery);

        if (matchIndex !== -1) {
          results.push({
            bookId,
            bookName,
            chapter: chapter.number,
            verse: verse.number,
            text: verse.text,
            matchStart: matchIndex,
            matchEnd: matchIndex + normalizedQuery.length,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Get surrounding context for a verse
 */
export function getVerseContext(
  text: string,
  matchStart: number,
  matchEnd: number,
  contextLength: number = 50
): { before: string; match: string; after: string } {
  const before = text.substring(Math.max(0, matchStart - contextLength), matchStart);
  const match = text.substring(matchStart, matchEnd);
  const after = text.substring(matchEnd, Math.min(text.length, matchEnd + contextLength));

  return {
    before: (matchStart > contextLength ? "..." : "") + before,
    match,
    after: after + (matchEnd + contextLength < text.length ? "..." : ""),
  };
}
