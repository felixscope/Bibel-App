"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Redirect happens automatically via OAuth flow
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google-Anmeldung fehlgeschlagen");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <AuthCard title="Anmelden" subtitle="Willkommen zurück">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <AuthInput
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            autoComplete="email"
          />

          <AuthInput
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/auth/reset-password"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            Anmelden
          </AuthButton>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                Oder
              </span>
            </div>
          </div>

          <GoogleButton onClick={handleGoogleSignIn} isLoading={isGoogleLoading} />

          <div className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Noch kein Konto?{" "}
            <Link href="/auth/register" className="text-[var(--accent)] hover:underline font-medium">
              Jetzt registrieren
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
