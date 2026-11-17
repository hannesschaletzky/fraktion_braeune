// Holt die ausgewählten Fotos aus dem Rohmaterial (assets/, nicht im Repo) nach src/assets/fotos/:
// gedreht nach EXIF, lange Kante 2000 px, ohne Metadaten (keine GPS-Daten auf der Website).
// Astro erzeugt daraus beim Build die kleinen AVIF/WebP-Varianten.
// Aufruf: node scripts/fotos.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const auswahl = {
	'2023-timmendorf-1': '2023_Timmendorf/@justus.fotos-20230902-DSC04185.jpg',
	'2023-timmendorf-2': '2023_Timmendorf/@justus.fotos-20230902-DSC09514.jpg',
	'2023-timmendorf-3': '2023_Timmendorf/@kevinmtg.fotos-Timmendorf23--444.jpg',
	'2023-timmendorf-4': '2023_Timmendorf/@kevinmtg.fotos-Timmendorf23--8.jpg',
	'2024-timmendorf-1': '2024_Timmendorf/@justus.fotos-20240830-DSC01645.jpg',
	'2024-timmendorf-2': '2024_Timmendorf/@justus.fotos-20240901-DSC02762.jpg',
	'2024-timmendorf-3': '2024_Timmendorf/@kevinmtg.fotos-Timmendorf24-3327.jpg',
	'2024-timmendorf-4': '2024_Timmendorf/@kevinmtg.fotos-Timmendorf24-3787.jpg',
	'2024-timmendorf-5': '2024_Timmendorf/@kevinmtg.fotos-Timmendorf24-3819.jpg',
	'2024-timmendorf-6': '2024_Timmendorf/GBT_Timmendorfer_Strand_078-2.jpg',
	'2025-timmendorf-1': '2025_Timmendorf/@justus.fotos-20250906-DSC02291.jpg',
	'2025-timmendorf-2': '2025_Timmendorf/@justus.fotos-20250905-DSC02047.jpg',
	'2025-timmendorf-3': '2025_Timmendorf/@justus.fotos-20250906-DSC05146.jpg',
	'2025-timmendorf-4': '2025_Timmendorf/@justus.fotos-20250906-DSC04497.jpg',
	'2025-timmendorf-5': '2025_Timmendorf/@kevinmtg.fotos_DSC4275.jpg',
	'2026-berlin-1': '2026_Berlin/@kevinmtg.fotos_260606-212106_DSC03337.jpg',
	'2026-berlin-2': '2026_Berlin/2ad8936e-4eab-45f5-8f65-2a7304bd44a8.JPG',
	'2026-berlin-3': '2026_Berlin/@kevinmtg.fotos_260606-222916__DSC9607.jpg',
	'2026-berlin-4': '2026_Berlin/@kevinmtg.fotos_260606-223049__DSC9788.jpg',
	'2026-berlin-5': '2026_Berlin/b255b4b8-a1c7-4710-87a3-187d397a5081.JPG',
	'2026-muenchen-1': '2026_München1/@justus.fotos-20260704-DSC03254.jpg',
	'2026-muenchen-2': '2026_München1/@justus.fotos-20260704-DSC03349-2.jpg',
	'2026-hamburg-1': '2026_Elite_Hamburg/pwa2026080820592.jpg',
	'2026-hamburg-2': '2026_Elite_Hamburg/pwa202608094188.jpg',
	'2026-hamburg-3': '2026_Elite_Hamburg/pwa2026080820523.jpg',
	'2026-dortmund-1': '2026_Dortmund/@kevinmtg.fotos_260829_200002_04664.jpg',
	'2026-dortmund-2': '2026_Dortmund/@justus.fotos-20260827-DSC02124.jpg',
	'2026-dortmund-3': '2026_Dortmund/@justus.fotos-20260827-DSC08365.jpg',
};

const ziel = 'src/assets/fotos';
fs.mkdirSync(ziel, { recursive: true });

const credits = {};
for (const [name, quelle] of Object.entries(auswahl)) {
	const datei = path.join(ziel, `${name}.jpg`);
	await sharp(path.join('assets', quelle))
		.rotate()
		.resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(datei);
	// Fotograf steht im Dateinamen (@justus.fotos …), GBT_ = Pressefoto der Tour
	const basis = path.basename(quelle);
	credits[name] = basis.match(/^@([a-z0-9._]+?)[-_]/i)?.[1]?.replace(/\.$/, '') ?? (basis.startsWith('GBT_') ? 'German Beach Tour' : null);
	console.log(name, (fs.statSync(datei).size / 1024).toFixed(0), 'KB', credits[name] ?? '');
}
fs.writeFileSync(path.join(ziel, 'credits.json'), JSON.stringify(credits, null, '\t') + '\n');
