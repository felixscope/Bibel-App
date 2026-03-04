"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { DailyVerse } from "@/components/landing/DailyVerse";
import { ContinueReading } from "@/components/landing/ContinueReading";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { KeyEvents } from "@/components/landing/KeyEvents";
import { Lebenslagen } from "@/components/landing/Lebenslagen";

export default function LandingPage() {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothProgress, [0, 1], [1.05, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden"
      >
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 z-0 transform-gpu"
        >
          <Image
            src="/creation-of-adam.jpg"
            alt="Die Erschaffung Adams von Michelangelo"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "28% center" }}
            sizes="100vw"
          />
        </motion.div>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#3b2a20]/50 via-[#3b2a20]/60 to-[#3b2a20]/85" />

        <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-end items-center gap-2 md:gap-3">
          {user && (
            <>
              <Link
                href="/lesezeichen"
                className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <span className="hidden sm:inline">Lesezeichen</span>
                <span className="sm:hidden">Merken</span>
              </Link>
              <Link
                href="/notizen"
                className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Notizen
              </Link>
              <Link
                href="/leseplaene"
                className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <span className="hidden sm:inline">Lesepläne</span>
                <span className="sm:hidden">Pläne</span>
              </Link>
            </>
          )}
          <Link
            href="/lesen/matthew/1"
            className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-[#3b2a20] hover:text-[#3b2a20]/80
                       bg-white/90 hover:bg-white backdrop-blur-sm rounded-lg
                       border border-white/30 transition-all duration-200"
          >
            <Image
              src="/bible-book-icon.png"
              alt=""
              width={18}
              height={18}
              className="opacity-80"
            />
            <span className="hidden sm:inline">Zur Bibel</span>
            <span className="sm:hidden">Bibel</span>
          </Link>
          {!user && (
            <Link
              href="/auth/login"
              className="px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white/90 hover:text-white
                         bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg
                         border border-white/20 transition-all duration-200"
            >
              Anmelden
            </Link>
          )}
        </header>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed font-medium drop-shadow-lg">
              &ldquo;Ich bin das Licht der Welt. Wer mir folgt, wird nicht
              mehr in der Finsternis umherirren, sondern wird das Licht haben,
              das zum Leben führt.&rdquo;
            </p>
            <footer className="mt-6 text-white/80 text-lg md:text-xl font-display">
              — Johannes 8:12
            </footer>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/lesen/matthew/1"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/90 text-[#3b2a20]
                         font-semibold hover:bg-white transition-colors"
            >
              Jetzt lesen
            </Link>
            <button
              onClick={scrollToContent}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white/90
                         hover:text-white hover:border-white/70 transition-colors"
            >
              Mehr entdecken
            </button>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors"
          aria-label="Nach unten scrollen"
        >
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.button>
      </section>

      <div ref={contentRef}>
        <KeyEvents />
      </div>

      <section className="px-6 py-20 bg-bg-secondary">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl text-text-primary mb-8"
          >
            Heute
          </motion.h2>
          <div className="space-y-6">
            <DailyVerse />
            <ContinueReading />
          </div>
        </div>
      </section>

      <Lebenslagen />

      <FinalCTA showLogin={!user} />
    </main>
  );
}
