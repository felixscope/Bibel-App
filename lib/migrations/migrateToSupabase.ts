import { db as dexieDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import type { HighlightInsert, NoteInsert, BookmarkInsert } from "@/lib/supabase/types";

const MIGRATION_FLAG_KEY = "supabase_migration_completed";
const BATCH_SIZE = 100;

/**
 * Migrates all local Dexie data to Supabase for a given user
 * This runs once after first login and then deletes local data
 */
export async function migrateLocalDataToSupabase(userId: string): Promise<void> {
  // Check if migration already completed
  const migrationCompleted = localStorage.getItem(`${MIGRATION_FLAG_KEY}_${userId}`);
  if (migrationCompleted === "true") {
    console.log("Migration already completed for user", userId);
    return;
  }

  console.log("Starting migration to Supabase for user", userId);

  const supabase = createClient();

  try {
    // 1. Migrate Highlights
    await migrateHighlights(userId, supabase);

    // 2. Migrate Notes
    await migrateNotes(userId, supabase);

    // 3. Migrate Bookmarks
    await migrateBookmarks(userId, supabase);

    // 4. Clear local Dexie data
    await clearLocalData();

    // 5. Mark migration as completed
    localStorage.setItem(`${MIGRATION_FLAG_KEY}_${userId}`, "true");

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error; // Will be retried on next login
  }
}

async function migrateHighlights(userId: string, supabase: ReturnType<typeof createClient>) {
  const localHighlights = await dexieDb.highlights.toArray();

  if (localHighlights.length === 0) {
    console.log("No highlights to migrate");
    return;
  }

  console.log(`Migrating ${localHighlights.length} highlights...`);

  // Convert Dexie highlights to Supabase format
  const supabaseHighlights: HighlightInsert[] = localHighlights.map((h) => ({
    user_id: userId,
    book_id: h.bookId,
    chapter: h.chapter,
    verse: h.verse,
    color: h.color,
    created_at: h.createdAt.toISOString(),
  }));

  // Insert in batches
  for (let i = 0; i < supabaseHighlights.length; i += BATCH_SIZE) {
    const batch = supabaseHighlights.slice(i, i + BATCH_SIZE);
    // @ts-expect-error - Supabase client type inference issue with Database generic
    const { error } = await supabase.from("highlights").insert(batch);

    if (error) {
      // If duplicate key error (user already has this highlight), continue
      if (error.code === "23505") {
        console.warn("Some highlights already exist, skipping duplicates");
        continue;
      }
      throw error;
    }
  }

  console.log("Highlights migrated successfully");
}

async function migrateNotes(userId: string, supabase: ReturnType<typeof createClient>) {
  const localNotes = await dexieDb.notes.toArray();

  if (localNotes.length === 0) {
    console.log("No notes to migrate");
    return;
  }

  console.log(`Migrating ${localNotes.length} notes...`);

  // Convert Dexie notes to Supabase format
  const supabaseNotes: NoteInsert[] = localNotes.map((n) => ({
    user_id: userId,
    book_id: n.bookId,
    chapter: n.chapter,
    verse_start: n.verseStart,
    verse_end: n.verseEnd,
    content: n.content,
    created_at: n.createdAt.toISOString(),
    updated_at: n.updatedAt.toISOString(),
  }));

  // Insert in batches
  for (let i = 0; i < supabaseNotes.length; i += BATCH_SIZE) {
    const batch = supabaseNotes.slice(i, i + BATCH_SIZE);
    // @ts-expect-error - Supabase client type inference issue with Database generic
    const { error } = await supabase.from("notes").insert(batch);
    if (error) throw error;
  }

  console.log("Notes migrated successfully");
}

async function migrateBookmarks(userId: string, supabase: ReturnType<typeof createClient>) {
  const localBookmarks = await dexieDb.bookmarks.toArray();

  if (localBookmarks.length === 0) {
    console.log("No bookmarks to migrate");
    return;
  }

  console.log(`Migrating ${localBookmarks.length} bookmarks...`);

  // Convert Dexie bookmarks to Supabase format
  const supabaseBookmarks: BookmarkInsert[] = localBookmarks.map((b) => ({
    user_id: userId,
    book_id: b.bookId,
    chapter: b.chapter,
    verse_start: b.verseStart,
    verse_end: b.verseEnd,
    created_at: b.createdAt.toISOString(),
  }));

  // Insert in batches
  for (let i = 0; i < supabaseBookmarks.length; i += BATCH_SIZE) {
    const batch = supabaseBookmarks.slice(i, i + BATCH_SIZE);
    // @ts-expect-error - Supabase client type inference issue with Database generic
    const { error } = await supabase.from("bookmarks").insert(batch);

    if (error) {
      // If duplicate key error, continue
      if (error.code === "23505") {
        console.warn("Some bookmarks already exist, skipping duplicates");
        continue;
      }
      throw error;
    }
  }

  console.log("Bookmarks migrated successfully");
}

async function clearLocalData() {
  console.log("Clearing local Dexie data...");

  await dexieDb.highlights.clear();
  await dexieDb.notes.clear();
  await dexieDb.bookmarks.clear();

  console.log("Local data cleared");
}

/**
 * Reset migration flag for a user (useful for testing)
 */
export function resetMigrationFlag(userId: string) {
  localStorage.removeItem(`${MIGRATION_FLAG_KEY}_${userId}`);
}
