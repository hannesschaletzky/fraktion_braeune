// Favicon: Regenbogen aus vier Farben der Überschrift (Rot, Gelb, Grün, Blau) auf dunklem, abgerundetem Quadrat.
// Aus einer SVG-Vorlage rechnet sharp alle Größen. Aufruf: node scripts/favicon.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const farben = ['#ff2e4d', '#ffd23f', '#2fd47a', '#3a8bff']; // --fackel, --sonne, --gruen, --blau
const nacht = '#1a1218'; // --tinte
const breite = 46;
const boegen = farben
	.map((f, i) => {
		const r = 210 - i * breite;
		return `<path d="M ${256 - r} 370 A ${r} ${r} 0 0 1 ${256 + r} 370" fill="none" stroke="${f}" stroke-width="${breite}"/>`;
	})
	.join('');
const svg = (rund) =>
	Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${rund}" fill="${nacht}"/>${boegen}</svg>`);

const ziel = 'public';
const png = (groesse, rund = 112) => sharp(svg(rund), { density: 300 }).resize(groesse, groesse).png();
await png(512).toFile(path.join(ziel, 'icon-512.png'));
await png(192).toFile(path.join(ziel, 'icon-192.png'));
await png(32).toFile(path.join(ziel, 'favicon-32.png'));
// Apple-Icon eckig (iOS rundet selbst ab)
await png(180, 0).toFile(path.join(ziel, 'apple-touch-icon.png'));
// favicon.ico: 48-px-PNG in einer ICO-Hülle, für ältere Browser
const ico = await png(48).toBuffer();
const kopf = Buffer.alloc(22);
kopf.writeUInt16LE(0, 0);
kopf.writeUInt16LE(1, 2);
kopf.writeUInt16LE(1, 4);
kopf[6] = 48;
kopf[7] = 48;
kopf.writeUInt16LE(1, 10);
kopf.writeUInt16LE(32, 12);
kopf.writeUInt32LE(ico.length, 14);
kopf.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(ziel, 'favicon.ico'), Buffer.concat([kopf, ico]));
console.log('Favicons in public/ erzeugt');
