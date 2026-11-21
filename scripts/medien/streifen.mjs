// node streifen.mjs out.jpg frames pfad1 pfad2 … → je Video eine Zeile mit <frames> Bildern
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
const sharp = createRequire('/Users/hannesschaletzky/repos/01_private/fraktion_braeune/package.json')('sharp');
const [,, out, nf, ...pf] = process.argv;
const N = +nf, W = 120, H = 213, L = 26;
const tmp = out + '.d'; fs.mkdirSync(tmp, { recursive: true });
const tiles = [];
pf.forEach((p, r) => {
  const d = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString();
  for (let k = 0; k < N; k++) {
    const t = (d * (k + 0.5)) / N, f = `${tmp}/${r}-${k}.jpg`;
    execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-ss', String(t), '-i', p, '-frames:v', '1', '-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`, f]);
    tiles.push({ input: f, left: k * W, top: r * (H + L) + L });
  }
  tiles.push({ input: Buffer.from(`<svg width="${N * W}" height="${L}"><rect width="100%" height="100%" fill="black"/><text x="4" y="19" font-size="17" font-weight="bold" fill="yellow" font-family="Arial">${r + 1} · ${d.toFixed(0)}s · ${p.split('/').pop()}</text></svg>`), left: 0, top: r * (H + L) });
});
await sharp({ create: { width: N * W, height: pf.length * (H + L), channels: 3, background: '#222' } }).composite(tiles).jpeg({ quality: 70 }).toFile(out);
fs.rmSync(tmp, { recursive: true });
