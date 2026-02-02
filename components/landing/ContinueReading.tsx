"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getReadingHistory, type ReadingPosition } from "@/lib/reading-history";

export function ContinueReading() {
  const [history, setHistory] = useState<ReadingPosition[]>([]);

  useEffect(() => {
    setHistory(getReadingHistory());
  }, []);

  // Don't render if no history
  if (history.length === 0) return null;

  const lastPosition = history[0];
  const recentHistory = history.slice(1, 4); // Show up to 3 recent entries

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto mt-6"
    >
      {/* Main Continue Reading Button */}
      <Link
        href={`/lesen/${lastPosition.bookId}/${lastPosition.chapter}`}
        className="block group"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20
                        hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Book Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-0.5">Weiterlesen</p>
                <p className="text-white font-medium text-lg">
                  {lastPosition.bookName} Kapitel {lastPosition.chapter}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                            group-hover:bg-white/20 transition-colors">
              <svg
                className="w-5 h-5 text-white/80 group-hover:translate-x-0.5 transition-transform"
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
            </div>
          </div>
        </div>
      </Link>

      {/* Recent History Pills */}
      {recentHistory.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {recentHistory.map((pos, index) => (
            <Link
              key={`${pos.bookId}-${pos.chapter}-${index}`}
              href={`/lesen/${pos.bookId}/${pos.chapter}`}
              className="px-3 py-1.5 text-sm text-white/70 bg-white/5 hover:bg-white/10
                         rounded-full border border-white/10 hover:border-white/20
                         transition-all duration-200"
            >
              {pos.bookName} {pos.chapter}
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
