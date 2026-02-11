# NextSteps — Roadmap

> Ein treuer Begleiter, der die Bibel einfach, klar und berührend erklärt. Durch Einfachheit und Klarheit, die ins Herz trifft.

---

# Teil 1: App-Funktionen

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

---

# Teil 2: Marketing & Wachstum

> Kernbotschaft DE: *"Die Bibel App — Einfach. Schön. Nah an Gott."*
> Kernbotschaft EN: *"Bible App — Simple. Beautiful. Close to God."*
>
> Differenzierung: Kostenlos, werbefrei, liebevoll gestaltet. Lebenslagen + 3 Übersetzungen + Tagesvers — kein Konkurrent bietet das so.

## Internationale Strategie — Überblick

**Stufe 1 (Monat 1–4): Deutsch** — Launch, organisches Wachstum, erste Community in DACH
**Stufe 2 (ab Monat 4–5): Englisch** — App-Übersetzung (i18n), englische Bibeltexte, internationale Kanäle

Die App wird zweisprachig. Marketing startet auf Deutsch, Englisch folgt nach technischer Vorbereitung.

---

# Stufe 1: Deutschsprachiger Markt (DACH + Expats weltweit)

## Marketing Phase 0 — Launch-Vorbereitung (Woche 1–2)

Technische Grundlagen, bevor Marketing startet:

- [ ] **Deployment** — Vercel deployen mit eigener Domain (z.B. `bibelapp.de` oder `meinebibel.app`)
- [ ] **SEO-Grundlagen** — `sitemap.xml`, `robots.txt`, Open Graph Tags, Twitter Cards, Schema.org Structured Data
- [ ] **Analytics** — Plausible oder Umami (DSGVO-konform, kein Cookie-Banner nötig)
- [ ] **Share-Funktion** — Vers teilen (Text + Referenz + Link), Lebenslagen teilen, schöne OG-Previews
- [ ] **Performance** — Lighthouse Score 90+ für SEO-Ranking
- [ ] **App-Install-Banner** — "Zur Homescreen hinzufügen"-Prompt für PWA

---

## Marketing Phase 1 — Organisches Fundament DE (Woche 2–6)

### Instagram DE (Hauptkanal)
Account: `@bibel.app` — Zielgruppe christliche Deutsche, 18–45.

**Content-Strategie (3–5 Posts/Woche):**
- **Tagesvers-Grafik** — Täglich in Stories, schöne Typografie auf Parchment-Hintergrund
- **Lebenslagen-Karussell** — 2x/Woche: "5 Bibelverse für Zeiten der Angst" (Wisch-Karussell)
- **Schlüsselereignis-Reel** — 1x/Woche: 30-Sek-Reel mit App-Bildern
- **App-Feature-Demo** — 1x/Woche: Screen-Recording
- **Testimonial/Zitat** — 1x/Woche
- **Behind-the-Scenes** — 1–2x/Monat: persönliche Story, warum die App gebaut wurde

**Reels-Formate:**
- "Ein Vers, der alles verändert" — emotional, kurz, Textoverlay
- "Was sagt die Bibel zu [Thema]?" — Lebenslagen-Inhalt als Reel
- "3 Bibelstellen, die du kennen musst" — schnelle Cuts, Musik

**Hashtags DE:** `#bibel` `#bibelvers` `#glaube` `#christlich` `#jesus` `#bibelstudium` `#gotteswort` `#bibelapp` `#tagesvers`

### TikTok DE (Reichweiten-Multiplikator)
Account: `@bibelapp` — Höchste organische Reichweite. "ChristianTok" wächst rasant.

**Content (3–4 Videos/Woche):**
- "Wusstest du..."-Reihe — überraschende Bibelfakten
- Lebenslagen-Videos — "Wenn du dich einsam fühlst, lies DAS"
- App-Demos — schnelle Walkthroughs, satisfying UI-Momente
- Trending Sounds nutzen mit Bibelversen
- Storytelling zu Schlüsselereignissen (David & Goliath in 60 Sek.)

*TikTok-Content kann 1:1 als Instagram Reels wiederverwendet werden.*

### YouTube DE (Langfristige SEO-Maschine)
Kanal: "Bibel App" — Zweitgrößte Suchmaschine. Christliche YouTube-Community in DE sehr aktiv.

