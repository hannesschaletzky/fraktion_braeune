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

export const auswahl = {
	'2023-timmendorf-1': '2023_09_Timmendorf/2023-09-02_12-00_ordner_@justus.fotos-20230902-DSC04185.jpg',
	'2023-timmendorf-2': '2023_09_Timmendorf/2023-09-02_19-10_ordner_@justus.fotos-20230902-DSC09514.jpg',
	'2023-timmendorf-3': '2023_09_Timmendorf/2023-09-02_18-46_ordner_@kevinmtg.fotos-Timmendorf23--444.jpg',
	'2023-timmendorf-4': '2023_09_Timmendorf/2023-09-03_11-02_ordner_@kevinmtg.fotos-Timmendorf23--8.jpg',
	'2024-timmendorf-1': '2024_09_Timmendorf/2024-08-30_15-26_ordner_@justus.fotos-20240830-DSC01645.jpg',
	'2024-timmendorf-2': '2024_09_Timmendorf/2024-09-01_17-45_ordner_@justus.fotos-20240901-DSC02762.jpg',
	'2024-timmendorf-3': '2024_09_Timmendorf/2024-08-31_17-22_ordner_@kevinmtg.fotos-Timmendorf24-3327.jpg',
	'2024-timmendorf-4': '2024_09_Timmendorf/2024-08-31_19-43_ordner_@kevinmtg.fotos-Timmendorf24-3787.jpg',
	'2024-timmendorf-5': '2024_09_Timmendorf/2024-08-31_19-49_ordner_@kevinmtg.fotos-Timmendorf24-3819.jpg',
	'2024-timmendorf-6': '2024_09_Timmendorf/2024-09-01_18-49_ordner_GBT_Timmendorfer_Strand_078-2.jpg',
	'2025-timmendorf-1': '2025_09_Timmendorf/2025-09-06_16-14_ordner_@justus.fotos-20250906-DSC02291.jpg',
	'2025-timmendorf-2': '2025_09_Timmendorf/2025-09-05_18-40_ordner_@justus.fotos-20250905-DSC02047.jpg',
	'2025-timmendorf-3': '2025_09_Timmendorf/2025-09-06_16-17_ordner_@justus.fotos-20250906-DSC05146.jpg',
	'2025-timmendorf-4': '2025_09_Timmendorf/2025-09-06_12-05_ordner_@justus.fotos-20250906-DSC04497.jpg',
	'2025-timmendorf-5': '2025_09_Timmendorf/2025-09-06_21-06_ordner_@kevinmtg.fotos_DSC4275.jpg',
	'2026-berlin-feuerwerk': '2026_06_Berlin1/2026-06-06_21-21_ordner_@kevinmtg.fotos_260606-212110__DSC5521.jpg',
	'2026-berlin-1': '2026_06_Berlin1/2026-06-06_21-21_ordner_@kevinmtg.fotos_260606-212106_DSC03337.jpg',
	'2026-berlin-2': '2026_06_Berlin1/2026-06-14_07-51_ordner_2ad8936e-4eab-45f5-8f65-2a7304bd44a8.JPG',
	'2026-berlin-3': '2026_06_Berlin1/2026-06-06_22-29_ordner_@kevinmtg.fotos_260606-222916__DSC9607.jpg',
	'2026-berlin-4': '2026_06_Berlin1/2026-06-06_22-30_ordner_@kevinmtg.fotos_260606-223049__DSC9788.jpg',
	'2026-berlin-5': '2026_06_Berlin1/ordner_b255b4b8-a1c7-4710-87a3-187d397a5081.JPG',
	'choreo-2026-brezel': '2026_07_München1/whatsapp_WhatsApp Image 2026-11-22 at 18.19.38.jpeg',
	'choreo-2026-brezel-2': '2026_07_München1/whatsapp_WhatsApp Image 2026-11-22 at 18.19.38 (1).jpeg',
	'choreo-2026-brezel-3': '2026_07_München1/whatsapp_WhatsApp Image 2026-11-22 at 18.19.38 (2).jpeg',
	'2026-muenchen-1': '2026_07_München1/2026-07-04_16-05_ordner_@justus.fotos-20260704-DSC03254.jpg',
	'2026-muenchen-2': '2026_07_München1/2026-07-04_16-05_ordner_@justus.fotos-20260704-DSC03349-2.jpg',
	'2026-hamburg-1': '2026_08_Elite_Hamburg/2026-08-08_21-30_ordner_pwa2026080820592.jpg',
	'2026-hamburg-2': '2026_08_Elite_Hamburg/2026-08-09_13-31_ordner_pwa202608094188.jpg',
	'2026-hamburg-3': '2026_08_Elite_Hamburg/2026-08-08_21-30_ordner_pwa2026080820523.jpg',
	'2026-dortmund-1': '2026_08_Dortmund/2026-08-29_20-00_ordner_@kevinmtg.fotos_260829_200002_04664.jpg',
	'2026-dortmund-2': '2026_08_Dortmund/2026-08-27_21-11_ordner_@justus.fotos-20260827-DSC02124.jpg',
	'2026-dortmund-3': '2026_08_Dortmund/2026-08-27_15-10_ordner_@justus.fotos-20260827-DSC08365.jpg',
	// Zusätzlich für die Choreo-Seite
	'choreo-2024-abfahrt': '2024_09_Timmendorf/2024-08-30_11-48_ordner_@justus.fotos-20240830-DSC03397.jpg',
	'choreo-2024-purple': '2024_09_Timmendorf/2024-08-31_18-03_ordner_@justus.fotos-20240831-DSC09393.jpg',
	'choreo-berlin-eric': '2026_06_Berlin1/2026-06-07_19-27_ordner_78db66b7-9e3d-473a-bfb5-430a25c62850.JPG',
	'choreo-berlin-toursieg': '2026_06_Berlin1/2026-06-13_23-05_ordner_e48435cb-1dec-4fc0-a437-494fc15f4b29.JPG',
	'choreo-hamburg-legends': '2026_08_Elite_Hamburg/2026-08-09_13-31_ordner_pwa202608094391.jpg',

	// Aus unseren Instagram-Posts: wenn möglich das Original aus dem Rohmaterial (volle Auflösung, Fotograf im
	// Dateinamen), sonst das Bild aus dem Export (1440 px). Zugeordnet per Bildvergleich.
	'choreo-2024-aufgehts': '2024_07_München/2024-07-22_08-24_insta-post_18029473928326024.jpg',
	'choreo-2025-koenig': '2025_05_Düsseldorf1/2025-05-09_18-25_apple_IMG_6084.jpeg',
	'choreo-2025-pott': '2025_05_Düsseldorf1/2025-05-18_10-56_insta-post_17967075758880785.jpg',
	'choreo-2025-pott-2': '2025_05_Düsseldorf1/2025-05-12_00-12_apple_IMG_6104.jpeg',
	'choreo-2025-bayern': '2025_07_München2/2025-07-13_18-44_apple_@justus.fotos-20250713-DSC05995.jpeg',
	'choreo-2025-brenn': '2025_08_Berlin1/2025-08-15_19-34_apple_BEC0DC11-73A3-45DF-9FC4-EB0E706B5F5F.jpeg',
	'choreo-2025-baerenhorde': '2025_08_Berlin1/2025-08-16_19-59_apple_@justus.fotos-20250816-DSC06336.jpeg',
	'choreo-2025-regieren': '2025_08_Berlin2/2025-08-23_18-23_apple_@justus.fotos-20250823-DSC01385.jpeg',
	'choreo-2026-fuenf': '2026_06_Berlin1/2026-06-09_07-43_insta-post_17901404775450818.jpg',
	'choreo-2026-elitesieg': '2026_08_Elite_Hamburg/2026-08-12_12-45_insta-post_18406589911087258.jpg',
	'2024-muenchen-sieg': '2024_07_München/ordner_656dd144-6cee-4caa-90e4-65ad16b58e9c.jpg',
	'2024-muenchen-1': '2024_07_München/2024-07-22_08-24_insta-post_17931735692903343.jpg',
	'2024-muenchen-2': '2024_07_München/2024-07-22_08-24_insta-post_18045148345876955.jpg',
	'2025-duesseldorf-koenig': '2025_05_Düsseldorf1/2025-05-12_00-10_apple_IMG_6096.jpeg',
	'2025-duesseldorf-abklatschen': '2025_05_Düsseldorf1/2025-05-12_00-13_apple_IMG_6113 (1).jpeg',
	'2025-duesseldorf-1': '2025_05_Düsseldorf1/2025-05-13_10-12_insta-post_17936489360899116.jpg',
	'2025-duesseldorf-2': '2025_05_Düsseldorf1/2025-05-13_10-12_insta-post_18060262784323720.jpg',
	'2025-muenchen-1': '2025_07_München2/2025-07-14_21-06_apple_@kevinmtg.fotos_MUC2-00586-557.jpeg',
	'2025-muenchen-2': '2025_07_München2/2025-07-14_21-05_apple_@kevinmtg.fotos_MUC2-00586-455.jpeg',
	'2025-berlin-1': '2025_08_Berlin1/2025-08-17_09-41_insta-post_18056828822454398.jpg',
	'2025-berlin-2': '2025_08_Berlin1/2025-08-17_09-41_insta-post_18068541907915654.jpg',
	'2025-berlin-3': '2025_08_Berlin1/2025-08-16_18-58_apple_@kevinmtg.fotos-_DSC4617.jpeg',
	'2022-timmendorf-1': '2022_09_Timmendorf/2022-09-05_05-54_insta-post_18028380295398860.webp',
	'2022-timmendorf-2': '2022_09_Timmendorf/2022-09-06_01-15_insta-post_18258280174100227.webp',
	'2022-timmendorf-3': '2022_09_Timmendorf/2022-09-09_03-32_insta-post_18313085038026286.webp',
	'2023-bremen-1': '2023_05_Bremen1/2023-05-14_18-47_eingang_@justus.fotos-20230514-DSC09217.jpg',
	'2023-bremen-2': '2023_05_Bremen1/2023-05-14_14-11_eingang_@justus.fotos-20230514-DSC09631.jpg',
	'2023-berlin-sieg': '2023_08_Berlin/2023-08-13_19-18_eingang_@justus.fotos-20230813-DSC06651.jpg',
	'2023-berlin-1': '2023_08_Berlin/2023-08-13_15-43_apple_2B1C7E1C-6227-4E7E-B8AB-06363DB59EDE.jpeg',
	'2023-berlin-2': '2023_08_Berlin/2023-08-13_19-04_apple_0D1828ED-9D1B-42B9-913B-5B8D9BDCBB4B.jpeg',
	'2023-berlin-3': '2023_08_Berlin/2023-08-13_14-59_apple_26CB0AB4-E6C0-44BC-9BAC-645B26416CD8.jpeg',
	'2023-berlin-4': '2023_08_Berlin/2023-08-13_19-04_apple_F97F307F-1B26-43C3-8083-ADE8D282D11B.jpeg',
	'2023-hamburg-1': '2023_08_Elite_Hamburg/2023-08-18_17-17_apple_IMG_1958.jpeg',
	'2023-hamburg-2': '2023_08_Elite_Hamburg/2023-08-20_17-31_apple_IMG_5836.jpeg',
	'2024-duesseldorf-vollgas': '2024_05_Düsseldorf/ordner_IMG_8534.jpg',
	'2024-duesseldorf-court': '2024_05_Düsseldorf/2024-05-12_14-20_ordner_IMG_8526.HEIC',
	'2024-duesseldorf-1': '2024_05_Düsseldorf/2024-05-13_10-07_insta-post_18027707966043960.jpg',
	'2024-bremen-1': '2024_06_Bremen/ordner_7cf6a9dd-1756-48a7-a7fe-e04f3a721b9a.JPG',
	'2024-paris-banner': '2024_08_Paris/2024-08-08_16-08_ordner_IMG_1028.JPG',
	'2024-paris-1': '2024_08_Paris/2024-08-08_21-33_ordner_IMG_1072.JPG',
	'2024-paris-2': '2024_08_Paris/2024-08-08_16-48_ordner_IMG_1039.JPG',
	'2025-berlin2-1': '2025_08_Berlin2/2025-08-23_19-51_apple_IMG_4087.jpeg',
	'2026-berlin2-1': '2026_06_Berlin1/2026-06-13_22-04_ordner_IMG_3393.JPG',
	'2024-kuehlungsborn-1': '2024_08_Kühlungsborn2/2024-08-16_21-24_apple_IMG_9492.jpeg',
	'2024-kuehlungsborn-2': '2024_08_Kühlungsborn2/2024-08-17_20-15_apple_IMG_9495.jpeg',
	'2024-kuehlungsborn-3': '2024_08_Kühlungsborn2/2024-08-18_17-16_apple_IMG_9497.jpeg',
	'2024-kuehlungsborn-4': '2024_08_Kühlungsborn2/2024-08-18_18-18_apple_IMG_9502.jpeg',
};

// Nur beim direkten Aufruf verarbeiten; scripts/sortiere.mjs liest bloß die Auswahl
if (import.meta.main) {
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
		// Originalname ohne Datum und Herkunft davor (2025-08-16_17-26_apple_…, siehe scripts/medien/einsortieren.mjs)
		const basis = path.basename(quelle).replace(/^(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}_)?(apple|apple-ca|whatsapp|stream|insta-[a-z]+|ordner|eingang)_/, '');
		credits[name] =
			basis.match(/^@([a-z0-9._]+?)[-_]/i)?.[1]?.replace(/\.$/, '') ??
			(basis.startsWith('GBT_') ? 'German Beach Tour' : exifFotograf(path.join('assets', quelle)));
		console.log(name, (fs.statSync(datei).size / 1024).toFixed(0), 'KB', credits[name] ?? '');
	}
	fs.writeFileSync(path.join(ziel, 'credits.json'), JSON.stringify(credits, null, '\t') + '\n');
}
