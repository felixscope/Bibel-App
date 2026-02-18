import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://bibel.github.io/ELB2006";
const DELAY_MS = 500;

const NT_BOOKS = [
  { abbr: "Mt",      bookId: "matthew",        chapters: 28, name: "Matthäus",          shortName: "Mt"      },
  { abbr: "Mk",      bookId: "mark",            chapters: 16, name: "Markus",             shortName: "Mk"      },
  { abbr: "Lk",      bookId: "luke",            chapters: 24, name: "Lukas",              shortName: "Lk"      },
  { abbr: "Joh",     bookId: "john",            chapters: 21, name: "Johannes",           shortName: "Joh"     },
  { abbr: "Apg",     bookId: "acts",            chapters: 28, name: "Apostelgeschichte",  shortName: "Apg"     },
  { abbr: "Röm",     bookId: "romans",          chapters: 16, name: "Römer",              shortName: "Röm"     },
  { abbr: "1.Kor",   bookId: "1corinthians",    chapters: 16, name: "1. Korinther",       shortName: "1.Kor"   },
  { abbr: "2.Kor",   bookId: "2corinthians",    chapters: 13, name: "2. Korinther",       shortName: "2.Kor"   },
  { abbr: "Gal",     bookId: "galatians",       chapters: 6,  name: "Galater",            shortName: "Gal"     },
  { abbr: "Eph",     bookId: "ephesians",       chapters: 6,  name: "Epheser",            shortName: "Eph"     },
  { abbr: "Phil",    bookId: "philippians",     chapters: 4,  name: "Philipper",          shortName: "Phil"    },
  { abbr: "Kol",     bookId: "colossians",      chapters: 4,  name: "Kolosser",           shortName: "Kol"     },
  { abbr: "1.Thess", bookId: "1thessalonians",  chapters: 5,  name: "1. Thessalonicher",  shortName: "1.Thess" },
  { abbr: "2.Thess", bookId: "2thessalonians",  chapters: 3,  name: "2. Thessalonicher",  shortName: "2.Thess" },
  { abbr: "1.Tim",   bookId: "1timothy",        chapters: 6,  name: "1. Timotheus",       shortName: "1.Tim"   },
  { abbr: "2.Tim",   bookId: "2timothy",        chapters: 4,  name: "2. Timotheus",       shortName: "2.Tim"   },
  { abbr: "Tit",     bookId: "titus",           chapters: 3,  name: "Titus",              shortName: "Tit"     },
  { abbr: "Phlm",    bookId: "philemon",        chapters: 1,  name: "Philemon",           shortName: "Phlm"    },
  { abbr: "Hebr",    bookId: "hebrews",         chapters: 13, name: "Hebräer",            shortName: "Hebr"    },
  { abbr: "Jak",     bookId: "james",           chapters: 5,  name: "Jakobus",            shortName: "Jak"     },
  { abbr: "1.Petr",  bookId: "1peter",          chapters: 5,  name: "1. Petrus",          shortName: "1.Petr"  },
  { abbr: "2.Petr",  bookId: "2peter",          chapters: 3,  name: "2. Petrus",          shortName: "2.Petr"  },
  { abbr: "1.Joh",   bookId: "1john",           chapters: 5,  name: "1. Johannes",        shortName: "1.Joh"   },
  { abbr: "2.Joh",   bookId: "2john",           chapters: 1,  name: "2. Johannes",        shortName: "2.Joh"   },
  { abbr: "3.Joh",   bookId: "3john",           chapters: 1,  name: "3. Johannes",        shortName: "3.Joh"   },
  { abbr: "Jud",     bookId: "jude",            chapters: 1,  name: "Judas",              shortName: "Jud"     },
  { abbr: "Offb",    bookId: "revelation",      chapters: 22, name: "Offenbarung",        shortName: "Offb"    },
];