- **Shorts** — 3x/Woche (repurposed TikTok/Reels)
- **Lebenslagen-Erklärvideos** — 1x/Woche, 5–10 Min: "Was sagt die Bibel zu Angst?"
- **App-Tutorials** — 2x/Monat, 3–5 Min
- **Schlüsselereignisse** — 1x/Monat, 8–15 Min: tiefgehende Erklärung

### Pinterest (Evergreen Traffic — funktioniert DE + EN)
Bibelverse-Grafiken sind einer der beliebtesten Pin-Typen. Lange Haltbarkeit.

- Tagesvers-Pins mit App-Branding (täglich, ab Stufe 2 zweisprachig)
- Lebenslagen-Infografiken
- Schlüsselereignis-Pins mit App-Bildern
- Alle Pins verlinken direkt auf die App-Seite

### SEO-Blog DE
Langfristiger, kostenloser Traffic über Google.

**Artikel-Ideen:**
- "Die 50 schönsten Bibelverse über Liebe"
- "Was sagt die Bibel zu Einsamkeit? — 10 Verse die Trost spenden"
- "Bibel in einem Jahr lesen — Dein Leseplan"
- "Einheitsübersetzung vs. Elberfelder — Welche Übersetzung passt zu dir?"
- "Die 12 wichtigsten Geschichten der Bibel"

---

## Marketing Phase 2 — Community & Multiplikatoren DE (Woche 4–10)

### Christliche Influencer & Creator (DACH)
Micro-Influencer (1.000–50.000 Follower) im deutschsprachigen christlichen Raum.

**Vorgehen:**
1. Liste: 30–50 christliche Creator auf Instagram/TikTok/YouTube (DE, AT, CH)
2. Persönliche Nachricht — kein Copy-Paste, echtes Interesse zeigen
3. Kooperationen anbieten:
   - Co-Creation: "Deine Lieblings-Lebenslagen-Verse in unserer App"
   - Story-Takeover: Creator zeigt seinen Bibel-Alltag mit der App
   - Viele christliche Creator teilen gerne Ressourcen, die helfen

**Creator-Typen:** Christliche Lifestyle-Blogger, Worship-Musiker, Pastoren/Theologen mit Social Media, Buch-Reviewer, Glaubens-Podcaster

### Gemeinden & Kirchengemeinden (DACH)
Direkter Zugang zur Zielgruppe. Pastor-Empfehlung hat enorme Glaubwürdigkeit.

- Digitale Flyer/Poster für Gemeindebüros
- Gemeinde-Newsletter: "Neue kostenlose Bibel App aus Deutschland"
- Jugendgruppen-Kontakt (Jugendleiter als Multiplikatoren)
- Bibel-Lesegruppen: App als Tool für gemeinsames Lesen
- Sonntagsgottesdienst: QR-Code auf Folien ("Lies die Predigt-Stelle nach")

### Christliche Medien & Presse (DACH)
- Pressemitteilung an: idea.de, jesus.de, PRO Medienmagazin, Livenet.ch, Kirchenzeitungen
- Podcast-Interviews in christlichen Podcasts
- Story-Angle: "Ein deutscher Entwickler baut eine Bibel App mit Herz"

---

## Marketing Phase 3 — Bezahlte Reichweite DE (ab Woche 8)

### Meta Ads (Instagram + Facebook)
Budget: Start mit 5–10 €/Tag, hochskalieren nach Performance.

| Kampagne | Ziel | Creative |
|---|---|---|
| Awareness | Reichweite | Video-Reel: App-Walkthrough mit emotionaler Musik |
| Lebenslagen | Conversion | Karussell: "5 Verse für schwere Zeiten" → App-Link |
| Tagesvers | App-Install | Schöner Tagesvers + "Jeden Tag ein Vers" |
| Retargeting | Registrierung | "Meld dich an und behalte deine Markierungen" |

**Targeting:** Interessen Bibel/Christentum/Gebet/Kirche, Alter 18–55, Sprache Deutsch, Region DE/AT/CH

### Google Ads (Search)
Budget: 5–10 €/Tag.

**Keywords DE:** "bibel app deutsch", "bibel online lesen", "bibelverse über angst/liebe/hoffnung", "tagesvers bibel", "bibel app kostenlos", "bibelstudium app"

---

## Marketing Phase 4 — Engagement & Retention (laufend, DE + EN)

