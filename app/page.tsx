"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { ChapterView } from "@/components/bibel/ChapterView";
import { ChapterNavigation } from "@/components/bibel/ChapterNavigation";
import { genesis } from "@/data/bibel/genesis";
import { motion } from "framer-motion";

export default function Home() {
  // Standardmäßig Genesis 1 anzeigen
  const book = genesis;
  const chapter = book.chapters[0];

  return (
    <MainLayout>
      {/* Top Bar mit allen Icons */}
      <TopBar
        currentBookId={book.id}
        currentChapter={chapter.number}
      />

      {/* Lese-Fortschritt Indikator */}
      <div className="reading-progress">
        <motion.div
          className="reading-progress-bar"
          initial={{ height: "0%" }}
          animate={{ height: "15%" }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </div>

      {/* Kapitelinhalt */}
      <ChapterView
        bookId={book.id}
        bookName={book.name}
        chapterNumber={chapter.number}
        verses={chapter.verses}
      />

      {/* Navigation */}
      <ChapterNavigation
        bookId={book.id}
        currentChapter={chapter.number}
        totalChapters={book.chapters.length}
      />
    </MainLayout>
  );
}
