"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TranslationId, TRANSLATIONS } from "@/lib/types";

interface TranslationContextType {
  translation: TranslationId;
  setTranslation: (id: TranslationId) => void;
  translationName: string;
  translationShortName: string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

const STORAGE_KEY = "bible-translation";

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translation, setTranslationState] = useState<TranslationId>("einheitsuebersetzung");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in TRANSLATIONS) {
      setTranslationState(stored as TranslationId);
    }
    setIsLoaded(true);
  }, []);

  const setTranslation = (id: TranslationId) => {
    setTranslationState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const currentTranslation = TRANSLATIONS[translation];

  // Don't render until we've loaded the preference
  if (!isLoaded) {
    return null;
  }

  return (
    <TranslationContext.Provider
      value={{
        translation,
        setTranslation,
        translationName: currentTranslation.name,
        translationShortName: currentTranslation.shortName,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
