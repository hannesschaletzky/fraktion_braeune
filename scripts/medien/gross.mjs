import { createRequire } from 'module';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const [,, out, ...files] = process.argv;
const W = 480, H = 600, C = 3;
const tiles = await Promise.all(files.map(async (f, i) => [
  { input: await sharp(f).resize(W, H, { fit: 'inside', background: '#222' }).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * (H + 26) },
  { input: Buffer.from(`<svg width="${W}" height="26"><rect width="100%" height="100%" fill="black"/><text x="5" y="19" font-size="17" fill="yellow" font-family="Arial">${i + 1}: ${f.split('/').pop()}</text></svg>`), left: (i % C) * W, top: Math.floor(i / C) * (H + 26) + H },
]));
await sharp({ create: { width: C * W, height: Math.ceil(files.length / C) * (H + 26), channels: 3, background: '#222' } }).composite(tiles.flat()).jpeg({ quality: 72 }).toFile(out);
