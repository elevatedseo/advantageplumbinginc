// Generates the favicon set from the AP emblem in src/assets/images/logo.png.
// Run: node scripts/brand-assets.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const logo = sharp('src/assets/images/logo.png');
const { width, height } = await logo.metadata();
// The AP emblem spans the left ~1.4× the logo height; the wordmark starts after 1.44×.
const emblem = await sharp('src/assets/images/logo.png')
  .extract({ left: 0, top: 0, width: Math.round(height * 1.42), height })
  .png()
  .toBuffer()
  .then((crop) => sharp(crop).trim().png().toBuffer());

const icon = async (size, padding, rounded) => {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(emblem).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const radius = rounded ? Math.round(size * 0.18) : 0;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/></svg>`);
  return sharp(bg).composite([{ input: art, gravity: 'center' }]).png().toBuffer();
};

await writeFile('public/apple-touch-icon.png', await icon(180, 0.1, false));
await writeFile('public/icon-512.png', await icon(512, 0.1, true));
await writeFile('public/icon-192.png', await icon(192, 0.1, true));

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => icon(size, 0.04, true)));
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((data, i) => {
  const entry = 6 + i * 16;
  header.writeUInt8(sizes[i], entry);
  header.writeUInt8(sizes[i], entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...images]));
console.log(`Favicons written from ${width}x${height} logo.`);
