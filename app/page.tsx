"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { DailyVerse } from "@/components/landing/DailyVerse";
import { ContinueReading } from "@/components/landing/ContinueReading";

export default function LandingPage() {
  const { user } = useAuth();
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring for buttery animations (no stutter on mobile)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Subtiler Zoom-Effekt beim Scrollen (1.05 → 1)
  const scale = useTransform(smoothProgress, [0, 1], [1.05, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);

  const scrollToContent = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      {/* Hero Section - Full Viewport */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image mit Scroll-Animation */}
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
            sizes="100vw"
          />
        </motion.div>

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" />

        {/* Top Navigation Bar */}
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
            className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white/90 hover:text-white
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg
                       border border-white/20 transition-all duration-200"
          >
            <Image
              src="/bible-book-icon.png"
              alt=""
              width={18}
              height={18}
              className="opacity-90"
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

        {/* Quote Overlay - Centered */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl text-center"
          >
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed font-medium drop-shadow-lg">
              &ldquo;Dann sagte Jesus wieder zu allen Leuten: Ich bin das Licht der Welt! Wer mir folgt, wird nicht mehr in der Finsternis umherirren, sondern wird das Licht haben, das zum Leben führt.&rdquo;
            </p>
            <footer className="mt-6 text-white/80 text-lg md:text-xl font-display">
              — Johannes 8:12
            </footer>
          </motion.blockquote>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/70
                     hover:text-white transition-colors cursor-pointer"
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

      {/* Second Section - Daily Verse & Continue Reading */}
      <section
        ref={secondSectionRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
        style={{
          background: "linear-gradient(to bottom, #8B7355, #5D4E3B)",
        }}
      >
        {/* Daily Verse Widget */}
        <DailyVerse />

        {/* Continue Reading (only shows if user has history) */}
        <ContinueReading />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-lg text-center mt-12"
        >
          {/* Bible Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/bible-icon.png"
              alt="Bibel"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="font-display text-2xl md:text-3xl text-white font-bold mb-3">
            Entdecke die Heilige Schrift
          </h2>

          <p className="text-white/70 text-base mb-6 leading-relaxed">
            Lesen, markieren und studieren in einer modernen App.
          </p>

          <Link
            href="/lesen/matthew/1"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#5D4E3B]
                       font-semibold rounded-xl hover:bg-white/90 transition-all duration-200
                       hover:-translate-y-0.5 hover:shadow-lg"
          >
            Jetzt Lesen
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
