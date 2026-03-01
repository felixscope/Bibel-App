"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const events = [
  {
    title: "Entstehung der Welt",
    hook: "In sechs Tagen erschafft Gott Himmel, Erde und alles Leben.",
    href: "/lesen/genesis/1",
    imagePath: "/entstehung der welt.png",
    imageAlt: "Gott erschafft die Welt",
  },
  {
    title: "Adam & Eva",
    hook: "Der Garten Eden, Versuchung und der Anfang von allem.",
    href: "/lesen/genesis/3",
    imagePath: "/testadam.png",
    imageAlt: "Adam und Eva im Garten Eden",
  },
  {
    title: "Noah & die Arche",
    hook: "Rettung, Gehorsam und ein neuer Anfang.",
    href: "/lesen/genesis/6",
    imagePath: "/arche noah miniatur.png",
    imageAlt: "Noah's Arche auf dem Wasser",
  },
  {
    title: "Bund mit Abraham",
    hook: "Gottes Versprechen — der Anfang eines Volkes und eines Glaubens.",
    href: "/lesen/genesis/15",
    imagePath: "/bund mit abraham.png",
    imageAlt: "Gott schließt einen Bund mit Abraham",
  },
  {
    title: "Die 10 Plagen",
    hook: "Zehn Zeichen der Macht Gottes — und der Weg zur Befreiung.",
    href: "/lesen/exodus/7",
    imagePath: "/die10plagen.png",
    imageAlt: "Die zehn Plagen Ägyptens",
  },
  {
    title: "Auszug durch das Meer",
    hook: "Befreiung, Hoffnung und Führung.",
    href: "/lesen/exodus/14",
    imagePath: "/parted sea.png",
    imageAlt: "Moses teilt das Rote Meer",
  },
  {
    title: "Die Zehn Gebote",
    hook: "Gottes Ordnung für ein gerechtes Zusammenleben.",
    href: "/lesen/exodus/20",
    imagePath: "/stories/zehn-gebote.webp",
    imageAlt: "Moses empfängt die Zehn Gebote",
  },
  {
    title: "Das Goldene Kalb",
    hook: "Ungehorsam, Götzendienst und die Gnade einer zweiten Chance.",
    href: "/lesen/exodus/32",
    imagePath: "/goldenes lamm.png",
    imageAlt: "Israel betet das goldene Kalb an",
  },
  {
    title: "David & Goliath",
    hook: "Mut, Vertrauen und die Kraft des Glaubens.",
    href: "/lesen/1samuel/17",
    imagePath: "/david und goliath.png",
    imageAlt: "David mit Schleuder gegen Goliath",
  },
  {
    title: "Daniel in der Löwengrube",
    hook: "Treue unter Druck und göttlicher Schutz.",
    href: "/lesen/daniel/6",
    imagePath: "/Daniel in der löwengrube.png",
    imageAlt: "Daniel zwischen den Löwen",
  },
  {
    title: "Jona im Fisch",
    hook: "Umkehr, Gnade und zweite Chancen.",
    href: "/lesen/jonah/1",
    imagePath: "/jona im fisch.webp",
    imageAlt: "Jona im Bauch des großen Fisches",
  },
  {
    title: "Geburt Jesu",
    hook: "Ein Kind in einer Krippe — und die Welt wird nie mehr dieselbe sein.",
    href: "/lesen/luke/2",
    imagePath: "/geburt jesu.png",
    imageAlt: "Die Geburt Jesu in Bethlehem",
  },
  {
    title: "Die Bergpredigt",
    hook: "Jesu radikalste Rede — Worte, die die Welt verändert haben.",
    href: "/lesen/matthew/5",
    imagePath: "/stories/bergpredigt.webp",
    imageAlt: "Jesus predigt auf dem Berg",
  },
  {
    title: "Speisung der 5000",
    hook: "Barmherzigkeit, Wunder und Fülle.",
    href: "/lesen/matthew/14",
    imagePath: "/speisung der 5000.png",
    imageAlt: "Jesus teilt Brot und Fische mit der Menge",
  },
  {
    title: "Jesus stillt den Sturm",
    hook: "Vertrauen in der Krise und die Macht eines Wortes.",
    href: "/lesen/mark/4",
    imagePath: "/jesus über wasser.png",
    imageAlt: "Jesus beruhigt den Sturm auf dem See",
  },
  {
    title: "Tempelreinigung",
    hook: "Jesus treibt die Händler aus dem Tempel — prophetisch, mutig, kompromisslos.",
    href: "/lesen/matthew/21",
    imagePath: "/tempelreinigung.png",
    imageAlt: "Jesus reinigt den Tempel",
  },
  {
    title: "Jesus wäscht die Füße",
    hook: "Wahre Größe zeigt sich im Dienen.",
    href: "/lesen/john/13",
    imagePath: "/füße waschen.png",
    imageAlt: "Jesus wäscht seinen Jüngern die Füße",
  },
  {
    title: "Auferstehung",
    hook: "Sieg des Lebens, Hoffnung, neue Schöpfung.",
    href: "/lesen/john/20",
    imagePath: "/auferstehung.png",
    imageAlt: "Das leere Grab, Jesus ist auferstanden",
  },
];

// Group events into columns of 2 (top + bottom)
const columns: (typeof events)[] = [];
for (let i = 0; i < events.length; i += 2) {
  columns.push(events.slice(i, i + 2));
}

export function KeyEvents() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const col = el.querySelector<HTMLElement>("[data-col]");
    const colWidth = col ? col.offsetWidth + 20 : 320; // width + gap
    const amount = direction === "right" ? colWidth * 3 : -(colWidth * 3);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl text-text-primary mb-4"
        >
          Schlüsselereignisse
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-text-secondary max-w-2xl mb-10"
        >
          Geschichten, die seit Jahrtausenden Menschen bewegen — und nichts von
          ihrer Kraft verloren haben.
        </motion.p>
      </div>

      <div className="relative">
        {/* Scroll container — each column has 2 cards stacked */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-6 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))] pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              data-col
              className="flex-shrink-0 w-[280px] sm:w-[300px] flex flex-col gap-5"
            >
              {col.map((event, rowIndex) => {
                const globalIndex = colIndex * 2 + rowIndex;
                return (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: globalIndex * 0.06 }}
                  >
                    <Link
                      href={event.href}
                      className="group flex flex-col h-[320px] rounded-2xl border border-border bg-bg-elevated/80 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden">
                        <Image
                          src={event.imagePath}
                          alt={event.imageAlt}
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: "center 35%" }}
                          priority={globalIndex < 6}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.2em] text-white drop-shadow-lg">
                          Kapitel
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 min-h-0">
                        <h3 className="font-display text-xl text-text-primary mb-2">
                          {event.title.split("&").map((part, i, arr) =>
                            i < arr.length - 1 ? (
                              <span key={i}>{part}<span className="font-sans">&amp;</span></span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </h3>
                        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                          {event.hook}
                        </p>
                        <span className="text-accent text-sm font-medium mt-auto">
                          Jetzt lesen →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-bg-elevated/95 backdrop-blur-sm shadow-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
            aria-label="Weiter"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}

        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-bg-elevated/95 backdrop-blur-sm shadow-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
            aria-label="Zurück"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Fade hint on edges */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />
        )}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none" />
        )}
      </div>
    </section>
  );
}
