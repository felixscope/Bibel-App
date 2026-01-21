"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Senden des Reset-Links");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
        <AuthCard title="E-Mail gesendet" subtitle="Prüfe dein Postfach">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Wir haben dir einen Link zum Zurücksetzen deines Passworts an{" "}
                <span className="font-medium text-[var(--text-primary)]">{email}</span> gesendet.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Der Link ist 1 Stunde lang gültig.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/auth/login"
                className="text-sm text-[var(--accent)] hover:underline font-medium"
              >
                ← Zurück zur Anmeldung
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <AuthCard title="Passwort zurücksetzen" subtitle="Wir senden dir einen Reset-Link">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <AuthInput
              label="E-Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              autoComplete="email"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Gib die E-Mail-Adresse ein, mit der du dich registriert hast.
            </p>
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            Reset-Link senden
          </AuthButton>

          <div className="text-center text-sm text-[var(--text-secondary)] mt-6">
            <Link href="/auth/login" className="text-[var(--accent)] hover:underline font-medium">
              ← Zurück zur Anmeldung
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