### E-Mail & Push
- Täglicher Tagesvers per E-Mail (Opt-in bei Registrierung)
- Wöchentlicher Newsletter: "Dein Bibel-Impuls der Woche" (später auch EN: "Your Weekly Bible Moment")
- Push-Notifications (PWA): Tagesvers-Reminder morgens (konfigurierbar)
- Onboarding-Sequenz: 5 E-Mails über 2 Wochen (DE, später auch EN)

### Community-Aufbau
- Telegram-/WhatsApp-Gruppe: "Bibel App Community"
- Feature-Requests sammeln und Nutzer einbinden
- User-Generated Content: Nutzer teilen Lieblings-Markierungen → reposten
- Ab Stufe 2: Discord-Server (internationaler, EN-freundlich)

---

# Stufe 2: Englischer Markt — International (ab Monat 4–5)

## Technische Vorbereitung (vor EN-Marketing)

- [ ] **i18n einbauen** — `next-intl` installieren, UI-Strings extrahieren (~200+ Strings)
- [ ] **Englische Bibel-Übersetzung** — mindestens 1 public-domain Übersetzung (z.B. World English Bible — kostenlos, kein Copyright)
- [ ] **Lebenslagen auf Englisch** — "Life Situations" mit übersetzten Titeln, Erklärungen und Gebeten
- [ ] **Tagesverse auf Englisch** — 84 Verse in Englisch
- [ ] **Locale-Routing** — `/en/...` und `/de/...` Pfade, automatische Spracherkennung
- [ ] **Zweite Domain** — `bibleapp.com` oder `scripture.app` (oder `/en` auf gleicher Domain)
- [ ] **App Store Listing** — Text für Google Play Store & Apple App Store (via PWA oder TWA/Capacitor)

---

## EN Marketing Phase 1 — Organisches Fundament EN (ab Monat 5)

### Instagram EN
Separater Account oder zweisprachiger Account mit EN-Content.

**Option A (empfohlen): Zweiter Account** `@bibleapp.daily` oder `@scripture.app`
**Option B: Bilingual** — Abwechselnd DE/EN posten (riskant für Algorithmus)

**Content-Strategie (gleiche Formate, auf Englisch):**
- **Daily Verse Graphics** — Same Parchment-Design, English text
- **Life Situations Carousels** — "5 Bible Verses for Times of Anxiety"
- **Key Events Reels** — "David vs Goliath — What We Can Learn"
- **App Walkthrough** — English voiceover

**Hashtags EN:** `#bible` `#bibleverse` `#faith` `#christian` `#jesus` `#biblestudy` `#dailyverse` `#scripture` `#godsword` `#christianlife`

### TikTok EN (größter Hebel international)
**Warum TikTok EN Priorität hat:** Der englischsprachige ChristianTok ist 10x größer als der deutsche. Ein virales Video kann 1M+ Views bringen.

**Content (3–4 Videos/Woche):**
- "Did you know..." — Bible facts that surprise people
- Life Situations — "When you feel alone, read THIS"
- App demos — satisfying UI moments
- "3 Bible verses that changed my life"
- Storytelling: Key Events in 60 seconds

**Entscheidend:** TikTok EN-Content kann auf Instagram Reels EN + YouTube Shorts EN wiederverwendet werden.

### YouTube EN
Eigener Kanal "Bible App" oder zweisprachiger Kanal mit EN-Playlists.

- **Shorts** — 3x/Woche (repurposed TikTok EN)
- **Life Situations Videos** — "What Does the Bible Say About Fear?" (5–10 Min)
- **App Tutorials** — English walkthroughs
- **Key Bible Stories** — Deeper explainers (8–15 Min)

**SEO EN-Keywords:** "bible app free", "daily bible verse", "bible verses about anxiety", "bible verses about love", "free bible study app", "bible online", "scripture for hard times"

### SEO-Blog EN
Englischer Blog unter `/en/blog` — massiver SEO-Traffic möglich (englischsprachiger Markt ist 10x größer).

**Artikel-Ideen EN:**
- "50 Most Beautiful Bible Verses About Love"
- "What Does the Bible Say About Loneliness? — 10 Comforting Verses"
- "Bible in a Year Reading Plan — Your Guide"
- "Best Free Bible Apps 2026 — Honest Comparison"
- "Life Situations: How the Bible Speaks to Your Struggles"

