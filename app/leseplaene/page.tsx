"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";

export default function LeseplaenePage() {
  return (
    <MainLayout>
      <TopBar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="chapter-title text-3xl text-[var(--text-primary)] mb-8">
          Lesepläne
        </h1>

        {/* Beispiel-Lesepläne */}
        <div className="space-y-4">
          <div className="card card-interactive cursor-pointer">
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              Bibel in einem Jahr
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Lies die gesamte Bibel in 365 Tagen
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">365 Tage</span>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                Bald verfügbar
              </span>
            </div>
          </div>

          <div className="card card-interactive cursor-pointer">
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              Chronologisch
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Lies die Bibel in chronologischer Reihenfolge
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">365 Tage</span>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                Bald verfügbar
              </span>
            </div>
          </div>

          <div className="card card-interactive cursor-pointer">
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              Neues Testament
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Lies das Neue Testament in 90 Tagen
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">90 Tage</span>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                Bald verfügbar
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
