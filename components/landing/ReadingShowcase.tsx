"use client";

import { motion } from "framer-motion";

export function ReadingShowcase() {
  return (
    <section className="px-6 py-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl text-text-primary mb-8"
        >
          Bibel im Fokus
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border bg-bg-elevated p-8 shadow-sm"
          >
            <p className="text-text-secondary text-sm mb-6">
              Der Text bleibt das Zentrum – ruhig, lesbar, würdig.
            </p>
            <div className="bible-text text-text-primary">
              <span className="drop-cap">I</span>m Anfang schuf Gott Himmel
              und Erde. <span className="verse-number">1</span>Und die Erde
              war wüst und leer, und es war finster auf der Tiefe; und der Geist
              Gottes schwebte auf dem Wasser.
              <span className="verse-number">2</span>Und Gott sprach: Es werde
              Licht! Und es ward Licht.
            </div>
          </motion.div>
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-border bg-bg-secondary p-6 shadow-sm"
          >
            <div className="text-sm text-text-muted uppercase tracking-wide mb-3">
              Study
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <p className="text-text-secondary text-sm">Notiz</p>
                <p className="text-text-primary text-sm leading-relaxed">
                  Ordnung entsteht aus dem Wort – Licht als erstes Zeichen.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-bg-elevated p-4 flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Lesezeichen</p>
                  <p className="text-text-primary text-sm">Genesis 1</p>
                </div>
                <span className="px-2.5 py-1 text-xs rounded-full bg-accent-bg text-accent">
                  Gemerkt
                </span>
              </div>
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <p className="text-text-secondary text-sm">Querverweis</p>
                <p className="text-text-primary text-sm">Johannes 1:1</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