### Reddit & Online Communities (EN-spezifisch)
Reddit ist im englischsprachigen Raum ein Hauptkanal für Nischen-Communities.

- **r/Christianity** (400K+ Members) — Wertvolle Beiträge, keine Werbung, App bei Relevanz erwähnen
- **r/Bible** (200K+) — Diskussionen über Bibelstellen, App als Ressource teilen
- **r/TrueChristian** (100K+) — Konservativere Community
- **Strategie:** Echten Mehrwert liefern (Bibelwissen teilen), App nur organisch erwähnen
- **Wichtig:** Reddit hasst offensichtliche Werbung — nur authentische Teilnahme

### Product Hunt Launch (einmalig)
- App auf Product Hunt launchen: "Bible App — Beautiful, Free Bible Study"
- Guter Tag: Dienstag oder Mittwoch
- Community vorher aktivieren für Upvotes am Launch-Tag
- Kann 1.000+ Besucher an einem Tag bringen

---

## EN Marketing Phase 2 — Internationale Multiplikatoren (ab Monat 6)

### Englischsprachige Influencer & Creator
Der englischsprachige christliche Creator-Markt ist riesig. Viele Creator haben 100K–1M+ Follower.

**Vorgehen:**
1. Liste: 50+ christliche EN-Creator auf Instagram/TikTok/YouTube
2. Fokus auf Micro-Influencer (5K–50K) — höheres Engagement, einfacher erreichbar
3. "Life Situations" als Story-Hook: "This app knows what Bible verse you need right now"
4. Feature in "Best Bible Apps"-Listicles und Reviews

**Creator-Typen EN:**
- Christian lifestyle influencers (Instagram/TikTok)
- Bible study YouTubers (The Bible Project-Umfeld)
- Worship artists with social presence
- Christian podcasters (English)
- Faith-based book reviewers

### Internationale Gemeinden & Organisationen
- Englischsprachige Gemeinden in Deutschland (Expat-Churches)
- Online-Kirchen und Streaming-Gottesdienste (z.B. Church Online)
- Christliche Universitäten und Bibelschulen
- Internationale christliche Organisationen (YWAM, Cru, InterVarsity)

### Englischsprachige Medien & Presse
- Christliche Medien: Relevant Magazine, Christianity Today, Church Leaders
- Tech-Blogs: "New Bible App from Germany challenges YouVersion"
- Podcast-Auftritte in englischen christlichen Podcasts
- **Story-Angle EN:** "A German developer built a Bible app that actually cares about design"

---

## EN Marketing Phase 3 — Bezahlte Reichweite EN (ab Monat 7)

### Meta Ads EN (Instagram + Facebook)
Budget: 10–20 $/Tag (englischer Markt ist teurer, aber viel größer).

| Kampagne | Ziel | Creative |
|---|---|---|
| Awareness | Reichweite | Video: "The Bible App That Feels Like Home" |
| Life Situations | Conversion | Carousel: "5 Verses for When You Feel Lost" → App-Link |
| Daily Verse | App-Install | Beautiful verse graphic + "A verse for every day" |
| Retargeting | Registrierung | "Save your highlights — sign up free" |

**Targeting EN:** Interests Bible/Christianity/Prayer/Church/Faith, Age 18–55, Language English, Region US/UK/CA/AU/NZ

### Google Ads EN (Search)
Budget: 10–20 $/Tag.

**Keywords EN:** "bible app free", "daily bible verse app", "bible study app", "bible verses about anxiety", "free bible online", "christian app", "scripture app"

### App Store Optimization (ASO)
Falls PWA als TWA (Trusted Web Activity) im Google Play Store oder via Capacitor im Apple App Store:
- Keyword-optimierte Titel: "Bible App — Free Daily Verse & Study"
- Screenshots mit englischen UI-Texten
- Beschreibung mit Keywords
- Regelmäßige Updates für besseres Ranking

---

## Content-Kalender (Beispielwoche — zweisprachig ab Stufe 2)

