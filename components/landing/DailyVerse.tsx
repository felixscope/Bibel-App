"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDailyVerse, type DailyVerseData } from "@/lib/daily-verse";

export function DailyVerse() {
  const [verse, setVerse] = useState<DailyVerseData | null>(null);

  useEffect(() => {
    setVerse(getDailyVerse());
  }, []);

  if (!verse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative overflow-hidden bg-bg-elevated rounded-2xl p-6 md:p-8 border border-border shadow-sm">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/nature-light.jpg"
            alt="Naturbild Hintergrund"
            fill
            className="object-cover opacity-30"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-accent"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-text-muted text-sm font-medium tracking-wide uppercase">
            Vers des Tages
          </span>
        </div>

        {/* Verse Text */}
        <blockquote className="mb-4">
          <p className="font-serif text-xl md:text-2xl text-text-primary leading-relaxed">
            &ldquo;{verse.text}&rdquo;
          </p>
        </blockquote>

        {/* Reference & Link */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary font-display text-lg">
            — {verse.reference}
          </span>
          <Link
            href={`/lesen/${verse.bookId}/${verse.chapter}`}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-accent
                       bg-accent/10 hover:bg-accent/20 rounded-lg border border-accent/20
                       transition-all duration-200 hover:-translate-y-0.5"
          >
            Zur Stelle
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
