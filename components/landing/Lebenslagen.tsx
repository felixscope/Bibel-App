"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LEBENSLAGEN } from "@/data/lebenslagen";

const ICON_MAP: Record<string, React.ReactNode> = {
  sparkle: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  ),
  heart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  anchor: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0 0c-3.866 0-7-2.239-7-5m7 5c3.866 0 7-2.239 7-5M12 3a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v14M5 16c0 2.761 3.134 5 7 5s7-2.239 7-5M9 12H4m16 0h-5" />
    </svg>
  ),
  lamp: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  leaf: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 3.107a3.56 3.56 0 00-5.024 0L3.107 15.87a3.56 3.56 0 005.024 5.024L20.893 8.13a3.56 3.56 0 000-5.023zM6 21l-3 0 0-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21C7.5 16.5 11 13 15.5 8.5" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  sunrise: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  compass: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
};

const GRADIENT_MAP: Record<string, string> = {
  sparkle: "from-amber-500/10 to-orange-500/5",
  heart: "from-rose-500/10 to-pink-500/5",
  anchor: "from-sky-500/10 to-blue-500/5",
  lamp: "from-yellow-500/10 to-amber-500/5",
  leaf: "from-emerald-500/10 to-green-500/5",
  shield: "from-indigo-500/10 to-violet-500/5",
  sunrise: "from-orange-500/10 to-amber-500/5",
  compass: "from-teal-500/10 to-cyan-500/5",
};

const ICON_COLOR_MAP: Record<string, string> = {
  sparkle: "text-amber-600 dark:text-amber-400",
  heart: "text-rose-600 dark:text-rose-400",
  anchor: "text-sky-600 dark:text-sky-400",
  lamp: "text-yellow-600 dark:text-yellow-400",
  leaf: "text-emerald-600 dark:text-emerald-400",
  shield: "text-indigo-600 dark:text-indigo-400",
  sunrise: "text-orange-600 dark:text-orange-400",
  compass: "text-teal-600 dark:text-teal-400",
};

export function Lebenslagen() {
  return (
    <section className="px-6 py-20 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl text-text-primary mb-4"
        >
          Gottes Wort für deine Lebenslage
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-text-secondary max-w-2xl mb-10"
        >
          Kuratierte Bibelstellen zu Themen, die dich bewegen — von Freude bis
          Berufung.
        </motion.p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {LEBENSLAGEN.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Link
                href={`/lebenslagen/${item.id}`}
                className={`group relative flex flex-col h-[180px] rounded-2xl border border-border bg-gradient-to-br ${GRADIENT_MAP[item.icon] || ""} shadow-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30 overflow-hidden`}
              >
                <div className={`w-10 h-10 rounded-xl bg-bg-elevated/80 flex items-center justify-center mb-3 ${ICON_COLOR_MAP[item.icon] || "text-accent"} transition-transform duration-300 group-hover:scale-110`}>
                  {ICON_MAP[item.icon] || null}
                </div>
                <h3 className="font-display text-base md:text-lg text-text-primary mb-1">
                  {item.title.split("&").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<span className="font-sans">&amp;</span></span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </h3>
                <p className="text-text-muted text-xs md:text-sm leading-snug">
                  {item.subtitle}
                </p>
                <span className="inline-block mt-auto text-accent text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Entdecken →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/lebenslagen"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            Alle Lebenslagen entdecken
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
