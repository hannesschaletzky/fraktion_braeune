// Ordnet IG-Postfotos den Rohdateien in assets/ zu (dHash), damit wir volle Auflösung und Fotograf haben
import { createRequire } from 'module';
import fs from 'fs';
import { execSync } from 'child_process';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const S = process.argv[2];
process.chdir('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/assets');
async function hash(f) {
  const { data } = await sharp(f).rotate().resize(17, 16, { fit: 'fill' }).grayscale().raw().toBuffer({ resolveWithObject: true });
  let h = 0n;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) h = (h << 1n) | (data[y * 17 + x] > data[y * 17 + x + 1] ? 1n : 0n);
  return h;
}
const roh = execSync(`find . -path ./insta_export -prune -o -type f \\( -iname "*.jpg" -o -iname "*.jpeg" \\) -print`).toString().trim().split('\n');
const rh = [];
for (let i = 0; i < roh.length; i += 16) rh.push(...(await Promise.all(roh.slice(i, i + 16).map(async (f) => [f, await hash(f).catch(() => null)]))));
const posts = JSON.parse(fs.readFileSync(`${S}/ig/ig.json`))['posts_1.html'];
const E = fs.readdirSync('insta_export').find((d) => d.startsWith('instagram-'));
const out = {};
for (const p of posts) for (const m of p.media.filter((m) => m.endsWith('.jpg'))) {
  const f = fs.existsSync(`insta_export/${E}/${m}`) ? `insta_export/${E}/${m}` : `insta_export/${m}`;
  const h = await hash(f);
  let best = [999, null];
  for (const [rf, r] of rh) if (r !== null) { let d = 0, x = h ^ r; while (x) { d += Number(x & 1n); x >>= 1n; } if (d < best[0]) best = [d, rf]; }
  out[m.split('/').pop()] = { datum: p.datum, abstand: best[0], roh: best[0] <= 40 ? best[1] : null };
}
fs.writeFileSync(`${S}/ig/abgleich.json`, JSON.stringify(out, null, 1));
const v = Object.values(out); console.log('Postfotos', v.length, 'gefunden', v.filter((x) => x.roh).length);
