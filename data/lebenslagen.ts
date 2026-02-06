export interface Passage {
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text: string;
  reference: string;
  explanation: string;
}

export interface Lebenslage {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  introduction: string;
  prayer?: string;
  passages: Passage[];
}

export const LEBENSLAGEN: Lebenslage[] = [
  {
    id: "freude-dankbarkeit",
    title: "Freude & Dankbarkeit",
    subtitle: "Gründe zum Staunen und Danken",
    icon: "sparkle",
    introduction:
      "Freude ist mehr als ein gutes Gefühl — sie ist eine Entscheidung, die tief in Gottes Gegenwart wurzelt. Auch wenn nicht alles perfekt ist, gibt es immer Grund zur Dankbarkeit. Diese Verse erinnern daran, dass wahre Freude nicht von Umständen abhängt.",
    prayer:
      "Herr, öffne meine Augen für das Gute in meinem Leben. Lass mich staunen über das, was du tust, und hilf mir, mit dankbarem Herzen durch den Tag zu gehen. Amen.",
    passages: [
      {
        bookId: "philippians",
        chapter: 4,
        verseStart: 4,
        text: "Freut euch im Herrn zu jeder Zeit! Noch einmal sage ich: Freut euch!",
        reference: "Philipper 4,4",
        explanation:
          "Paulus schreibt diese Worte aus dem Gefängnis. Freude ist keine Frage der Umstände, sondern eine Entscheidung des Herzens.",
      },
      {
        bookId: "1thessalonians",
        chapter: 5,
        verseStart: 16,
        verseEnd: 18,
        text: "Freut euch zu jeder Zeit!",
        reference: "1. Thessalonicher 5,16",
        explanation:
          "Drei kurze, kraftvolle Worte. Freude als Lebenshaltung — nicht als Reaktion auf gute Nachrichten.",
      },
      {
        bookId: "psalms",
        chapter: 32,
        verseStart: 11,
        text: "Freut euch am Herrn und jauchzt, ihr Gerechten, jubelt alle, ihr Menschen mit redlichem Herzen!",
        reference: "Psalm 32,11",
        explanation:
          "Ein Aufruf zur Freude, die aus einem reinen Herzen kommt. Freude und Aufrichtigkeit gehören zusammen.",
      },
      {
        bookId: "romans",
        chapter: 12,
        verseStart: 12,
        text: "Freut euch, weil ihr Hoffnung habt, bleibt standhaft in Bedrängnis, seid treu im Gebet!",
        reference: "Römer 12,12",
        explanation:
          "Freude, Hoffnung und Gebet — drei Säulen, die uns in jeder Lage tragen können.",
      },
      {
        bookId: "psalms",
        chapter: 4,
        verseStart: 8,
        text: "Du legst mir größere Freude ins Herz, als andere haben bei Korn und Wein in Fülle.",
        reference: "Psalm 4,8",
        explanation:
          "Gottes Freude übersteigt jeden irdischen Genuss. Sie ist tiefer und beständiger als alles, was die Welt bieten kann.",
      },
    ],
  },
  {
    id: "gottes-liebe",
    title: "Gottes Liebe",
    subtitle: "Geliebt, bevor du es verdient hast",
    icon: "heart",
    introduction:
      "Gottes Liebe ist bedingungslos. Du musst sie dir nicht verdienen, du kannst sie nicht verlieren. Sie war da, bevor du geboren wurdest, und sie wird bleiben, wenn alles andere vergeht. Diese Verse zeigen, wie tief diese Liebe wirklich geht.",
    prayer:
      "Vater, hilf mir zu begreifen, wie sehr du mich liebst. Nicht wegen dem, was ich tue, sondern weil ich dein Kind bin. Lass mich diese Liebe weitergeben. Amen.",
    passages: [
      {
        bookId: "john",
        chapter: 3,
        verseStart: 16,
        text: "Denn Gott hat die Welt so sehr geliebt, dass er seinen einzigen Sohn hingab, damit jeder, der an ihn glaubt, nicht zugrunde geht, sondern das ewige Leben hat.",
        reference: "Johannes 3,16",
        explanation:
          "Der wohl bekannteste Vers der Bibel. Gottes Liebe ist nicht abstrakt — sie hat einen Namen und ein Gesicht.",
      },
      {
        bookId: "1john",
        chapter: 3,
        verseStart: 1,
        text: "Seht doch, welche Liebe der Vater uns erwiesen hat: Wir sollen seine Kinder heißen – und wir sind es tatsächlich!",
        reference: "1. Johannes 3,1",
        explanation:
          "Nicht nur geliebt, sondern Kinder Gottes. Das ist keine Metapher — das ist unsere Identität.",
      },
      {
        bookId: "john",
        chapter: 15,
        verseStart: 9,
        text: "Wie mich der Vater geliebt hat, so habe auch ich euch geliebt. Bleibt in meiner Liebe!",
        reference: "Johannes 15,9",
        explanation:
          "Jesus liebt uns mit derselben Liebe, die zwischen ihm und dem Vater besteht. Dieselbe. Nicht weniger.",
      },
      {
        bookId: "romans",
        chapter: 8,
        verseStart: 37,
        verseEnd: 39,
        text: "Doch all das überwinden wir durch den, der uns geliebt hat.",
        reference: "Römer 8,37",
        explanation:
          "Nichts kann uns von Gottes Liebe trennen. Keine Angst, kein Fehler, keine Macht der Welt.",
      },
      {
        bookId: "john",
        chapter: 13,
        verseStart: 34,
        text: "Ein neues Gebot gebe ich euch: Liebt einander! Wie ich euch geliebt habe, so sollt auch ihr einander lieben.",
        reference: "Johannes 13,34",
        explanation:
          "Gottes Liebe empfangen ist der Anfang. Sie weitergeben ist der Weg.",
      },
    ],
  },
  {
    id: "vertrauen-glaube",
    title: "Vertrauen & Glaube",
    subtitle: "Loslassen und Gott vertrauen",
    icon: "anchor",
    introduction:
      "Vertrauen bedeutet, die Kontrolle abzugeben — nicht an das Schicksal, sondern an einen Gott, der dich kennt und liebt. Das ist nicht immer leicht. Aber diese Verse zeigen: Wer vertraut, steht auf festem Grund.",
    prayer:
      "Herr, ich gebe dir, was mich beschäftigt. Hilf mir, dir zu vertrauen — auch wenn ich den Weg nicht sehe. Du bist treu. Amen.",
    passages: [
      {
        bookId: "proverbs",
        chapter: 3,
        verseStart: 5,
        verseEnd: 6,
        text: "Mit ganzem Herzen vertrau auf den Herrn, bau nicht auf eigene Klugheit; such ihn zu erkennen auf all deinen Wegen, dann ebnet er selbst deine Pfade.",
        reference: "Sprüche 3,5-6",
        explanation:
          "Der vielleicht wichtigste Vers über Vertrauen. Nicht auf das eigene Verständnis bauen, sondern auf den, der alles sieht.",
      },
      {
        bookId: "isaiah",
        chapter: 40,
        verseStart: 31,
        text: "Die aber, die dem Herrn vertrauen, schöpfen neue Kraft, sie bekommen Flügel wie Adler. Sie laufen und werden nicht müde, sie gehen und werden nicht matt.",
        reference: "Jesaja 40,31",
        explanation:
          "Vertrauen ist keine Schwäche — es ist die Quelle übernatürlicher Kraft. Wer auf Gott wartet, wird erneuert.",
      },
      {
        bookId: "philippians",
        chapter: 1,
        verseStart: 6,
        text: "Ich vertraue darauf, dass er, der bei euch das gute Werk begonnen hat, es auch vollenden wird bis zum Tag Christi Jesu.",
        reference: "Philipper 1,6",
        explanation:
          "Was Gott anfängt, bringt er zu Ende. Dein Leben ist nicht planlos — es ist ein Werk, an dem Gott arbeitet.",
      },
      {
        bookId: "philippians",
        chapter: 4,
        verseStart: 13,
        text: "Alles vermag ich durch ihn, der mir Kraft gibt.",
        reference: "Philipper 4,13",
        explanation:
          "Nicht eigene Stärke, sondern Kraft von oben. Vertrauen heißt: Ich muss nicht alles alleine schaffen.",
      },
      {
        bookId: "psalms",
        chapter: 23,
        verseStart: 1,
        text: "Der Herr ist mein Hirte, nichts wird mir fehlen.",
        reference: "Psalm 23,1",
        explanation:
          "Sieben Worte, die alles sagen. Wer einen Hirten hat, braucht sich nicht zu sorgen.",
      },
    ],
  },
  {
    id: "weisheit-fuehrung",
    title: "Weisheit & Führung",
    subtitle: "Klarheit für den nächsten Schritt",
    icon: "lamp",
    introduction:
      "Manchmal wünschen wir uns einfach nur Klarheit. Welcher Weg ist der richtige? Was soll ich tun? Die Bibel sagt: Weisheit beginnt dort, wo wir aufhören, alles selbst wissen zu wollen — und anfangen, Gott zu fragen.",
    prayer:
      "Gott, schenke mir Weisheit für die Entscheidungen, die vor mir liegen. Öffne meine Augen für deinen Weg und gib mir den Mut, ihn zu gehen. Amen.",
    passages: [
      {
        bookId: "proverbs",
        chapter: 1,
        verseStart: 7,
        text: "Gottesfurcht ist Anfang der Erkenntnis, nur Toren verachten Weisheit und Zucht.",
        reference: "Sprüche 1,7",
        explanation:
          "Der Anfang aller Weisheit ist nicht Wissen, sondern Ehrfurcht vor Gott. Wer ihn ernst nimmt, beginnt wirklich zu verstehen.",
      },
      {
        bookId: "proverbs",
        chapter: 2,
        verseStart: 6,
        text: "Denn der Herr gibt Weisheit, aus seinem Mund kommen Erkenntnis und Einsicht.",
        reference: "Sprüche 2,6",
        explanation:
          "Weisheit ist kein Talent, das manche haben und andere nicht. Sie ist ein Geschenk — und Gott gibt sie gern.",
      },
      {
        bookId: "proverbs",
        chapter: 3,
        verseStart: 13,
        verseEnd: 14,
        text: "Wohl dem Mann, der Weisheit gefunden, dem Mann, der Einsicht gewonnen hat. Denn sie zu erwerben ist besser als Silber, sie zu gewinnen ist besser als Gold.",
        reference: "Sprüche 3,13-14",
        explanation:
          "Weisheit ist wertvoller als alles Materielle. Wer sie findet, hat den größten Schatz gefunden.",
      },
      {
        bookId: "proverbs",
        chapter: 4,
        verseStart: 7,
        text: "Anfang der Weisheit ist: Erwirb dir Weisheit, erwirb dir Einsicht mit deinem ganzen Vermögen!",
        reference: "Sprüche 4,7",
        explanation:
          "Weisheit kommt nicht von allein. Sie verlangt Hingabe — aber sie lohnt sich mehr als alles andere.",
      },
      {
        bookId: "proverbs",
        chapter: 3,
        verseStart: 5,
        verseEnd: 6,
        text: "Such ihn zu erkennen auf all deinen Wegen, dann ebnet er selbst deine Pfade.",
        reference: "Sprüche 3,6",
        explanation:
          "Gott will nicht nur in großen Entscheidungen gefragt werden — sondern auf jedem einzelnen Schritt.",
      },
    ],
  },
  {
    id: "frieden-ruhe",
    title: "Frieden & Ruhe",
    subtitle: "Zur Ruhe kommen bei Gott",
    icon: "leaf",
    introduction:
      "In einer lauten, hektischen Welt ist innerer Frieden ein seltenes Geschenk. Jesus lädt uns ein, bei ihm zur Ruhe zu kommen — nicht erst, wenn alles gelöst ist, sondern mitten im Sturm.",
    prayer:
      "Jesus, ich komme zu dir mit allem, was mich belastet. Schenke mir deinen Frieden — den Frieden, den die Welt nicht geben kann. Amen.",
    passages: [
      {
        bookId: "matthew",
        chapter: 11,
        verseStart: 28,
        text: "Kommt alle zu mir, die ihr euch plagt und schwere Lasten zu tragen habt. Ich werde euch Ruhe verschaffen.",
        reference: "Matthäus 11,28",
        explanation:
          "Eine der schönsten Einladungen der Bibel. Jesus nimmt uns die Last nicht immer ab — aber er trägt sie mit uns.",
      },
      {
        bookId: "philippians",
        chapter: 4,
        verseStart: 6,
        verseEnd: 7,
        text: "Sorgt euch um nichts, sondern bringt in jeder Lage betend und flehend eure Bitten mit Dank vor Gott! Und der Friede Gottes, der alles Verstehen übersteigt, wird eure Herzen und eure Gedanken in der Gemeinschaft mit Christus Jesus bewahren.",
        reference: "Philipper 4,6-7",
        explanation:
          "Der Friede Gottes ist nicht logisch erklärbar. Er übersteigt unser Verstehen — und bewahrt trotzdem unser Herz.",
      },
      {
        bookId: "psalms",
        chapter: 4,
        verseStart: 9,
        text: "In Frieden leg ich mich nieder und schlafe ein; denn du allein, Herr, lässt mich sorglos ruhen.",
        reference: "Psalm 4,9",
        explanation:
          "Frieden, der bis in den Schlaf reicht. Wer bei Gott geborgen ist, kann loslassen — auch die Sorgen der Nacht.",
      },
      {
        bookId: "proverbs",
        chapter: 3,
        verseStart: 23,
        verseEnd: 24,
        text: "Dann gehst du sicher deinen Weg und stößt mit deinem Fuß nicht an. Gehst du zur Ruhe, so schreckt dich nichts auf, legst du dich nieder, erquickt dich dein Schlaf.",
        reference: "Sprüche 3,23-24",
        explanation:
          "Wer mit Gott geht, darf sicher sein — nicht weil der Weg einfach ist, sondern weil er nicht allein geht.",
      },
      {
        bookId: "psalms",
        chapter: 3,
        verseStart: 6,
        text: "Ich lege mich nieder und schlafe ein, ich wache wieder auf, denn der Herr beschützt mich.",
        reference: "Psalm 3,6",
        explanation:
          "Selbst mitten in Bedrohung findet der Psalmist Ruhe — weil Gott über ihn wacht.",
      },
    ],
  },
  {
    id: "staerke-mut",
    title: "Stärke & Mut",
    subtitle: "Kraft, die größer ist als deine Angst",
    icon: "shield",
    introduction:
      "Mut bedeutet nicht, keine Angst zu haben. Mut bedeutet, trotz der Angst weiterzugehen — weil Gott an deiner Seite ist. Diese Verse erinnern daran: Du bist stärker, als du denkst, weil Gott stärker ist, als du ahnst.",
    prayer:
      "Herr, gib mir Mut für das, was vor mir liegt. Wenn ich schwach bin, bist du stark. Lass mich in deiner Kraft weitergehen. Amen.",
    passages: [
      {
        bookId: "isaiah",
        chapter: 41,
        verseStart: 10,
        text: "Fürchte dich nicht, denn ich bin mit dir; hab keine Angst, denn ich bin dein Gott. Ich helfe dir, ja, ich mache dich stark, ja, ich halte dich mit meiner hilfreichen Rechten.",
        reference: "Jesaja 41,10",
        explanation:
          "Dreifache Zusage: Ich bin bei dir, ich stärke dich, ich halte dich. Mehr Sicherheit gibt es nicht.",
      },
      {
        bookId: "philippians",
        chapter: 4,
        verseStart: 13,
        text: "Alles vermag ich durch ihn, der mir Kraft gibt.",
        reference: "Philipper 4,13",
        explanation:
          "Nicht Selbstüberschätzung, sondern Gottvertrauen. Die Kraft kommt nicht aus dir — sie kommt durch dich.",
      },
      {
        bookId: "isaiah",
        chapter: 12,
        verseStart: 2,
        text: "Ja, Gott ist meine Rettung; ihm will ich vertrauen und niemals verzagen. Denn meine Stärke und mein Lied ist der Herr. Er ist für mich zum Retter geworden.",
        reference: "Jesaja 12,2",
        explanation:
          "Stärke und Lobgesang gehören zusammen. Wer Gott vertraut, findet nicht nur Kraft, sondern auch ein Lied.",
      },
      {
        bookId: "exodus",
        chapter: 15,
        verseStart: 2,
        text: "Meine Stärke und mein Lied ist der Herr, er ist für mich zum Retter geworden. Er ist mein Gott, ihn will ich preisen; den Gott meines Vaters will ich rühmen.",
        reference: "2. Mose 15,2",
        explanation:
          "Das Siegeslied nach der Befreiung aus Ägypten. Wenn Gott rettet, bricht Lobpreis hervor.",
      },
      {
        bookId: "psalms",
        chapter: 27,
        verseStart: 1,
        text: "Der Herr ist mein Licht und mein Heil: Vor wem sollte ich mich fürchten? Der Herr ist die Kraft meines Lebens: Vor wem sollte mir bangen?",
        reference: "Psalm 27,1",
        explanation:
          "Zwei rhetorische Fragen, die alles sagen. Wenn Gott für mich ist — wer oder was sollte mich dann erschrecken?",
      },
    ],
  },
  {
    id: "hoffnung-zukunft",
    title: "Hoffnung & Zukunft",
    subtitle: "Es gibt mehr, als du siehst",
    icon: "sunrise",
    introduction:
      "Hoffnung ist kein Wunschdenken. Sie ist das feste Vertrauen, dass Gott einen guten Plan hat — auch wenn wir ihn gerade nicht erkennen. Diese Verse sprechen von einer Zukunft, die heller ist als jede Gegenwart.",
    prayer:
      "Gott, auch wenn ich nicht sehe, was du vorhast — ich vertraue darauf, dass dein Plan gut ist. Schenke mir Hoffnung für morgen. Amen.",
    passages: [
      {
        bookId: "jeremiah",
        chapter: 29,
        verseStart: 11,
        text: "Denn ich, ich kenne meine Pläne, die ich für euch habe - Spruch des Herrn -, Pläne des Heils und nicht des Unheils; denn ich will euch eine Zukunft und eine Hoffnung geben.",
        reference: "Jeremia 29,11",
        explanation:
          "Gottes Pläne sind Pläne des Heils. Selbst in den dunkelsten Momenten arbeitet er an deiner Zukunft.",
      },
      {
        bookId: "isaiah",
        chapter: 40,
        verseStart: 31,
        text: "Die aber, die dem Herrn vertrauen, schöpfen neue Kraft, sie bekommen Flügel wie Adler.",
        reference: "Jesaja 40,31",
        explanation:
          "Neue Kraft — nicht aus eigener Anstrengung, sondern aus dem Vertrauen auf Gott. Wie Adler, die sich vom Wind tragen lassen.",
      },
      {
        bookId: "romans",
        chapter: 12,
        verseStart: 12,
        text: "Freut euch, weil ihr Hoffnung habt, bleibt standhaft in Bedrängnis, seid treu im Gebet!",
        reference: "Römer 12,12",
        explanation:
          "Hoffnung ist der Grund zur Freude. Sie hält uns standhaft, wenn alles wankt.",
      },
      {
        bookId: "lamentations",
        chapter: 3,
        verseStart: 22,
        verseEnd: 23,
        text: "Die Güte des Herrn ist noch nicht zu Ende, sein Erbarmen hört nicht auf. Es ist jeden Morgen neu. Groß ist deine Treue!",
        reference: "Klagelieder 3,22-23",
        explanation:
          "Jeden Morgen beginnt Gottes Gnade neu. Egal wie der gestrige Tag war — heute ist ein neuer Anfang.",
      },
      {
        bookId: "psalms",
        chapter: 23,
        verseStart: 6,
        text: "Lauter Güte und Huld werden mir folgen mein Leben lang, und im Haus des Herrn darf ich wohnen für lange Zeit.",
        reference: "Psalm 23,6",
        explanation:
          "Güte und Gnade sind nicht nur Hoffnung für die Zukunft — sie begleiten uns schon jetzt, jeden einzelnen Tag.",
      },
    ],
  },
  {
    id: "berufung-gottes-wille",
    title: "Berufung & Gottes Wille",
    subtitle: "Dein Leben hat einen Sinn",
    icon: "compass",
    introduction:
      "Du bist kein Zufall. Gott hat einen Plan für dein Leben — nicht um dich einzuengen, sondern um dir Richtung und Sinn zu geben. Diese Verse helfen, den eigenen Platz in Gottes Geschichte zu finden.",
    prayer:
      "Herr, zeige mir, was du mit mir vorhast. Gib mir offene Ohren für deine Stimme und den Mut, dir zu folgen — Schritt für Schritt. Amen.",
    passages: [
      {
        bookId: "jeremiah",
        chapter: 29,
        verseStart: 11,
        text: "Denn ich, ich kenne meine Pläne, die ich für euch habe - Spruch des Herrn -, Pläne des Heils und nicht des Unheils; denn ich will euch eine Zukunft und eine Hoffnung geben.",
        reference: "Jeremia 29,11",
        explanation:
          "Gottes Plan für dein Leben ist kein Zufall. Er kennt den Weg — auch wenn du ihn noch nicht siehst.",
      },
      {
        bookId: "philippians",
        chapter: 1,
        verseStart: 6,
        text: "Ich vertraue darauf, dass er, der bei euch das gute Werk begonnen hat, es auch vollenden wird bis zum Tag Christi Jesu.",
        reference: "Philipper 1,6",
        explanation:
          "Gott hat etwas in dir angefangen. Und er wird es zu Ende bringen. Dein Leben ist ein Werk, an dem Gott noch arbeitet.",
      },
      {
        bookId: "john",
        chapter: 1,
        verseStart: 12,
        text: "Allen aber, die ihn aufnahmen, gab er Macht, Kinder Gottes zu werden, allen, die an seinen Namen glauben.",
        reference: "Johannes 1,12",
        explanation:
          "Deine wichtigste Berufung: Kind Gottes sein. Alles andere wächst daraus.",
      },
      {
        bookId: "proverbs",
        chapter: 3,
        verseStart: 5,
        verseEnd: 6,
        text: "Mit ganzem Herzen vertrau auf den Herrn, bau nicht auf eigene Klugheit; such ihn zu erkennen auf all deinen Wegen, dann ebnet er selbst deine Pfade.",
        reference: "Sprüche 3,5-6",
        explanation:
          "Gottes Willen zu finden beginnt nicht mit einem Plan, sondern mit Vertrauen. Wer ihn sucht, dem zeigt er den Weg.",
      },
      {
        bookId: "isaiah",
        chapter: 41,
        verseStart: 10,
        text: "Fürchte dich nicht, denn ich bin mit dir; hab keine Angst, denn ich bin dein Gott.",
        reference: "Jesaja 41,10",
        explanation:
          "Egal wohin dein Weg führt — Gott geht mit. Das ist die Grundlage jeder Berufung.",
      },
    ],
  },
];
