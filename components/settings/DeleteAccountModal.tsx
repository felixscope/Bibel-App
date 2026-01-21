"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "warning" | "confirmation";

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { deleteAccount } = useAuth();
  const [step, setStep] = useState<Step>("warning");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("warning");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Bitte gib dein Passwort ein");
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount(password);
      // Navigation happens in AuthProvider after successful deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        if (step === "confirmation") {
          setStep("warning");
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, step]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-lg)] w-full max-w-md overflow-hidden"
          role="dialog"
          aria-labelledby="delete-account-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="delete-account-title" className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {step === "warning" ? "Konto wirklich löschen?" : "Löschung bestätigen"}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {step === "warning" ? "Diese Aktion kann nicht rückgängig gemacht werden" : "Gib dein Passwort ein zur Bestätigung"}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
                aria-label="Schließen"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {step === "warning" ? (
            <div className="px-6 py-6">
              {/* Warning Message */}
              <div className="mb-6">
                <p className="text-[var(--text-primary)] mb-4">
                  Wenn du dein Konto löschst, werden alle deine Daten permanent gelöscht:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Alle Notizen werden gelöscht
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Alle Lesezeichen werden gelöscht
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Alle Markierungen werden gelöscht
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Dein Profil wird gelöscht
                    </span>
                  </li>
                </ul>
              </div>

              {/* Warning Box */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Warnung: Diese Aktion kann nicht rückgängig gemacht werden
                    </p>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                      Es gibt keine Möglichkeit, deine Daten wiederherzustellen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg" role="alert">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Info Message */}
                <div className="mb-4 p-3 bg-[var(--accent-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    Gib dein Passwort ein, um die Löschung zu bestätigen.
                  </p>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="delete-password" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Passwort zur Bestätigung
                  </label>
                  <input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>

              {/* Footer - Confirmation Step */}
              <div className="px-6 py-4 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("warning")}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Konto wird gelöscht...
                    </>
                  ) : (
                    "Konto endgültig löschen"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer - Warning Step */}
          {step === "warning" && (
            <div className="px-6 py-4 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => setStep("confirmation")}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Fortfahren
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
