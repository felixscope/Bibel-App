"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <AuthCard title="E-Mail bestätigen" subtitle="Fast geschafft!">
        <div className="text-center space-y-6">
          {/* Email Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--accent-bg)] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Prüfe dein Postfach
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Wir haben dir eine E-Mail mit einem Bestätigungslink gesendet. Bitte klicke auf den
              Link, um dein Konto zu aktivieren.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Keine E-Mail erhalten?
            </p>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1 text-left">
              <li>• Überprüfe deinen Spam-Ordner</li>
              <li>• Stelle sicher, dass die E-Mail-Adresse korrekt ist</li>
              <li>• Warte einige Minuten und versuche es erneut</li>
            </ul>
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
