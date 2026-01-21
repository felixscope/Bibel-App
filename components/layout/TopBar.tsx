"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { BookSelector } from "@/components/bibel/BookSelector";
import { SearchOverlay } from "@/components/bibel/SearchOverlay";
import { TranslationSelector } from "@/components/bibel/TranslationSelector";
import { UserMenuButton } from "@/components/layout/UserMenuButton";
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
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

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
        {/* Linke Seite: Übersetzung + Buch */}
        <div className="flex items-center gap-2">
          {/* Übersetzungsauswahl */}
          <TranslationSelector />

          <span className="text-[var(--text-muted)]">|</span>

          {/* Buchauswahl */}
          <BookSelector
            currentBookId={currentBookId}
            currentChapter={currentChapter}
          />
        </div>

        {/* Rechte Icons */}
        <div className="flex items-center gap-1">
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

          {/* Lesezeichen */}
          <Link
            href="/lesezeichen"
            className="p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            title="Lesezeichen"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </Link>

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

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            title={isDark ? "Heller Modus" : "Dunkler Modus"}
          >
            {/* Zeige immer Mond-Icon bis mounted, dann basierend auf Theme */}
            {!mounted || !isDark ? (
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>

          {/* User Menu */}
          <UserMenuButton />
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </header>
  );
}
