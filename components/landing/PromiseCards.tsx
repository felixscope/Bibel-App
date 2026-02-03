"use client";

import { motion } from "framer-motion";

const items = [
  {
    title: "Lesen",
    description: "Klarer Bibeltext, ruhig und fokussiert.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6.5C4 5.12 5.12 4 6.5 4H20v16H6.5C5.12 20 4 18.88 4 17.5V6.5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7h8M8 11h8M8 15h5"
        />
      </svg>
    ),
  },
  {
    title: "Studieren",
    description: "Notizen und Markierungen direkt am Vers.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 6h8a2 2 0 0 1 2 2v10a1 1 0 0 1-1 1H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 8H6a2 2 0 0 0-2 2v7a1 1 0 0 0 1 1h2"
        />
      </svg>
    ),
  },
  {
    title: "Verstehen",
    description: "Suche, Struktur und Kontext auf einen Blick.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 18a7 7 0 1 0-4.95-11.95A7 7 0 0 0 11 18Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m20 20-3.5-3.5"
        />
      </svg>
    ),
  },
];

export function PromiseCards() {
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
          Kernversprechen
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-bg-elevated/80 px-6 py-7 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-bg text-accent flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="font-display text-xl text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
