"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { TRANSLATIONS, TranslationId } from "@/lib/types";
import { loadVorwort } from "@/lib/bible-loader";

export function TranslationSelector() {
  const { translation, setTranslation, translationShortName } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showVorwort, setShowVorwort] = useState(false);
  const [vorwortText, setVorwortText] = useState<string | null>(null);
  const [loadingVorwort, setLoadingVorwort] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVorwortClick = async () => {
    setLoadingVorwort(true);
    const text = await loadVorwort(translation);
    setVorwortText(text);
    setLoadingVorwort(false);
    setShowVorwort(true);
  };

  const translations = Object.values(TRANSLATIONS);

  return (
    <>
      <div className="relative flex items-center gap-1" ref={dropdownRef}>
        {/* Translation Dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium"
        >
          <span>{translationShortName}</span>
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Info Icon for Vorwort */}
        <button
          onClick={handleVorwortClick}
          className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          title="Vorwort zur Übersetzung"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]"
            >
              {translations.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTranslation(t.id as TranslationId);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between ${
                    translation === t.id ? "bg-[var(--bg-secondary)]" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{t.year}</div>
                  </div>
                  {translation === t.id && (
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vorwort Modal */}
      <AnimatePresence>
        {showVorwort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowVorwort(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-primary)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Vorwort – {TRANSLATIONS[translation].name}
                </h2>
                <button
                  onClick={() => setShowVorwort(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {loadingVorwort ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : vorwortText ? (
                  <div className="prose prose-sm max-w-none text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {vorwortText}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] text-center py-8">
                    Kein Vorwort für diese Übersetzung verfügbar.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
