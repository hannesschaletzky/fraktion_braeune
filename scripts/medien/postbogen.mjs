import { createRequire } from 'module';
import fs from 'fs';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const [,, S, von, bis, out] = process.argv;
const posts = JSON.parse(fs.readFileSync(`${S}/ig/ig.json`))['posts_1.html'].filter((p) => p.datum >= von && p.datum <= bis).sort((a, b) => a.datum.localeCompare(b.datum));
const W = 180, H = 225, L = 24, C = 8;
let y = 0; const tiles = [];
for (const p of posts) {
  const jpgs = p.media.filter((m) => m.endsWith('.jpg'));
  tiles.push({ input: Buffer.from(`<svg width="${C * W}" height="${L}"><rect width="100%" height="100%" fill="#600"/><text x="4" y="18" font-size="16" font-weight="bold" fill="white" font-family="Arial">${p.datum.slice(0, 10)} · ${p.text.replace(/[<>&]/g, '').slice(0, 90)}</text></svg>`), left: 0, top: y });
  y += L;
  for (let i = 0; i < jpgs.length; i++) {
    if (i && i % C === 0) y += H + L;
    const pf = fs.existsSync(jpgs[i]) ? jpgs[i] : '../' + jpgs[i]; const img = await sharp(pf).resize(W, H, { fit: 'cover' }).toBuffer();
    tiles.push({ input: img, left: (i % C) * W, top: y });
    tiles.push({ input: Buffer.from(`<svg width="${W}" height="${L}"><rect width="100%" height="100%" fill="black"/><text x="4" y="17" font-size="14" fill="yellow" font-family="Arial">${i + 1} ${jpgs[i].split('/').pop().slice(-10, -4)}</text></svg>`), left: (i % C) * W, top: y + H });
  }
  y += H + L;
}
await sharp({ create: { width: C * W, height: y, channels: 3, background: '#222' } }).composite(tiles).jpeg({ quality: 70 }).toFile(out);
