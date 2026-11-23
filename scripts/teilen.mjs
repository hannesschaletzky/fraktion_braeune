// Vorschaubild beim Teilen (WhatsApp, Instagram, Google): unser Gruppenfoto aus „Wir“ mit dem bunten Logo unten links.
// 1200 × 630, wird von src/layouts/Layout.astro für alle Seiten benutzt. Aufruf: node scripts/teilen.mjs
import fs from 'node:fs';
import sharp from 'sharp';
import { auswahl } from './fotos.mjs';

const B = 1200, H = 630, LOGO = 420;
const foto = await sharp('assets/' + auswahl['2025-timmendorf-4']).rotate().resize(B, H, { fit: 'cover', position: 'centre' }).jpeg().toBuffer();
const logo = await sharp('src/assets/logo-bunt.png').resize(LOGO).png().toBuffer();
const { height: logoH } = await sharp(logo).metadata();
// Unten leicht abdunkeln, damit das Logo lesbar ist
const verlauf = Buffer.from(
	`<svg width="${B}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#140d16" stop-opacity="0"/><stop offset="1" stop-color="#140d16" stop-opacity="0.85"/></linearGradient></defs><rect width="${B}" height="${H}" fill="url(#g)"/></svg>`,
);
await sharp(foto)
	.composite([{ input: verlauf }, { input: logo, left: 40, top: H - 40 - logoH }])
	.jpeg({ quality: 88 })
	.toFile('src/assets/teilen.jpg');
// Feste Adresse für die Link-Vorschau (WhatsApp & Co. bekommen sie, solange die Seite ein Passwort hat)
fs.copyFileSync('src/assets/teilen.jpg', 'public/vorschau.jpg');
console.log('src/assets/teilen.jpg und public/vorschau.jpg erzeugt');
