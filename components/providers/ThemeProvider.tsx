"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
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
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("bibel-theme") as Theme | null;
    const savedFontSize = localStorage.getItem("bibel-font-size") as FontSize | null;

    if (savedTheme) setThemeState(savedTheme);
    if (savedFontSize) setFontSizeState(savedFontSize);

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("bibel-theme", newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem("bibel-font-size", newSize);
  };

  // Always provide the context, but mark if not mounted yet
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        fontSize,
        setTheme,
        setFontSize,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
