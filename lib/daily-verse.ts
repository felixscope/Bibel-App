// Kuratierte Liste inspirierender Bibelverse für den Tagesvers
// Jeder Vers hat: Buch-ID, Kapitel, Vers(e), Text, Referenz

export interface DailyVerseData {
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text: string;
  reference: string;
}

// 52 Verse für jede Woche des Jahres - wiederholt sich nach einem Jahr
const DAILY_VERSES: DailyVerseData[] = [
  // Hoffnung & Vertrauen
  { bookId: "john", chapter: 8, verseStart: 12, text: "Ich bin das Licht für die Welt. Wer mir nachfolgt, wird nicht in der Dunkelheit umherirren, sondern er hat das Licht, das zum Leben führt.", reference: "Johannes 8,12" },
  { bookId: "jeremiah", chapter: 29, verseStart: 11, text: "Denn ich weiß, was für Gedanken ich über euch habe, spricht der Herr: Gedanken des Friedens und nicht des Leides, dass ich euch gebe Zukunft und Hoffnung.", reference: "Jeremia 29,11" },
  { bookId: "psalms", chapter: 23, verseStart: 1, verseEnd: 3, text: "Der Herr ist mein Hirte, mir wird nichts mangeln. Er weidet mich auf einer grünen Aue und führet mich zum frischen Wasser. Er erquicket meine Seele.", reference: "Psalm 23,1-3" },
  { bookId: "isaiah", chapter: 41, verseStart: 10, text: "Fürchte dich nicht, ich bin mit dir; weiche nicht, denn ich bin dein Gott. Ich stärke dich, ich helfe dir auch, ich halte dich durch die rechte Hand meiner Gerechtigkeit.", reference: "Jesaja 41,10" },
  { bookId: "matthew", chapter: 11, verseStart: 28, text: "Kommt her zu mir, alle, die ihr mühselig und beladen seid; ich will euch erquicken.", reference: "Matthäus 11,28" },

  // Liebe
  { bookId: "1john", chapter: 4, verseStart: 8, text: "Wer nicht liebt, der kennt Gott nicht; denn Gott ist Liebe.", reference: "1. Johannes 4,8" },
  { bookId: "john", chapter: 3, verseStart: 16, text: "Denn so sehr hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.", reference: "Johannes 3,16" },
  { bookId: "romans", chapter: 8, verseStart: 38, verseEnd: 39, text: "Denn ich bin gewiss, dass weder Tod noch Leben, weder Engel noch Mächte noch Gewalten, weder Gegenwärtiges noch Zukünftiges, weder Hohes noch Tiefes noch irgendeine andere Kreatur uns scheiden kann von der Liebe Gottes.", reference: "Römer 8,38-39" },
  { bookId: "1corinthians", chapter: 13, verseStart: 4, verseEnd: 7, text: "Die Liebe ist langmütig und freundlich, die Liebe eifert nicht, die Liebe treibt nicht Mutwillen, sie bläht sich nicht auf, sie verhält sich nicht ungehörig, sie sucht nicht das Ihre, sie lässt sich nicht erbittern, sie rechnet das Böse nicht zu.", reference: "1. Korinther 13,4-5" },
  { bookId: "john", chapter: 15, verseStart: 12, text: "Das ist mein Gebot, dass ihr einander liebt, wie ich euch geliebt habe.", reference: "Johannes 15,12" },

  // Glaube & Stärke
  { bookId: "philippians", chapter: 4, verseStart: 13, text: "Ich vermag alles durch den, der mich mächtig macht.", reference: "Philipper 4,13" },
  { bookId: "hebrews", chapter: 11, verseStart: 1, text: "Es ist aber der Glaube eine feste Zuversicht dessen, was man hofft, und ein Nichtzweifeln an dem, was man nicht sieht.", reference: "Hebräer 11,1" },
  { bookId: "mark", chapter: 9, verseStart: 23, text: "Jesus aber sprach zu ihm: Du sagst: Wenn du kannst! Alle Dinge sind möglich dem, der da glaubt.", reference: "Markus 9,23" },
  { bookId: "joshua", chapter: 1, verseStart: 9, text: "Sei getrost und unverzagt. Lass dir nicht grauen und entsetze dich nicht; denn der Herr, dein Gott, ist mit dir in allem, was du tun wirst.", reference: "Josua 1,9" },
  { bookId: "2timothy", chapter: 1, verseStart: 7, text: "Denn Gott hat uns nicht gegeben den Geist der Furcht, sondern der Kraft und der Liebe und der Besonnenheit.", reference: "2. Timotheus 1,7" },

  // Frieden & Ruhe
  { bookId: "philippians", chapter: 4, verseStart: 6, verseEnd: 7, text: "Sorgt euch um nichts, sondern in allen Dingen lasst eure Bitten in Gebet und Flehen mit Danksagung vor Gott kundwerden! Und der Friede Gottes, der höher ist als alle Vernunft, wird eure Herzen und Sinne bewahren in Christus Jesus.", reference: "Philipper 4,6-7" },
  { bookId: "john", chapter: 14, verseStart: 27, text: "Den Frieden lasse ich euch, meinen Frieden gebe ich euch. Nicht gebe ich euch, wie die Welt gibt. Euer Herz erschrecke nicht und fürchte sich nicht.", reference: "Johannes 14,27" },
  { bookId: "psalms", chapter: 46, verseStart: 11, text: "Seid stille und erkennet, dass ich Gott bin!", reference: "Psalm 46,11" },
  { bookId: "matthew", chapter: 6, verseStart: 34, text: "Darum sorgt nicht für morgen, denn der morgige Tag wird für das Seine sorgen. Es ist genug, dass jeder Tag seine eigene Plage hat.", reference: "Matthäus 6,34" },
  { bookId: "isaiah", chapter: 26, verseStart: 3, text: "Wer festen Herzens ist, dem bewahrst du Frieden; denn er verlässt sich auf dich.", reference: "Jesaja 26,3" },

  // Weisheit & Führung
  { bookId: "proverbs", chapter: 3, verseStart: 5, verseEnd: 6, text: "Verlass dich auf den Herrn von ganzem Herzen, und verlass dich nicht auf deinen Verstand, sondern gedenke an ihn in allen deinen Wegen, so wird er dich recht führen.", reference: "Sprüche 3,5-6" },
  { bookId: "james", chapter: 1, verseStart: 5, text: "Wenn es aber jemandem unter euch an Weisheit mangelt, so bitte er Gott, der jedermann gern und ohne Vorwurf gibt; so wird sie ihm gegeben werden.", reference: "Jakobus 1,5" },
  { bookId: "psalms", chapter: 119, verseStart: 105, text: "Dein Wort ist meines Fußes Leuchte und ein Licht auf meinem Wege.", reference: "Psalm 119,105" },
  { bookId: "proverbs", chapter: 16, verseStart: 3, text: "Befiehl dem Herrn deine Werke, so wird dein Vorhaben gelingen.", reference: "Sprüche 16,3" },
  { bookId: "isaiah", chapter: 30, verseStart: 21, text: "Deine Ohren werden hinter dir das Wort hören: Dies ist der Weg; den geht! Sonst weder zur Rechten noch zur Linken!", reference: "Jesaja 30,21" },

  // Gottes Treue & Versorgung
  { bookId: "lamentations", chapter: 3, verseStart: 22, verseEnd: 23, text: "Die Güte des Herrn ist's, dass wir nicht gar aus sind, seine Barmherzigkeit hat noch kein Ende, sondern sie ist alle Morgen neu, und deine Treue ist groß.", reference: "Klagelieder 3,22-23" },
  { bookId: "matthew", chapter: 6, verseStart: 33, text: "Trachtet zuerst nach dem Reich Gottes und nach seiner Gerechtigkeit, so wird euch das alles zufallen.", reference: "Matthäus 6,33" },
  { bookId: "psalms", chapter: 37, verseStart: 4, text: "Habe deine Lust am Herrn; der wird dir geben, was dein Herz wünscht.", reference: "Psalm 37,4" },
  { bookId: "deuteronomy", chapter: 31, verseStart: 6, text: "Seid getrost und unverzagt, fürchtet euch nicht und lasst euch nicht vor ihnen grauen; denn der Herr, dein Gott, wird selber mit dir ziehen und wird die Hand nicht abtun und dich nicht verlassen.", reference: "5. Mose 31,6" },
  { bookId: "romans", chapter: 8, verseStart: 28, text: "Wir wissen aber, dass denen, die Gott lieben, alle Dinge zum Besten dienen, denen, die nach seinem Ratschluss berufen sind.", reference: "Römer 8,28" },

  // Vergebung & Gnade
  { bookId: "1john", chapter: 1, verseStart: 9, text: "Wenn wir aber unsre Sünden bekennen, so ist er treu und gerecht, dass er uns die Sünden vergibt und reinigt uns von aller Ungerechtigkeit.", reference: "1. Johannes 1,9" },
  { bookId: "ephesians", chapter: 2, verseStart: 8, verseEnd: 9, text: "Denn aus Gnade seid ihr gerettet durch Glauben, und das nicht aus euch: Gottes Gabe ist es, nicht aus Werken, damit sich nicht jemand rühme.", reference: "Epheser 2,8-9" },
  { bookId: "psalms", chapter: 103, verseStart: 12, text: "So fern der Morgen ist vom Abend, lässt er unsre Übertretungen von uns sein.", reference: "Psalm 103,12" },
  { bookId: "isaiah", chapter: 1, verseStart: 18, text: "Kommt denn und lasst uns miteinander rechten, spricht der Herr. Wenn eure Sünde auch blutrot ist, soll sie doch schneeweiß werden.", reference: "Jesaja 1,18" },
  { bookId: "romans", chapter: 5, verseStart: 8, text: "Gott aber erweist seine Liebe zu uns darin, dass Christus für uns gestorben ist, als wir noch Sünder waren.", reference: "Römer 5,8" },

  // Ewiges Leben & Hoffnung
  { bookId: "john", chapter: 11, verseStart: 25, verseEnd: 26, text: "Jesus spricht zu ihr: Ich bin die Auferstehung und das Leben. Wer an mich glaubt, der wird leben, ob er gleich stürbe; und wer da lebt und glaubt an mich, der wird nimmermehr sterben.", reference: "Johannes 11,25-26" },
  { bookId: "revelation", chapter: 21, verseStart: 4, text: "Und Gott wird abwischen alle Tränen von ihren Augen, und der Tod wird nicht mehr sein, noch Leid noch Geschrei noch Schmerz wird mehr sein.", reference: "Offenbarung 21,4" },
  { bookId: "john", chapter: 14, verseStart: 2, verseEnd: 3, text: "In meines Vaters Hause sind viele Wohnungen. Wenn's nicht so wäre, hätte ich dann zu euch gesagt: Ich gehe hin, euch die Stätte zu bereiten?", reference: "Johannes 14,2-3" },
  { bookId: "romans", chapter: 6, verseStart: 23, text: "Denn der Sünde Sold ist der Tod; die Gabe Gottes aber ist das ewige Leben in Christus Jesus, unserm Herrn.", reference: "Römer 6,23" },
  { bookId: "1peter", chapter: 1, verseStart: 3, verseEnd: 4, text: "Gelobt sei Gott, der Vater unseres Herrn Jesus Christus, der uns nach seiner großen Barmherzigkeit wiedergeboren hat zu einer lebendigen Hoffnung durch die Auferstehung Jesu Christi von den Toten.", reference: "1. Petrus 1,3" },

  // Gebet & Gemeinschaft mit Gott
  { bookId: "matthew", chapter: 7, verseStart: 7, text: "Bittet, so wird euch gegeben; suchet, so werdet ihr finden; klopfet an, so wird euch aufgetan.", reference: "Matthäus 7,7" },
  { bookId: "jeremiah", chapter: 33, verseStart: 3, text: "Rufe mich an, so will ich dir antworten und will dir kundtun große und unfassbare Dinge, von denen du nichts weißt.", reference: "Jeremia 33,3" },
  { bookId: "psalms", chapter: 145, verseStart: 18, text: "Der Herr ist nahe allen, die ihn anrufen, allen, die ihn ernstlich anrufen.", reference: "Psalm 145,18" },
  { bookId: "matthew", chapter: 18, verseStart: 20, text: "Denn wo zwei oder drei versammelt sind in meinem Namen, da bin ich mitten unter ihnen.", reference: "Matthäus 18,20" },
  { bookId: "1thessalonians", chapter: 5, verseStart: 16, verseEnd: 18, text: "Seid allezeit fröhlich, betet ohne Unterlass, seid dankbar in allen Dingen; denn das ist der Wille Gottes in Christus Jesus für euch.", reference: "1. Thessalonicher 5,16-18" },

  // Frucht des Geistes & Charakter
  { bookId: "galatians", chapter: 5, verseStart: 22, verseEnd: 23, text: "Die Frucht aber des Geistes ist Liebe, Freude, Friede, Geduld, Freundlichkeit, Güte, Treue, Sanftmut, Keuschheit.", reference: "Galater 5,22-23" },
  { bookId: "colossians", chapter: 3, verseStart: 12, text: "So zieht nun an als die Auserwählten Gottes, als die Heiligen und Geliebten, herzliches Erbarmen, Freundlichkeit, Demut, Sanftmut, Geduld.", reference: "Kolosser 3,12" },
  { bookId: "micah", chapter: 6, verseStart: 8, text: "Es ist dir gesagt, Mensch, was gut ist und was der Herr von dir fordert: nichts als Gottes Wort halten und Liebe üben und demütig sein vor deinem Gott.", reference: "Micha 6,8" },
  { bookId: "romans", chapter: 12, verseStart: 2, text: "Und stellt euch nicht dieser Welt gleich, sondern ändert euch durch Erneuerung eures Sinnes, auf dass ihr prüfen könnt, was Gottes Wille ist, nämlich das Gute und Wohlgefällige und Vollkommene.", reference: "Römer 12,2" },
  { bookId: "2corinthians", chapter: 5, verseStart: 17, text: "Darum: Ist jemand in Christus, so ist er eine neue Kreatur; das Alte ist vergangen, siehe, Neues ist geworden.", reference: "2. Korinther 5,17" },
];

/**
 * Gibt den Tagesvers basierend auf dem aktuellen Datum zurück.
 * Der gleiche Vers wird für den ganzen Tag angezeigt.
 */
export function getDailyVerse(): DailyVerseData {
  const today = new Date();
  // Tag des Jahres berechnen (1-366)
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Modulo um durch die Liste zu rotieren
  const index = dayOfYear % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

/**
 * Gibt einen zufälligen Vers aus der Liste zurück.
 */
export function getRandomVerse(): DailyVerseData {
  const index = Math.floor(Math.random() * DAILY_VERSES.length);
  return DAILY_VERSES[index];
}
