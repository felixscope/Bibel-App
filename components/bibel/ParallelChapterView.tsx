"use client";

import { motion } from "framer-motion";
import type { Verse } from "@/lib/types";

interface ParallelChapterViewProps {
  chapterNumber: number;
  primaryVerses: Verse[];
  primaryBookName: string;
  primaryShortName: string;
  secondaryVerses: Verse[];
  secondaryShortName: string;
}

function cleanText(text: string) {
  return text.replace(/\*/g, "");
}

export function ParallelChapterView({
  chapterNumber,
  primaryVerses,
  primaryBookName,
  primaryShortName,
  secondaryVerses,
  secondaryShortName,
}: ParallelChapterViewProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Kapitelüberschrift */}
      <header className="mb-8 text-center">
        <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-2">
          {primaryBookName}
        </p>
        <h1 className="chapter-title text-4xl md:text-5xl text-[var(--text-primary)]">
          Kapitel {chapterNumber}
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="w-16 h-px bg-[var(--border)]" />
        </div>
      </header>

      {/* Übersetzungs-Labels */}
      <div className="grid grid-cols-2 mb-4 pb-3 border-b border-[var(--border)]">
        <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
          {primaryShortName}
        </div>
        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider pl-3 md:pl-6">
          {secondaryShortName}
        </div>
      </div>

      {/* Verse nebeneinander */}
      <div className="bible-text text-[var(--text-primary)]">
        {primaryVerses.map((verse) => {
          const secVerse = secondaryVerses.find((v) => v.number === verse.number);
          return (
            <div key={verse.number} className="grid grid-cols-2 mb-4">
              <div className="pr-3 md:pr-6">
                {verse.heading && (
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mt-4 mb-1.5 leading-snug">
                    {verse.heading}
                  </h3>
                )}
                <p className="text-sm md:text-base leading-relaxed">
                  <sup className="text-[var(--accent)] text-xs mr-1 font-medium">
                    {verse.number}
                  </sup>
                  {cleanText(verse.text)}
                </p>
              </div>
              <div className="pl-3 md:pl-6 border-l border-[var(--border)]">
                {secVerse?.heading && (
                  <h3 className="font-semibold text-sm text-[var(--text-secondary)] mt-4 mb-1.5 leading-snug">
                    {secVerse.heading}
                  </h3>
                )}
                <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                  <sup className="text-xs mr-1 font-medium text-[var(--text-muted)]">
                    {verse.number}
                  </sup>
                  {cleanText(secVerse?.text ?? "")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <div className="flex justify-center">
          <p className="text-[var(--text-muted)] text-sm">{primaryVerses.length} Verse</p>
        </div>
      </footer>
    </motion.article>
  );
}