const AT_BOOKS = [
  { abbr: "1.Mose",  bookId: "genesis",         chapters: 50,  name: "1. Mose",     shortName: "1.Mose" },
  { abbr: "2.Mose",  bookId: "exodus",           chapters: 40,  name: "2. Mose",     shortName: "2.Mose" },
  { abbr: "3.Mose",  bookId: "leviticus",        chapters: 27,  name: "3. Mose",     shortName: "3.Mose" },
  { abbr: "4.Mose",  bookId: "numbers",          chapters: 36,  name: "4. Mose",     shortName: "4.Mose" },
  { abbr: "5.Mose",  bookId: "deuteronomy",      chapters: 34,  name: "5. Mose",     shortName: "5.Mose" },
  { abbr: "Jos",     bookId: "joshua",           chapters: 24,  name: "Josua",       shortName: "Jos"    },
  { abbr: "Ri",      bookId: "judges",           chapters: 21,  name: "Richter",     shortName: "Ri"     },
  { abbr: "Rut",     bookId: "ruth",             chapters: 4,   name: "Rut",         shortName: "Rut"    },
  { abbr: "1.Sam",   bookId: "1samuel",          chapters: 31,  name: "1. Samuel",   shortName: "1.Sam"  },
  { abbr: "2.Sam",   bookId: "2samuel",          chapters: 24,  name: "2. Samuel",   shortName: "2.Sam"  },
  { abbr: "1.Kön",   bookId: "1kings",           chapters: 22,  name: "1. Könige",   shortName: "1.Kön"  },
  { abbr: "2.Kön",   bookId: "2kings",           chapters: 25,  name: "2. Könige",   shortName: "2.Kön"  },
  { abbr: "1.Chr",   bookId: "1chronicles",      chapters: 29,  name: "1. Chronik",  shortName: "1.Chr"  },
  { abbr: "2.Chr",   bookId: "2chronicles",      chapters: 36,  name: "2. Chronik",  shortName: "2.Chr"  },
  { abbr: "Esra",    bookId: "ezra",             chapters: 10,  name: "Esra",        shortName: "Esr"    },
  { abbr: "Neh",     bookId: "nehemiah",         chapters: 13,  name: "Nehemia",     shortName: "Neh"    },
  { abbr: "Est",     bookId: "esther",           chapters: 10,  name: "Ester",       shortName: "Est"    },
  { abbr: "Hiob",    bookId: "job",              chapters: 42,  name: "Hiob",        shortName: "Hi"     },
  { abbr: "Ps",      bookId: "psalms",           chapters: 150, name: "Psalmen",     shortName: "Ps"     },
  { abbr: "Spr",     bookId: "proverbs",         chapters: 31,  name: "Sprüche",     shortName: "Spr"    },
  { abbr: "Pred",    bookId: "ecclesiastes",     chapters: 12,  name: "Prediger",    shortName: "Pred"   },
  { abbr: "Hld",     bookId: "songofsolomon",    chapters: 8,   name: "Hohelied",    shortName: "Hld"    },
  { abbr: "Jes",     bookId: "isaiah",           chapters: 66,  name: "Jesaja",      shortName: "Jes"    },
  { abbr: "Jer",     bookId: "jeremiah",         chapters: 52,  name: "Jeremia",     shortName: "Jer"    },
  { abbr: "Klgl",    bookId: "lamentations",     chapters: 5,   name: "Klagelieder", shortName: "Klgl"   },
  { abbr: "Hes",     bookId: "ezekiel",          chapters: 48,  name: "Hesekiel",    shortName: "Hes"    },
  { abbr: "Dan",     bookId: "daniel",           chapters: 12,  name: "Daniel",      shortName: "Dan"    },
  { abbr: "Hos",     bookId: "hosea",            chapters: 14,  name: "Hosea",       shortName: "Hos"    },
  { abbr: "Joel",    bookId: "joel",             chapters: 4,   name: "Joel",        shortName: "Joel"   },
  { abbr: "Am",      bookId: "amos",             chapters: 9,   name: "Amos",        shortName: "Am"     },
  { abbr: "Obd",     bookId: "obadiah",          chapters: 1,   name: "Obadja",      shortName: "Obd"    },
  { abbr: "Jona",    bookId: "jonah",            chapters: 4,   name: "Jona",        shortName: "Jona"   },
  { abbr: "Mi",      bookId: "micah",            chapters: 7,   name: "Micha",       shortName: "Mi"     },
  { abbr: "Nah",     bookId: "nahum",            chapters: 3,   name: "Nahum",       shortName: "Nah"    },
  { abbr: "Hab",     bookId: "habakkuk",         chapters: 3,   name: "Habakuk",     shortName: "Hab"    },
  { abbr: "Zef",     bookId: "zephaniah",        chapters: 3,   name: "Zefanja",     shortName: "Zef"    },
  { abbr: "Hag",     bookId: "haggai",           chapters: 2,   name: "Haggai",      shortName: "Hag"    },
  { abbr: "Sach",    bookId: "zechariah",        chapters: 14,  name: "Sacharja",    shortName: "Sach"   },
  { abbr: "Mal",     bookId: "malachi",          chapters: 3,   name: "Maleachi",    shortName: "Mal"    },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} für ${url}`);
  return res.text();
}

function parseChapterHtml(html, chapterNum) {
  const $ = cheerio.load(html);

  // 1. Fußnoten-Map aufbauen: fnNum → Text
  const footnoteMap = new Map();
  $(".biblehtmlcontent.footnotes .fn").each((_, el) => {
    const fnEl = $(el);
    const nameAttr = fnEl.find("sup.fnt a").attr("name"); // "fn3"
    if (!nameAttr) return;
    const fnNum = parseInt(nameAttr.replace("fn", ""), 10);
    fnEl.find("sup.fnt").remove();
    footnoteMap.set(fnNum, fnEl.text().trim());
  });

  // 2. Verse parsen — Node-für-Node traversieren um * korrekt zu positionieren
  const verses = [];
  $("#verses .v").each((_, el) => {
    const verseEl = $(el);
    const idAttr = verseEl.attr("id");
    if (!idAttr) return;
    const verseNum = parseInt(idAttr.replace("v", ""), 10);
    if (isNaN(verseNum)) return;

    const headings = [];
    const textParts = [];
    const footnotes = [];

    const children = verseEl.contents().toArray();
    let i = 0;
    while (i < children.length) {
      const node = children[i];

      if (node.type === "text") {
        textParts.push(node.data);
        i++;
      } else if (node.type === "tag") {
        const tag = node.name;
        const nodeEl = $(node);

        if (tag === "h3") {
          headings.push(nodeEl.text().trim());
          i++;
        } else if (tag === "span" && nodeEl.hasClass("vn")) {
          i++; // Versnummer überspringen
        } else if (tag === "span" && nodeEl.hasClass("br-p")) {
          i++; // Absatzumbruch überspringen
        } else if (tag === "br") {
          i++; // br überspringen
        } else if (tag === "sup" && nodeEl.hasClass("fnm")) {
          // Aufeinanderfolgende sup.fnm als Gruppe zusammenfassen
          const groupFnNums = [];
          while (i < children.length) {
            const cur = children[i];
            if (cur.type === "tag" && cur.name === "sup" && $(cur).hasClass("fnm")) {
              const a = $(cur).find("a").attr("name"); // "fnm3"
              if (a) groupFnNums.push(parseInt(a.replace("fnm", ""), 10));
              i++;
            } else {
              break;
            }
          }
          const groupTexts = groupFnNums.map((n) => footnoteMap.get(n)).filter(Boolean);
          if (groupTexts.length > 0) {
            textParts.push("*"); // Marker an exakter Position im Text
            footnotes.push(groupTexts.join("\n"));
          }
        } else {
          // Andere Tags (z.B. <i>): Textinhalt beibehalten
          textParts.push(nodeEl.text());
          i++;
        }
      } else {
        i++;
      }
    }

    const text = textParts.join("").trim().replace(/\s+/g, " ");
    const verse = { number: verseNum, text };
    if (headings.length > 0) verse.heading = headings.join("\n");
    if (footnotes.length > 0) verse.footnotes = footnotes;
    verses.push(verse);
  });

  return { number: chapterNum, verses };
}

function generateTsFile(bookMeta, chapters, testament) {
  const { bookId, name, shortName } = bookMeta;
  const exportName = /^\d/.test(bookId) ? `_${bookId}` : bookId;
  const testamentValue = testament === "nt" ? "new" : "old";

  const chaptersCode = chapters
    .map((ch) => {
      const versesCode = ch.verses
        .map((v) => {
          const parts = [`number: ${v.number}`, `text: ${JSON.stringify(v.text)}`];
          if (v.heading !== undefined) parts.push(`heading: ${JSON.stringify(v.heading)}`);
          if (v.footnotes && v.footnotes.length > 0) {
            const fnArray = v.footnotes.map((f) => JSON.stringify(f)).join(", ");
            parts.push(`footnotes: [${fnArray}]`);
          }
          return `      { ${parts.join(", ")} }`;
        })
        .join(",\n");
      return `    { number: ${ch.number}, verses: [\n${versesCode},\n    ]}`;
    })
    .join(",\n");

  return `import { Book } from "@/lib/types";

