"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Notizen",
    description: "Gedanken direkt am Vers festhalten.",
  },
  {
    title: "Lesezeichen",
    description: "Stellen, die bleiben und begleiten.",
  },
  {
    title: "Suche",
    description: "Finde jedes Wort in Sekunden.",
  },
  {
    title: "Lesepläne",
    description: "Struktur für tägliches Lesen.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 py-20 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl text-text-primary mb-10"
        >
          Funktionen
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-bg-elevated px-6 py-7 shadow-sm"
            >
              <h3 className="font-display text-xl text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
