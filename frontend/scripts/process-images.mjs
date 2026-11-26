import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('src/assets/images');
const out = path.join(root, 'processed');
const hotelSlugs = ['sea-glass-house', 'monsoon-courtyard', 'aravali-palace-heritage', 'lakehouse-mewar', 'copper-leaf-residence', 'backwater-still', 'cedar-cloud-lodge', 'rain-tree-atelier', 'pink-city-garden'];
const images = [{ source: 'source/hero/hero.jpg', name: 'hero', widths: [1920, 1280, 768], budget: 250_000 },
  ...['mumbai', 'goa', 'jaipur', 'udaipur', 'delhi', 'kochi', 'shimla', 'bengaluru'].map((name) => ({ source: `source/destinations/${name}.jpg`, name: `destinations/${name}`, widths: [1280, 800, 480], budget: 90_000 })),
  ...hotelSlugs.flatMap((slug) => [1, 2, 3].flatMap((n) => ({ source: `source/hotels/${slug}-${n}.jpg`, name: `hotels/${slug}-${n}`, widths: n === 1 ? [1280, 800, 480] : [1280, 800], budget: n === 1 ? 90_000 : 150_000 })))];

await fs.mkdir(out, { recursive: true });
let failures = [];
for (const image of images) {
  const input = path.join(root, image.source);
  await fs.access(input);
  for (const width of image.widths) {
    const base = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    const outputs = [
      { ext: 'webp', buffer: await base.clone().webp({ quality: image.widths[0] === 1920 ? 58 : 40, effort: 6 }).toBuffer() },
      { ext: 'jpg', buffer: await base.clone().jpeg({ quality: image.widths[0] === 1920 ? 64 : 46, mozjpeg: true }).toBuffer() },
    ];
    for (const { ext, buffer } of outputs) {
      const target = path.join(out, `${image.name}-${width}.${ext}`);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, buffer);
      if (buffer.length > image.budget) failures.push(`${path.relative(root, target)} ${buffer.length} > ${image.budget}`);
    }
  }
}
if (failures.length) throw new Error(`Image budget exceeded:\n${failures.join('\n')}`);
console.log(`Processed ${images.length} unique photographs into ${images.reduce((n, image) => n + image.widths.length * 2, 0)} WebP/JPEG renditions.`);