export const ${exportName}: Book = {
  id: "${bookId}",
  name: "${name}",
  shortName: "${shortName}",
  testament: "${testamentValue}",
  chapters: [
${chaptersCode},
  ]
};
`;
}

async function scrapeBook(bookMeta, testament) {
  console.log(`\n📖 ${bookMeta.name} (${bookMeta.chapters} Kapitel)...`);
  const folder = testament === "nt" ? "nt" : "ot";
  const chapters = [];

  for (let ch = 1; ch <= bookMeta.chapters; ch++) {
    const url = `${BASE_URL}/${folder}/${bookMeta.abbr}_${ch}.html`;
    process.stdout.write(`  Kap ${ch}/${bookMeta.chapters}... `);
    const html = await fetchPage(url);
    const chapter = parseChapterHtml(html, ch);
    chapters.push(chapter);
    process.stdout.write(`✓ (${chapter.verses.length} Verse)\n`);
    if (ch < bookMeta.chapters) await sleep(DELAY_MS);
  }

  return chapters;
}

async function scrapeVorwort() {
  const url = `${BASE_URL}/meta/Einl_1.html`;
  console.log(`\n📜 Vorwort scrapen: ${url}`);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const parts = [];
  $(".biblehtmlcontent.prolog").contents().each((_, node) => {
    if (node.type === "text") {
      parts.push(node.data);
    } else if (node.type === "tag") {
      const el = $(node);
      const tag = node.name;
      if (tag === "h2") {
        parts.push(`\n\n${el.text().trim()}\n`);
      } else if (tag === "span" && el.hasClass("br-p")) {
        parts.push("\n\n");
      } else if (tag === "span" && el.hasClass("br-ind")) {
        parts.push("\n  ");
      } else if (tag === "br") {
        parts.push("\n");
      } else {
        // b, i, a, etc. — Textinhalt beibehalten
        parts.push(el.text());
      }
    }
  });

  const text = parts.join("").trim().replace(/\n{3,}/g, "\n\n");
  const outPath = path.join(__dirname, "..", "data", "bibel", "Elberfelder_2006", "vorwort.ts");
  const tsContent = `export const vorwort = ${JSON.stringify(text)};\n\nexport const einleitung = vorwort;\n`;
  fs.writeFileSync(outPath, tsContent, "utf8");
  console.log(`  ✅ Gespeichert: vorwort.ts`);
}

async function main() {
  const arg = process.argv[2];
  if (arg !== "nt" && arg !== "at") {
    console.error("Verwendung: node scrape-elberfelder.mjs nt|at");
    process.exit(1);
  }

  const books = arg === "nt" ? NT_BOOKS : AT_BOOKS;
  const folder = arg === "nt" ? "NT" : "AT";
  const outDir = path.join(__dirname, "..", "data", "bibel", "Elberfelder_2006", folder);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n🔄 Elberfelder 2006 – ${folder} wird gescraped...`);
  console.log(`📁 Ausgabe: ${outDir}\n`);

  let success = 0;
  let errors = 0;

  for (const bookMeta of books) {
    try {
      const chapters = await scrapeBook(bookMeta, arg);
      const tsContent = generateTsFile(bookMeta, chapters, arg);
      const outPath = path.join(outDir, `${bookMeta.bookId}.ts`);
      fs.writeFileSync(outPath, tsContent, "utf8");
      console.log(`  ✅ Gespeichert: ${bookMeta.bookId}.ts`);
      success++;
    } catch (err) {
      console.error(`  ❌ Fehler bei ${bookMeta.name}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✨ Fertig! ${success} Bücher erfolgreich, ${errors} Fehler.`);

  // Vorwort nur beim AT-Lauf generieren
  if (arg === "at") {
    await scrapeVorwort();
  }
}

main();
