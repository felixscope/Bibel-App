"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Bitte bestätige dein Passwort";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signUp(email, password, displayName || undefined);
      router.push("/auth/verify-email");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Registrierung fehlgeschlagen" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrors({});
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Redirect happens automatically via OAuth flow
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Google-Anmeldung fehlgeschlagen" });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <AuthCard title="Registrieren" subtitle="Erstelle dein Konto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          <AuthInput
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="deine@email.de"
            error={errors.email}
            required
            autoComplete="email"
          />

          <AuthInput
            label="Name (optional)"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Dein Name"
            autoComplete="name"
          />

          <AuthInput
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Mindestens 8 Zeichen"
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <AuthInput
            label="Passwort bestätigen"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            placeholder="Passwort wiederholen"
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <AuthButton type="submit" isLoading={isLoading}>
            Konto erstellen
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
            Bereits ein Konto?{" "}
            <Link href="/auth/login" className="text-[var(--accent)] hover:underline font-medium">
              Jetzt anmelden
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
