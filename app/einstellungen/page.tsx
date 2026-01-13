"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { useTheme } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";

const fontSizeLabels: Record<FontSize, string> = {
  sm: "Klein",
  md: "Normal",
  lg: "Groß",
  xl: "Sehr groß",
  "2xl": "Riesig",
};

export default function EinstellungenPage() {
  const { theme, setTheme, fontSize, setFontSize, mounted } = useTheme();

  return (
    <MainLayout>
      <TopBar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="chapter-title text-3xl text-[var(--text-primary)] mb-8">
          Einstellungen
        </h1>

        {/* Erscheinungsbild */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Erscheinungsbild
          </h2>

          <div className="card">
            <h3 className="font-medium text-[var(--text-primary)] mb-3">
              Farbschema
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={clsx(
                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                    mounted && theme === t
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  {t === "light" ? "Hell" : t === "dark" ? "Dunkel" : "System"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Schriftgröße */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Lesen
          </h2>

          <div className="card">
            <h3 className="font-medium text-[var(--text-primary)] mb-3">
              Schriftgröße
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {(["sm", "md", "lg", "xl", "2xl"] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={clsx(
                    "py-2.5 px-2 rounded-lg text-sm font-medium transition-colors",
                    mounted && fontSize === size
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  {fontSizeLabels[size]}
                </button>
              ))}
            </div>

            {/* Vorschau */}
            <div className="mt-4 p-4 rounded-lg bg-[var(--bg-secondary)]">
              <p className="bible-text text-[var(--text-primary)]">
                Am Anfang schuf Gott Himmel und Erde.
              </p>
            </div>
          </div>
        </section>

        {/* Info */}
        <section>
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Über
          </h2>

          <div className="card">
            <p className="text-sm text-[var(--text-secondary)]">
              Bibel App – Mit Liebe gestaltet für intensives Bibelstudium.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Bibeltext: Luther 1912 (gemeinfrei)
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
