"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { ChapterView } from "@/components/bibel/ChapterView";
import { ChapterNavigation } from "@/components/bibel/ChapterNavigation";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { loadBook } from "@/lib/bible-loader";
import { getBookById, Book, Chapter } from "@/lib/types";
import { motion } from "framer-motion";

interface PageProps {
  params: Promise<{
    buch: string;
    kapitel: string;
  }>;
}

export default function LesenPage({ params }: PageProps) {
  const { buch, kapitel } = use(params);
  const chapterNum = parseInt(kapitel, 10);
  const { translation } = useTranslation();

  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const bookMeta = getBookById(buch);

  // Load book data when translation or book changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      const book = await loadBook(translation, buch);

      if (cancelled) return;

      if (book) {
        setBookData(book);
      } else {
        setError(true);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [translation, buch]);

  // Handle loading and errors
  if (!bookMeta) {
    notFound();
  }

  if (loading) {
    return (
      <MainLayout>
        <TopBar currentBookId={buch} currentChapter={chapterNum} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !bookData) {
    return (
      <MainLayout>
        <TopBar currentBookId={buch} currentChapter={chapterNum} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <p className="text-[var(--text-muted)] mb-2">Buch nicht gefunden</p>
          <p className="text-sm text-[var(--text-muted)]">
            Dieses Buch ist in der gewählten Übersetzung nicht verfügbar.
          </p>
        </div>
      </MainLayout>
    );
  }

  // Find chapter
  const chapter = bookData.chapters.find((c: Chapter) => c.number === chapterNum);

  if (!chapter) {
    notFound();
  }

  return (
    <MainLayout>
      {/* Top Bar mit allen Icons */}
      <TopBar
        currentBookId={buch}
        currentChapter={chapterNum}
      />

      {/* Lese-Fortschritt Indikator */}
      <div className="reading-progress">
        <motion.div
          className="reading-progress-bar"
          initial={{ height: "0%" }}
          animate={{ height: `${(chapterNum / bookMeta.chapters) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>

      {/* Kapitelinhalt */}
      <ChapterView
        bookId={buch}
        bookName={bookData.name}
        chapterNumber={chapter.number}
        verses={chapter.verses}
        introduction={bookData.introduction}
      />

      {/* Navigation */}
      <ChapterNavigation
        bookId={buch}
        currentChapter={chapterNum}
        totalChapters={bookMeta.chapters}
      />
    </MainLayout>
  );
}
