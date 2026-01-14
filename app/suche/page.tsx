"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";

export default function SuchePage() {
  return (
    <MainLayout>
      <TopBar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="chapter-title text-3xl text-[var(--text-primary)] mb-8">
          Suche
        </h1>

        {/* Suchfeld */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="In der Bibel suchen..."
            className="w-full px-4 py-3 pl-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {/* Platzhalter */}
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-[var(--text-muted)]">
            Gib einen Suchbegriff ein, um in der Bibel zu suchen
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
