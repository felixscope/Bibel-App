# NextSteps — Roadmap

> Ein treuer Begleiter, der die Bibel einfach, klar und berührend erklärt. Durch Einfachheit und Klarheit, die ins Herz trifft.

---

## Bereits implementiert

- [x] Bibel-Reader mit 3 Übersetzungen (EÜ, NeÜ, Elberfelder), 73 Bücher
- [x] Markierungen (5 Farben), Notizen, Lesezeichen
- [x] Volltextsuche
- [x] Vers des Tages (84 kuratierte Verse)
- [x] Schlüsselereignisse auf der Startseite
- [x] Auth (E-Mail + Google OAuth), Hybrid-Speicher (Dexie + Supabase)
- [x] Lesehistorie, Theme, Schriftgröße, responsive Design

---

## Phase 1 — Kern-Transformation

### AI Bibel-Begleiter ("Verstehen")
"Verstehen"-Button bei Vers-Auswahl → KI erklärt die Stelle warm, einfach, berührend. Folgefragen möglich. Kein Login nötig.
- Erweitere `app/api/claude/route.ts` (Streaming, Multi-Turn, besserer Prompt)
- Neuer Button in `components/bibel/VerseActionBar.tsx`
- Neues Panel: `components/bibel/VerseExplanation.tsx`

### Lebenslagen
12 Situationen (Angst, Trauer, Einsamkeit, Zweifel, Freude, Vergebung, Liebe, Mut, Neue Anfänge, Berufung, Frieden, Hoffnung) — je 5-8 kuratierte Verse mit herzlicher Erklärung.
- Statische Daten: `data/lebenslagen.ts`
- Routen: `/lebenslagen`, `/lebenslagen/[situation]`
- Integration auf Startseite + Navigation

---

## Phase 2 — Tiefes Bibelstudium

### Lesepläne
Placeholder ersetzen. 5 Pläne: Bibel in 1 Jahr, NT in 90 Tagen, Psalmen (30 Tage), Thema Liebe (14 Tage), Thema Glaube (14 Tage). Fortschrittsverfolgung.
- Nutzt bestehende `ReadingPlan`/`ReadingProgress` Interfaces in `lib/types.ts`
- Daten: `data/leseplaene/`, Route: `/leseplaene/[planId]`

### Querverweise als Links
Fußnoten-Referenzen (z.B. "Jes 40,3") als tippbare Links im Reader.
- Neuer Parser: `lib/reference-parser.ts`
- Kleine Änderung in `components/bibel/VerseText.tsx`

### Bibel-Kurse
Strukturierte Lernpfade: "Wer ist Jesus?" (7 Lektionen), "Gebet verstehen" (6), "Gleichnisse Jesu" (8), "Schöpfung bis Erlösung" (10).
- Daten: `data/kurse/`, Routen: `/kurse/[kursId]/[lektion]`

---

## Phase 3 — Engagement & Wachstum

### Erweiterte Andacht
Vers des Tages + Andachtsgedanke + Gebet + Tagesimpuls. Erweiterung der bestehenden `DailyVerse`-Komponente.

### Lese-Streaks
Supabase `profiles` hat bereits `current_streak_days`, `chapters_read`, `last_read_date` — nur befüllen + Streak-Badge in Navigation.

### Gebetstagebuch
Persönliche Gebete, optional mit Vers-Verknüpfung. Route: `/gebet`, neue Supabase-Tabelle.

### Verse auswendig lernen
Karteikarten mit Spaced Repetition. Route: `/merken`, "Auswendig"-Aktion in VerseActionBar.

---

## Phase 4 — Reichhaltiger Content

### Personen der Bibel
15-20 Charakterprofile (Abraham, David, Paulus, etc.) mit Biografie, Schlüsselstellen, Lebensthemen.

### Zeitstrahl
Visueller Zeitstrahl der biblischen Geschichte, jedes Ereignis verlinkt zur Bibelstelle.

### Bucheinleitungen
Fehlende Einleitungen für alle 73 Bücher ergänzen (`introduction`-Feld existiert bereits).

### Audio-Bibel
Web Speech API (Browser-TTS) als einfacher Start — kostenlos, kein rechtliches Risiko. Später optional: Bible Brain API oder Cloud TTS.

### Push-Benachrichtigungen
Tägliche Erinnerungen via Web Push API (PWA-Manifest existiert bereits).
