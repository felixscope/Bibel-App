"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { TopBar } from "@/components/layout/TopBar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { EditProfileModal } from "@/components/settings/EditProfileModal";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";
import { DeleteAccountModal } from "@/components/settings/DeleteAccountModal";
import clsx from "clsx";

type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";

const fontSizeConfig: Record<FontSize, { label: string; short: string }> = {
  sm: { label: "Klein", short: "S" },
  md: { label: "Normal", short: "M" },
  lg: { label: "Groß", short: "L" },
  xl: { label: "Sehr groß", short: "XL" },
  "2xl": { label: "Riesig", short: "2X" },
};

export default function EinstellungenPage() {
  const { theme, setTheme, fontSize, setFontSize, mounted } = useTheme();
  const { user, profile } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Format date for "Mitglied seit"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        {/* Konto */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Konto
          </h2>

          {user ? (
            <>
              {/* Profil-Card */}
              <div className="card mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)] mb-1">
                      {profile?.display_name || "Kein Name"}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                    {user.created_at && (
                      <p className="text-xs text-[var(--text-muted)] mt-2">
                        Mitglied seit {formatDate(user.created_at)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="text-sm font-medium text-[var(--accent)] hover:underline ml-4 flex-shrink-0"
                  >
                    Bearbeiten
                  </button>
                </div>
              </div>

              {/* Sicherheit-Card */}
              <div className="card mb-4">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">
                  Sicherheit
                </h3>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Passwort ändern
                </button>
              </div>

              {/* Gefahrenzone-Card */}
              <div className="card border-red-200 dark:border-red-900/30">
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Gefahrenzone
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Lösche dein Konto permanent. Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <button
                  onClick={() => setShowDeleteAccount(true)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-red-300 dark:border-red-900/50 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Konto löschen
                </button>
              </div>
            </>
          ) : (
            <div className="card">
              <p className="text-[var(--text-secondary)] mb-4">
                Melde dich an, um deine Notizen, Lesezeichen und Highlights zu synchronisieren.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex px-4 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Jetzt anmelden
              </Link>
            </div>
          )}
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
            <div className="flex gap-2">
              {(["sm", "md", "lg", "xl", "2xl"] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={clsx(
                    "flex-1 py-2.5 px-1 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-0",
                    mounted && fontSize === size
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <span className="sm:hidden">{fontSizeConfig[size].short}</span>
                  <span className="hidden sm:inline">{fontSizeConfig[size].label}</span>
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

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <DeleteAccountModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
      />
    </MainLayout>
  );
}