| Tag | Instagram DE | Instagram EN | TikTok | YouTube | Pinterest |
|---|---|---|---|---|---|
| Mo | Tagesvers | Daily Verse | — | Short DE | 3 Pins DE+EN |
| Di | Lebenslagen-Karussell | Life Situations Carousel | Lebenslagen DE | — | 2 Infografiken |
| Mi | Story: Feature | Story: Feature | App-Demo EN | Short EN | — |
| Do | Reel: Schlüsselereignis | Reel: Key Event | Storytelling EN | Erklärvideo DE | 3 Pins DE+EN |
| Fr | Zitat | Quote | "Did you know..." | Short EN | 2 Pins |
| Sa | Story: Poll | Story: Poll | — | — | — |
| So | Behind the Scenes | Behind the Scenes | — | — | — |

---

## KPIs & Erfolgsmessung

### Deutschsprachiger Markt (Stufe 1)

| Metrik | 3 Monate | 6 Monate | 12 Monate |
|---|---|---|---|
| Website-Besucher/Monat | 5.000 | 20.000 | 50.000 |
| Registrierte Nutzer | 500 | 2.000 | 10.000 |
| Tägliche aktive Nutzer | 100 | 500 | 2.000 |
| Instagram DE Follower | 1.000 | 5.000 | 15.000 |
| TikTok DE Follower | 500 | 3.000 | 10.000 |
| YouTube DE Abonnenten | 200 | 1.000 | 5.000 |

### Englischsprachiger Markt (Stufe 2 — ab Monat 5)

| Metrik | 6 Monate nach EN-Launch | 12 Monate nach EN-Launch |
|---|---|---|
| Website-Besucher/Monat (EN) | 10.000 | 100.000 |
| Registrierte Nutzer (EN) | 2.000 | 20.000 |
| Tägliche aktive Nutzer (EN) | 500 | 5.000 |
| Instagram EN Follower | 3.000 | 20.000 |
| TikTok EN Follower | 5.000 | 50.000 |
| YouTube EN Subscribers | 1.000 | 10.000 |

*Der englischsprachige Markt ist ~10x größer als der deutsche. TikTok EN hat das höchste Viralitätspotential.*

---

## Budget-Übersicht (monatlich)

### Stufe 1 — Nur Deutsch

| Posten | Kosten |
|---|---|
| Domain & Hosting (Vercel) | 0–20 € |
| Analytics (Plausible) | 9 € |
| Canva Pro (Grafiken) | 12 € |
| Meta Ads DE | 150–300 € |
| Google Ads DE | 150–300 € |
| E-Mail-Tool (Mailerlite Free) | 0 € |
| **Gesamt Stufe 1** | **~320–640 €** |

### Stufe 2 — Deutsch + Englisch

| Posten | Kosten |
|---|---|
| Alles aus Stufe 1 | ~320–640 € |
| Zweite Domain (EN) | 10–15 € |
| Meta Ads EN | 300–600 $ |
| Google Ads EN | 300–600 $ |
| **Gesamt Stufe 2** | **~950–1.850 €** |

*Stufe 1 kann komplett kostenlos gestartet werden — nur organisch, ohne Ads.*
*Stufe 2 Ads sind optional — organisches EN-Marketing (besonders TikTok) kann allein viel bewirken.*

---

## Quick Wins (Sofort umsetzbar)

### Sofort (Stufe 1 — Deutsch)
1. [ ] App deployen auf Vercel mit Domain
2. [ ] Instagram DE Account erstellen, erste 9 Posts vorbereiten (Grid-Optik)
3. [ ] Tagesvers-Template in Canva erstellen (wiederverwendbar, DE + EN-Version)
4. [ ] OG-Tags & Share-Funktion implementieren
5. [ ] 3 Lebenslagen-Karussells für Instagram erstellen
6. [ ] Persönliche Story schreiben — Warum wurde die App gebaut? (Authentizität!)
7. [ ] 5 christliche Creator (DE) anschreiben mit persönlicher Nachricht
8. [ ] Google Search Console einrichten

### Ab Monat 4 (Stufe 2 — Englisch vorbereiten)
9. [ ] i18n-Bibliothek (`next-intl`) einbauen
10. [ ] Englische Bibel-Übersetzung integrieren (World English Bible — public domain)
11. [ ] UI-Strings extrahieren und übersetzen
12. [ ] Lebenslagen + Tagesverse auf Englisch übersetzen
13. [ ] Instagram EN Account erstellen
14. [ ] TikTok EN-Content starten (größter Hebel!)
15. [ ] Product Hunt Launch vorbereiten
16. [ ] Reddit-Präsenz aufbauen (authentisch, kein Spam)
