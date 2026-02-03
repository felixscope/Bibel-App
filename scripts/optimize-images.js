const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const images = [
  'arche noah.png',
  'david gegen goliath.png',
  'jona im wal.png',
  'jesus und die brote und fische.png',
  'teilung des meeres.png',
  'auferstehung.png'
];

async function optimizeImages() {
  const storiesDir = path.join(publicDir, 'stories');
  if (!fs.existsSync(storiesDir)) {
    fs.mkdirSync(storiesDir, { recursive: true });
  }

  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, 'stories', image.replace('.png', '.jpg'));

    try {
      // Optimize: Convert to JPG, resize to max 1200px width, quality 85
      await sharp(inputPath)
        .resize(1200, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`✓ ${image}`);
      console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(1)} MB`);
      console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)} KB`);
      console.log(`  Saved: ${savings}%\n`);
    } catch (error) {
      console.error(`✗ Error processing ${image}:`, error.message);
    }
  }

  console.log('✅ Image optimization complete!');
}

optimizeImages().catch(console.error);
