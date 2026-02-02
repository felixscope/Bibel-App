"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookIntroductionProps {
  introduction: string;
  bookName: string;
}

export function BookIntroduction({ introduction, bookName }: BookIntroductionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!introduction) return null;

  // Parse introduction with proper heading detection and markdown support
  const parseIntroduction = () => {
    const lines = introduction.split('\n').filter(line => line.trim());
    const elements: { type: 'h2' | 'h3' | 'p'; content: React.ReactNode[] }[] = [];

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();

      // Check for h2 heading (starts with #)
      if (trimmed.startsWith('# ')) {
        elements.push({
          type: 'h2',
          content: [trimmed.substring(2).trim()]
        });
        return;
      }

      // Check for h3 heading (starts with ##)
      if (trimmed.startsWith('## ')) {
        elements.push({
          type: 'h3',
          content: [trimmed.substring(3).trim()]
        });
        return;
      }

      // Regular paragraph - process markdown
      const parts: React.ReactNode[] = [];
      const regex = /\*{2,}([^*]+)\*{2,}/g;  // Matches 2+ asterisks
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(trimmed)) !== null) {
        // Add text before the bold part
        if (match.index > lastIndex) {
          parts.push(trimmed.substring(lastIndex, match.index));
        }
        // Add bold text
        parts.push(<strong key={`${lineIdx}-${match.index}`}>{match[1]}</strong>);
        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < trimmed.length) {
        parts.push(trimmed.substring(lastIndex));
      }

      if (parts.length > 0) {
        elements.push({ type: 'p', content: parts });
      }
    });

    return elements;
  };

  const elements = parseIntroduction();

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
      >
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0 ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Einleitung zu {bookName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 mt-2 rounded-lg bg-[var(--bg-secondary)] border-l-2 border-[var(--text-muted)]">
              <div className="space-y-3">
                {elements.map((element, idx) => {
                  if (element.type === 'h2') {
                    return (
                      <h3 key={idx} className="text-base font-bold text-[var(--text-primary)] mt-4 first:mt-0">
                        {element.content}
                      </h3>
                    );
                  }
                  if (element.type === 'h3') {
                    return (
                      <h4 key={idx} className="text-sm font-bold text-[var(--text-primary)] mt-3 first:mt-0">
                        {element.content}
                      </h4>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {element.content}
                    </p>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
