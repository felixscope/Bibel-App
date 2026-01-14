"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";
type FontFamily = "system" | "serif" | "modern" | "classic";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  fontSize: FontSize;
  fontFamily: FontFamily;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");
  const [fontFamily, setFontFamilyState] = useState<FontFamily>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("bibel-theme") as Theme | null;
    const savedFontSize = localStorage.getItem("bibel-font-size") as FontSize | null;
    const savedFontFamily = localStorage.getItem("bibel-font-family") as FontFamily | null;

    if (savedTheme) setThemeState(savedTheme);
    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedFontFamily) setFontFamilyState(savedFontFamily);

    setMounted(true);
  }, []);

  // Resolve theme and apply to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    const applyTheme = (resolved: "light" | "dark") => {
      setResolvedTheme(resolved);
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Apply font size class
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Remove all font size classes
    root.classList.remove("font-size-sm", "font-size-md", "font-size-lg", "font-size-xl", "font-size-2xl");
    // Add current
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize, mounted]);

  // Apply font family class
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Remove all font family classes
    root.classList.remove("font-family-system", "font-family-serif", "font-family-modern", "font-family-classic");
    // Add current
    root.classList.add(`font-family-${fontFamily}`);
  }, [fontFamily, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("bibel-theme", newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem("bibel-font-size", newSize);
  };

  const setFontFamily = (newFamily: FontFamily) => {
    setFontFamilyState(newFamily);
    localStorage.setItem("bibel-font-family", newFamily);
  };

  // Always provide the context, but mark if not mounted yet
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        fontSize,
        fontFamily,
        setTheme,
        setFontSize,
        setFontFamily,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
