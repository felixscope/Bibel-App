/**
 * Simple reading history stored in localStorage
 */

export interface ReadingPosition {
  bookId: string;
  bookName: string;
  chapter: number;
  timestamp: number;
}

const STORAGE_KEY = "bibel-app-reading-history";
const MAX_HISTORY = 5;

/**
 * Get the reading history from localStorage
 */
export function getReadingHistory(): ReadingPosition[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Get the last reading position
 */
export function getLastReadingPosition(): ReadingPosition | null {
  const history = getReadingHistory();
  return history.length > 0 ? history[0] : null;
}

/**
 * Save a reading position to history
 */
export function saveReadingPosition(bookId: string, bookName: string, chapter: number): void {
  if (typeof window === "undefined") return;

  try {
    const history = getReadingHistory();

    // Remove duplicate if exists
    const filtered = history.filter(
      (pos) => !(pos.bookId === bookId && pos.chapter === chapter)
    );

    // Add new position at the beginning
    const newPosition: ReadingPosition = {
      bookId,
      bookName,
      chapter,
      timestamp: Date.now(),
    };

    const updated = [newPosition, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear reading history
 */
export function clearReadingHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
