"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { BookSelector } from "@/components/bibel/BookSelector";
import { SearchOverlay } from "@/components/bibel/SearchOverlay";
import { TranslationSelector } from "@/components/bibel/TranslationSelector";
import { UserMenuButton } from "@/components/layout/UserMenuButton";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { TRANSLATIONS, TranslationId } from "@/lib/types";
import clsx from "clsx";

interface TopBarProps {
  currentBookId?: string;
  currentChapter?: number;
}

type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";
type FontFamily = "system" | "serif" | "modern" | "classic";

const fontSizeLabels: Record<FontSize, string> = {
  sm: "Klein",
  md: "Normal",
  lg: "Groß",
  xl: "Sehr groß",
  "2xl": "Riesig",
};

const fontFamilyLabels: Record<FontFamily, { name: string; desc: string }> = {
  system: { name: "System", desc: "Apple SF / Clean" },
  modern: { name: "Modern", desc: "Sleek & Contemporary" },
  serif: { name: "Serif", desc: "Elegant Klassisch" },
  classic: { name: "Klassisch", desc: "Traditionell" },
};

export function TopBar({ currentBookId, currentChapter }: TopBarProps) {
  const { theme, setTheme, resolvedTheme, fontSize, setFontSize, fontFamily, setFontFamily, mounted } = useTheme();
  const { translation, parallelTranslation, setParallelTranslation } = useTranslation();
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const isReadingPage = pathname.startsWith("/lesen/");

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showFontSettings) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFontSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFontSettings]);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Linke Seite: Home (Mobile) + Übersetzung + Buch */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Home Icon - nur auf Mobile Lese-Seiten */}
          {isReadingPage && (
            <Link
              href="/"
              className="md:hidden p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0"
              title="Zur Startseite"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </Link>
          )}

          {/* Übersetzungsauswahl */}
          <TranslationSelector />

          <span className="text-[var(--text-muted)]">|</span>

          {/* Sekundäre Übersetzung (Parallel-Modus) */}
          {parallelTranslation && (
            <>
              <TranslationSelector secondary />
              <span className="text-[var(--text-muted)]">|</span>
            </>
          )}

          {/* Buchauswahl */}
          <BookSelector
            currentBookId={currentBookId}
            currentChapter={currentChapter}
          />
        </div>

        {/* Rechte Icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Suche */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            title="Suche (Cmd+K)"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Schrifteinstellungen */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFontSettings(!showFontSettings)}
              className={clsx(
                "p-2.5 rounded-lg transition-colors",
                showFontSettings ? "bg-[var(--bg-hover)]" : "hover:bg-[var(--bg-hover)]"
              )}
              title="Schrifteinstellungen"
            >
              <span className="text-base font-semibold text-[var(--text-secondary)]">Aa</span>
            </button>

            {/* Font Settings Dropdown */}
            <AnimatePresence>
              {showFontSettings && mounted && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  {/* Schriftgröße */}
                  <div className="p-3 border-b border-[var(--border)]">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
                      Schriftgröße
                    </p>
                    <div className="flex gap-1">
                      {(["sm", "md", "lg", "xl", "2xl"] as FontSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={clsx(
                            "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            fontSize === size
                              ? "bg-[var(--accent)] text-white"
                              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                          )}
                          title={fontSizeLabels[size]}
                        >
                          {size === "sm" ? "S" : size === "md" ? "M" : size === "lg" ? "L" : size === "xl" ? "XL" : "2X"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schriftart */}
                  <div className="p-2">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide px-2 mb-1">
                      Schriftart
                    </p>
                    {(["system", "modern", "serif", "classic"] as FontFamily[]).map((family) => (
                      <button
                        key={family}
                        onClick={() => setFontFamily(family)}
                        className={clsx(
                          "w-full flex items-start justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                          fontFamily === family
                            ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                        )}
                      >
                        <div className="flex flex-col items-start gap-0.5 flex-1">
                          <span className="font-medium">{fontFamilyLabels[family].name}</span>
                          <span className="text-xs text-[var(--text-muted)] pl-0">
                            {fontFamilyLabels[family].desc}
                          </span>
                        </div>
                        {fontFamily === family && (
                          <svg className="w-4 h-4 flex-shrink-0 ml-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Parallel-Ansicht Toggle (nur auf Lese-Seiten) */}
          {isReadingPage && (
            <button
              onClick={() => {
                if (parallelTranslation) {
                  setParallelTranslation(null);
                } else {
                  const ids = Object.keys(TRANSLATIONS) as TranslationId[];
                  const other = ids.find((id) => id !== translation) ?? ids[0];
                  setParallelTranslation(other);
                }
              }}
              className={clsx(
                "p-2.5 rounded-lg transition-colors",
                parallelTranslation
                  ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                  : "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              )}
              title="Übersetzungen vergleichen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M3 9h18M3 15h18" />
              </svg>
            </button>
          )}

          {/* User Menu */}
          <UserMenuButton />
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </header>
  );
}
