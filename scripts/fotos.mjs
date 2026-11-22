// Holt die ausgewählten Fotos aus dem Rohmaterial (assets/, nicht im Repo) nach src/assets/fotos/:
// gedreht nach EXIF, lange Kante 2000 px, ohne Metadaten (keine GPS-Daten auf der Website).
// Astro erzeugt daraus beim Build die kleinen AVIF/WebP-Varianten.
// Aufruf: node scripts/fotos.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

// Fotograf aus den EXIF-Daten (Artist), wenn er nicht im Dateinamen steht. Braucht exiftool (brew install exiftool).
const fotografen = { 'Kevin Mattig': 'kevinmtg.fotos', 'Justus Stegemann': 'justus.fotos', 'Christian Schlüter': 'christianschlueter._' };
function exifFotograf(datei) {
	try {
		const name = execFileSync('exiftool', ['-s3', '-Artist', datei], { encoding: 'utf8' }).trim();
		return fotografen[name] ?? null;
	} catch {
		return null;
	}
}

const IG = 'insta_export/instagram-fraktion_braeune-2026-11-21-sxfKHv2S/media/posts/';

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
	'2026-berlin-feuerwerk': '2026_Berlin/@kevinmtg.fotos_260606-212110__DSC5521.jpg',
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
	// Zusätzlich für die Choreo-Seite
	'choreo-2024-abfahrt': '2024_Timmendorf/@justus.fotos-20240830-DSC03397.jpg',
	'choreo-2024-purple': '2024_Timmendorf/@justus.fotos-20240831-DSC09393.jpg',
	'choreo-berlin-eric': '2026_Berlin/78db66b7-9e3d-473a-bfb5-430a25c62850.JPG',
	'choreo-berlin-toursieg': '2026_Berlin/e48435cb-1dec-4fc0-a437-494fc15f4b29.JPG',
	'choreo-hamburg-legends': '2026_Elite_Hamburg/pwa202608094391.jpg',

	// Aus unseren Instagram-Posts: wenn möglich das Original aus dem Rohmaterial (volle Auflösung, Fotograf im
	// Dateinamen), sonst das Bild aus dem Export (1440 px). Zugeordnet per Bildvergleich.
	'choreo-2024-aufgehts': IG + '18029473928326024.jpg',
	'choreo-2025-koenig': 'shared_album_apple/IMG_6084.jpeg',
	'choreo-2025-pott': IG + '17967075758880785.jpg',
	'choreo-2025-pott-2': 'shared_album_apple/IMG_6104.jpeg',
	'choreo-2025-bayern': 'shared_album_apple/@justus.fotos-20250713-DSC05995.jpeg',
	'choreo-2025-brenn': 'shared_album_apple/BEC0DC11-73A3-45DF-9FC4-EB0E706B5F5F.jpeg',
	'choreo-2025-baerenhorde': 'shared_album_apple/@justus.fotos-20250816-DSC06336.jpeg',
	'choreo-2025-regieren': 'shared_album_apple/@justus.fotos-20250823-DSC01385.jpeg',
	'choreo-2026-fuenf': IG + '17901404775450818.jpg',
	'choreo-2026-elitesieg': IG + '18406589911087258.jpg',
	'2024-muenchen-sieg': '2024_München/656dd144-6cee-4caa-90e4-65ad16b58e9c.jpg',
	'2024-muenchen-1': IG + '17931735692903343.jpg',
	'2024-muenchen-2': IG + '18045148345876955.jpg',
	'2025-duesseldorf-1': IG + '17936489360899116.jpg',
	'2025-duesseldorf-2': IG + '18060262784323720.jpg',
	'2025-muenchen-1': 'shared_album_apple/@kevinmtg.fotos_MUC2-00586-557.jpeg',
	'2025-muenchen-2': 'shared_album_apple/@kevinmtg.fotos_MUC2-00586-455.jpeg',
	'2025-berlin-1': IG + '18056828822454398.jpg',
	'2025-berlin-2': IG + '18068541907915654.jpg',
	'2025-berlin-3': 'shared_album_apple/@kevinmtg.fotos-_DSC4617.jpeg',
	'2022-timmendorf-1': 'insta_export/media/other/18028380295398860.webp',
	'2022-timmendorf-2': 'insta_export/media/other/18258280174100227.webp',
	'2022-timmendorf-3': 'insta_export/media/other/18313085038026286.webp',
	'2023-berlin-1': 'shared_album_apple/2B1C7E1C-6227-4E7E-B8AB-06363DB59EDE.jpeg',
	'2023-berlin-2': 'shared_album_apple/0D1828ED-9D1B-42B9-913B-5B8D9BDCBB4B.jpeg',
	'2023-berlin-3': 'shared_album_apple/26CB0AB4-E6C0-44BC-9BAC-645B26416CD8.jpeg',
	'2023-berlin-4': 'shared_album_apple/F97F307F-1B26-43C3-8083-ADE8D282D11B.jpeg',
	'2023-hamburg-1': 'shared_album_apple/IMG_1958.jpeg',
	'2023-hamburg-2': 'shared_album_apple/IMG_5836.jpeg',
	'2024-duesseldorf-vollgas': '2024_Düsseldorf/IMG_8534.jpg',
	'2024-duesseldorf-court': '2024_Düsseldorf/IMG_8526.HEIC',
	'2024-duesseldorf-1': IG + '202405/18027707966043960.jpg',
	'2024-bremen-1': '2024_Bremen/7cf6a9dd-1756-48a7-a7fe-e04f3a721b9a.JPG',
	'2024-paris-banner': '2024_Paris/IMG_1028.JPG',
	'2024-paris-1': '2024_Paris/IMG_1072.JPG',
	'2024-paris-2': '2024_Paris/IMG_1039.JPG',
	'2025-berlin2-1': 'shared_album_apple/IMG_4087.jpeg',
	'2026-berlin2-1': '2026_Berlin/IMG_3393.JPG',
	'2024-kuehlungsborn-1': 'shared_album_apple/IMG_9492.jpeg',
	'2024-kuehlungsborn-2': 'shared_album_apple/IMG_9495.jpeg',
	'2024-kuehlungsborn-3': 'shared_album_apple/IMG_9497.jpeg',
	'2024-kuehlungsborn-4': 'shared_album_apple/IMG_9502.jpeg',
};

