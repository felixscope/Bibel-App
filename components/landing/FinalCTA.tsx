"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type FinalCTAProps = {
  showLogin?: boolean;
};

export function FinalCTA({ showLogin }: FinalCTAProps) {
  return (
    <section className="px-6 py-20 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-bg-secondary px-8 py-12 text-center shadow-sm"
        >
          <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-4">
            Beginne jetzt – Kapitel für Kapitel.
          </h2>
          <p className="text-text-secondary mb-8">
            Eine ruhige, moderne Begleitung für dein tägliches Lesen und
            Studieren.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lesen/matthew/1"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
            >
              Jetzt lesen
            </Link>
            {showLogin && (
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border text-text-primary bg-bg-elevated hover:bg-bg-hover transition-colors"
              >
                Anmelden
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
