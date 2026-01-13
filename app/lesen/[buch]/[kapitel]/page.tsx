"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { ChapterView } from "@/components/bibel/ChapterView";
import { ChapterNavigation } from "@/components/bibel/ChapterNavigation";
import { genesis } from "@/data/bibel/genesis";
import { ruth } from "@/data/bibel/ruth";
import { getBookById } from "@/lib/types";
import { motion } from "framer-motion";

// Verfügbare Bibeldaten (wird später erweitert)
const bibleData: Record<string, typeof genesis> = {
  genesis: genesis,
  ruth: ruth,
};

interface PageProps {
  params: Promise<{
    buch: string;
    kapitel: string;
  }>;
}

export default function LesenPage({ params }: PageProps) {
  const { buch, kapitel } = use(params);
  const chapterNum = parseInt(kapitel, 10);

  // Buchdaten laden
  const bookData = bibleData[buch];
  const bookMeta = getBookById(buch);

  if (!bookData || !bookMeta) {
    notFound();
  }

  // Kapitel finden
  const chapter = bookData.chapters.find((c) => c.number === chapterNum);

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
