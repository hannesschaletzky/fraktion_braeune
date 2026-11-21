import { createRequire } from 'module';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const [,, out, ...files] = process.argv;
const W = 140, H = 249, L = 34, C = 10;
const tiles = await Promise.all(files.map(async (f, i) => [
  { input: await sharp(f).resize(W, H, { fit: 'cover' }).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * (H + L) },
  { input: Buffer.from(`<svg width="${W}" height="${L}"><rect width="100%" height="100%" fill="black"/><text x="3" y="14" font-size="12" fill="yellow" font-family="Arial">${f.replace('.webp','').slice(0,22)}</text><text x="3" y="29" font-size="12" fill="yellow" font-family="Arial">${f.replace('.webp','').slice(22)}</text></svg>`), left: (i % C) * W, top: Math.floor(i / C) * (H + L) + H },
]));
await sharp({ create: { width: C * W, height: Math.ceil(files.length / C) * (H + L), channels: 3, background: '#222' } }).composite(tiles.flat()).jpeg({ quality: 72 }).toFile(out);
