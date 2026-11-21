// node raster.mjs S gruppe → bogen/<gruppe>-<n>.jpg, 10 Spalten × 4 Zeilen
import { createRequire } from 'module';
import fs from 'fs';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const [,, S, g] = process.argv;
const ids = JSON.parse(fs.readFileSync(`${S}/ig/gruppen.json`))[g];
const W = 150, H = 267, L = 22, C = 10, R = 4;
for (let s = 0; s * C * R < ids.length; s++) {
  const teil = ids.slice(s * C * R, (s + 1) * C * R);
  const tiles = teil.flatMap((id, i) => {
    const n = s * C * R + i + 1, x = (i % C) * W, y = Math.floor(i / C) * (H + L);
    const lbl = Buffer.from(`<svg width="${W}" height="${L}"><rect width="${W}" height="${L}" fill="black"/><text x="4" y="16" font-size="15" font-weight="bold" fill="yellow" font-family="Arial">${n}</text></svg>`);
    return [{ input: `${S}/ig/frames/${id}.jpg`, left: x, top: y }, { input: lbl, left: x, top: y + H }];
  });
  await sharp({ create: { width: C * W, height: Math.ceil(teil.length / C) * (H + L), channels: 3, background: '#222' } }).composite(tiles).jpeg({ quality: 70 }).toFile(`${S}/ig/bogen/${g}-${s + 1}.jpg`);
}
