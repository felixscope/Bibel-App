import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "../public/bible-icon.png");
const out = path.join(__dirname, "../public");

const BG = { r: 250, g: 246, b: 241, alpha: 1 }; // #FAF6F1 Pergament

async function generate(size, filename, solidBg = false) {
  const padding = Math.round(size * 0.1);
  const inner = size - padding * 2;

  let pipeline = sharp(src).resize(inner, inner, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (solidBg) {
    pipeline = pipeline.flatten({ background: BG });
  }

  await sharp({
    create: {
      width: size,
      height: size,
      channels: solidBg ? 3 : 4,
      background: solidBg ? BG : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: await pipeline.png().toBuffer(), gravity: "center" }])
    .png()
    .toFile(path.join(out, filename));

  console.log(`✓ ${filename} (${size}×${size})`);
}

await generate(32, "favicon.png");
await generate(16, "favicon-16.png");
await generate(180, "apple-touch-icon.png", true); // iOS braucht soliden Hintergrund
await generate(192, "icon-192.png", true);
await generate(512, "icon-512.png", true);

console.log("Fertig.");