const ziel = 'src/assets/fotos';
fs.mkdirSync(ziel, { recursive: true });

const credits = {};
for (const [name, quelle] of Object.entries(auswahl)) {
	const datei = path.join(ziel, `${name}.jpg`);
	// HEIC (iPhone) kann sharp nicht lesen: vorher mit sips (macOS) nach JPEG wandeln
	let eingabe = path.join('assets', quelle);
	if (/\.heic$/i.test(quelle)) {
		const tmp = path.join(os.tmpdir(), `${name}.jpg`);
		execFileSync('sips', ['-s', 'format', 'jpeg', eingabe, '--out', tmp], { stdio: 'ignore' });
		eingabe = tmp;
	}
	await sharp(eingabe)
		.rotate()
		.resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(datei);
	// Fotograf steht im Dateinamen (@justus.fotos …), GBT_ = Pressefoto der Tour
	const basis = path.basename(quelle);
	credits[name] =
		basis.match(/^@([a-z0-9._]+?)[-_]/i)?.[1]?.replace(/\.$/, '') ??
		(basis.startsWith('GBT_') ? 'German Beach Tour' : exifFotograf(path.join('assets', quelle)));
	console.log(name, (fs.statSync(datei).size / 1024).toFixed(0), 'KB', credits[name] ?? '');
}
fs.writeFileSync(path.join(ziel, 'credits.json'), JSON.stringify(credits, null, '\t') + '\n');
