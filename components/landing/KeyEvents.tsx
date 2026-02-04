"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const events = [
  {
    title: "Noah & die Arche",
    hook: "Rettung, Gehorsam und ein neuer Anfang.",
    href: "/lesen/genesis/6",
    imagePath: "/stories/arche noah.jpg",
    imageAlt: "Noah's Arche auf dem Wasser",
  },
  {
    title: "David & Goliath",
    hook: "Mut, Vertrauen und die Kraft des Glaubens.",
    href: "/lesen/1samuel/17",
    imagePath: "/stories/david gegen goliath.jpg",
    imageAlt: "David mit Schleuder gegen Goliath",
  },
  {
    title: "Jona im Fisch",
    hook: "Umkehr, Gnade und zweite Chancen.",
    href: "/lesen/jonah/1",
    imagePath: "/stories/jona im wal.jpg",
    imageAlt: "Jona im Bauch des großen Fisches",
  },
  {
    title: "Speisung der 5000",
    hook: "Barmherzigkeit, Wunder und Fülle.",
    href: "/lesen/matthew/14",
    imagePath: "/stories/jesus und die brote und fische.jpg",
    imageAlt: "Jesus teilt Brot und Fische mit der Menge",
  },
  {
    title: "Auszug durch das Meer",
    hook: "Befreiung, Hoffnung und Führung.",
    href: "/lesen/exodus/14",
    imagePath: "/stories/teilung des meeres.jpg",
    imageAlt: "Moses teilt das Rote Meer",
  },
  {
    title: "Auferstehung",
    hook: "Sieg des Lebens, Hoffnung, neue Schöpfung.",
    href: "/lesen/john/20",
    imagePath: "/stories/auferstehung.jpg",
    imageAlt: "Das leere Grab, Jesus ist auferstanden",
  },
];

export function KeyEvents() {
  return (
    <section className="px-6 py-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
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
          Einige Kapitel der Bibel haben die Welt geprägt — durch Mut, Rettung,
          Gnade und Gehorsam. Diese Geschichten tragen zeitlose Weisheit und
          Schönheit in sich. Entdecke die Stationen, die bis heute Kraft geben.
        </motion.p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={event.href}
                className="group block rounded-2xl border border-border bg-bg-elevated/80 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={event.imagePath}
                    alt={event.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: "center 35%" }}
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.2em] text-white drop-shadow-lg">
                    Kapitel
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-text-primary mb-2">
                    {event.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {event.hook}
                  </p>
                  <span className="text-accent text-sm font-medium">
                    Jetzt lesen →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
