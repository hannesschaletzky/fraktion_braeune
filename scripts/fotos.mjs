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
	'2023-timmendorf-medaillen': '2023_09_Timmendorf/2023-09-02_19-12_ordner_@justus.fotos-20230902-DSC09796.jpg',
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
	'choreo-2026-brezel': '2026_07_München1/2026-07-04_13-59_eingang_@justus.fotos-20260704-DSC09579.jpg',
	'choreo-2026-brezel-2': '2026_07_München1/2026-07-04_14-00_eingang_@justus.fotos-20260704-DSC09609.jpg',
	'choreo-2026-brezel-3': '2026_07_München1/2026-07-04_14-00_eingang_@justus.fotos-20260704-DSC09705.jpg',
	'choreo-2026-brezel-spieler': '2026_07_München1/2026-07-04_14-01_eingang_@justus.fotos-20260704-DSC09761.jpg',
	'2026-muenchen-block': '2026_07_München1/2026-07-04_18-44_eingang_@jessiinmotion_DSC00549.jpg',
	'2026-muenchen-rauch': '2026_07_München1/2026-07-04_19-35_eingang_@jessiinmotion_DSC00766.jpg',
	'2026-muenchen-tribuene': '2026_07_München1/2026-07-04_13-57_eingang_@jessiinmotion_DSC00111.jpg',
	'2026-muenchen-1': '2026_07_München1/2026-07-04_16-05_ordner_@justus.fotos-20260704-DSC03254.jpg',
	'2026-muenchen-2': '2026_07_München1/2026-07-04_16-05_ordner_@justus.fotos-20260704-DSC03349-2.jpg',
	'2026-hamburg-1': '2026_08_Elite_Hamburg/2026-08-08_21-30_ordner_pwa2026080820592.jpg',
	'2026-hamburg-2': '2026_08_Elite_Hamburg/2026-08-09_13-31_ordner_pwa202608094188.jpg',
	'2026-hamburg-3': '2026_08_Elite_Hamburg/2026-08-08_21-30_ordner_pwa2026080820523.jpg',
	'2026-dortmund-drohne': '2026_08_Dortmund/2026-08-29_20-07_ordner_@justus.fotos-20260829-DJI_20260829200701_0213_D.jpg',
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
	'2021-kw-tribuene': '2021_07_Königs_Wusterhausen/standbild_livestream-tribuene.jpg',
	'2022-em-schilder': '2022_08_München_EM/eingang_WhatsApp Image 2026-11-22 at 16.24.52 (1).jpeg',
	'2022-em-zelt': '2022_08_München_EM/eingang_WhatsApp Image 2026-11-22 at 16.24.51 (1).jpeg',
	'2022-em-bodypainting': '2022_08_München_EM/eingang_WhatsApp Image 2026-11-22 at 16.24.51 (7).jpeg',
	'2022-em-selfie': '2022_08_München_EM/eingang_WhatsApp Image 2026-11-22 at 16.24.51 (4).jpeg',
	'choreo-2023-kaempfen': '2023_09_Timmendorf/2023-09-03_19-24_eingang_IMG_6804.JPG',
	'choreo-2023-kaempfen-tv': '2023_09_Timmendorf/2023-09-04_00-59_eingang_IMG_6765.PNG',
	'choreo-2023-kaempfen-2': '2023_09_Timmendorf/2023-09-03_19-24_eingang_IMG_6803.JPG',
	'2022-timmendorf-vollgas': '2022_09_Timmendorf/2022-09-04_18-37_eingang_@justus.fotos-DM-Timmendorf-20220904-A1_01963.jpg',
	'2022-timmendorf-leidergeil': '2022_09_Timmendorf/2022-09-04_18-39_eingang_@justus.fotos-DM-Timmendorf-20220904-A1_02041.jpg',
	'2022-timmendorf-1': '2022_09_Timmendorf/whatsapp_WhatsApp Image 2026-11-22 at 12.05.36.jpeg',
	'2022-timmendorf-2': '2022_09_Timmendorf/2022-09-06_01-15_insta-post_18258280174100227.webp',
	'2022-timmendorf-3': '2022_09_Timmendorf/2022-09-09_03-32_insta-post_18313085038026286.webp',
	'2023-bremen-1': '2023_05_Bremen1/2023-05-14_18-47_eingang_@justus.fotos-20230514-DSC09217.jpg',
	'2023-bremen-2': '2023_05_Bremen1/2023-05-14_14-11_eingang_@justus.fotos-20230514-DSC09631.jpg',
	'2023-hamburggbt-sieg': '2023_06_Hamburg/2023-06-05_10-50_eingang_d58bb044-424c-4634-9e98-3f5d313f2e07.JPG',
	'2023-hamburggbt-block': '2023_06_Hamburg/2023-06-04_16-12_eingang_IMG_6659.JPG',
	'2023-hamburggbt-bande': '2023_06_Hamburg/zuschnitt_gbt-post-block.jpg',
	'2023-hamburggbt-selfie': '2023_06_Hamburg/2023-06-02_23-16_eingang_249f45de-2f0d-4f5d-9e37-c11a8369596b.JPG',
	'2023-berlin-b6': '2023_08_Berlin/2023-08-13_15-35_eingang_@kevinmtg.fotos_GBT_Berlin_13082023--127.jpg',
	'2023-berlin-b16': '2023_08_Berlin/2023-08-13_19-04_eingang_@kevinmtg.fotos_GBT_Berlin_13082023--87.jpg',
	'2023-berlin-b18': '2023_08_Berlin/2023-08-13_19-04_eingang_@kevinmtg.fotos_GBT_Berlin_13082023--90.jpg',
	'2023-timmendorf-t29': '2023_09_Timmendorf/2023-09-02_18-46_eingang_@kevinmtg.fotos-Timmendorf23--444.jpeg',
	'2023-timmendorf-t47': '2023_09_Timmendorf/2023-09-03_11-02_eingang_@kevinmtg.fotos-Timmendorf23--7.jpeg',
	'2023-timmendorf-t51': '2023_09_Timmendorf/2023-09-03_11-07_eingang_@kevinmtg.fotos-Timmendorf23--14.jpeg',
	'2023-timmendorf-t72': '2023_09_Timmendorf/2023-09-03_19-25_eingang_@kevinmtg.fotos-Timmendorf23-7083.jpeg',
	'2024-muenchen-m6': '2024_07_München/2024-07-20_20-13_eingang_@kevinmtg.fotos_20240720_MUC1-6690.jpeg',
	'2024-muenchen-m11': '2024_07_München/2024-07-20_20-32_eingang_@kevinmtg.fotos_20240720_MUC1-6766.jpeg',
	'2024-muenchen-m18': '2024_07_München/2024-07-21_16-10_eingang_@kevinmtg.fotos_20240721_MUC1-6959.jpeg',
	'2024-muenchen-m14': '2024_07_München/2024-07-20_20-32_eingang_@kevinmtg.fotos_20240720_MUC1-6773.jpeg',
	'2024-timmendorf-u59': '2024_09_Timmendorf/2024-08-31_19-49_eingang_@kevinmtg.fotos-Timmendorf24-3819.jpeg',
	'2024-timmendorf-u19': '2024_09_Timmendorf/2024-08-30_11-48_eingang_@kevinmtg.fotos-Beachvolleyballkollektion-1079.jpeg',
	'2024-timmendorf-u29': '2024_09_Timmendorf/2024-08-31_17-23_eingang_@kevinmtg.fotos-Timmendorf24-3348.jpeg',
	'2024-timmendorf-u63': '2024_09_Timmendorf/2024-08-31_19-49_eingang_@kevinmtg.fotos-Timmendorf24-3825.jpeg',
	'2024-timmendorf-u89': '2024_09_Timmendorf/2024-09-01_18-47_eingang_@kevinmtg.fotos-Timmendorf24-3698.jpeg',
	'2024-timmendorf-u85': '2024_09_Timmendorf/2024-09-01_18-21_eingang_@kevinmtg.fotos-Timmendorf24-4610.jpeg',
	'2024-timmendorf-u43': '2024_09_Timmendorf/2024-08-31_19-41_eingang_@kevinmtg.fotos-Timmendorf24-3767.jpeg',
	'2025-berlin-l67': '2025_08_Berlin1/2025-08-17_18-48_eingang_@kevinmtg.fotos-_DSC5424.jpeg',
	'2025-berlin-l13': '2025_08_Berlin1/2025-08-15_19-35_eingang_@kevinmtg.fotos-0065.jpeg',
	'2025-berlin-l56': '2025_08_Berlin1/2025-08-16_19-06_eingang_@kevinmtg.fotos-_DSC1277.jpeg',
	'2025-berlin-l50': '2025_08_Berlin1/2025-08-16_18-59_eingang_@kevinmtg.fotos-_DSC4634.jpeg',
	'2025-timmendorf-gruen': '2025_09_Timmendorf/2025-09-05_19-50_eingang_@kevinmtg.fotos_DSC7694.jpeg',
	'2025-timmendorf-rauch': '2025_09_Timmendorf/2025-09-06_21-06_eingang_@kevinmtg.fotos_DSC4326.jpeg',
	'2025-timmendorf-abklatschen': '2025_09_Timmendorf/2025-09-05_15-29_eingang_@kevinmtg.fotos_DSC9985.jpeg',
	'2025-timmendorf-kaempfen': '2025_09_Timmendorf/2025-09-05_18-40_eingang_@justus.fotos-20250905-DSC02024.jpeg',
	'2025-timmendorf-z48': '2025_09_Timmendorf/2025-09-06_19-24_eingang_@kevinmtg.fotos_DSC2060.jpeg',
	'2025-timmendorf-z27': '2025_09_Timmendorf/2025-09-05_15-28_eingang_@kevinmtg.fotos_DSC9897.jpeg',
	'2025-timmendorf-z53': '2025_09_Timmendorf/2025-09-06_21-06_eingang_@kevinmtg.fotos_DSC4275.jpeg',
	'2025-timmendorf-z17': '2025_09_Timmendorf/2025-09-04_18-20_eingang_@justus.fotos-20250904-DSC07025.jpeg',
	'2025-timmendorf-z60': '2025_09_Timmendorf/2025-09-07_19-04_eingang_@kevinmtg.fotos_DSC1115.jpeg',
	'2026-08-dortmund-60830-dsc00354': '2026_08_Dortmund/2026-08-30_16-23_ordner_@justus.fotos-20260830-DSC00354.jpg',
	'2026-08-dortmund-30-182729-7745': '2026_08_Dortmund/2026-08-30_18-27_apple_@kevinmtg.fotos_260830_182729_7745.jpeg',
	'2026-08-dortmund-27-205406-9780': '2026_08_Dortmund/2026-08-27_20-54_ordner_@kevinmtg.fotos_260827_205406_9780.jpg',
	'2026-08-dortmund-60829-dsc05427': '2026_08_Dortmund/2026-08-29_21-40_apple_@justus.fotos-20260829-DSC05427.jpeg',
	'2026-08-dortmund-60827-dsc08322': '2026_08_Dortmund/2026-08-27_15-10_ordner_@justus.fotos-20260827-DSC08322.jpg',
	'2026-08-dortmund-60829-dsc00849': '2026_08_Dortmund/2026-08-29_12-51_apple_@justus.fotos-20260829-DSC00849.jpeg',
	'2026-08-elite-hamburg-otos-1915-0511': '2026_08_Elite_Hamburg/2026-08-09_19-15_ordner_@kevinmtg.fotos_1915_0511.jpg',
	'2026-08-elite-hamburg-wa202608094218': '2026_08_Elite_Hamburg/2026-08-09_13-31_ordner_pwa202608094218.jpg',
	'2026-08-elite-hamburg-otos-2029-6716': '2026_08_Elite_Hamburg/2026-08-07_20-29_ordner_@kevinmtg.fotos-2029_6716.jpg',
	'2026-08-elite-hamburg-otos-1323-2884': '2026_08_Elite_Hamburg/2026-08-09_13-23_ordner_@kevinmtg.fotos_1323_2884.jpg',
	'2026-08-elite-hamburg-otos-2028-6674': '2026_08_Elite_Hamburg/2026-08-07_20-28_ordner_@kevinmtg.fotos-2028_6674.jpg',
	'2026-07-muenchen1-img-9793': '2026_07_München1/2026-07-04_21-01_apple_IMG_9793.jpeg',
	'2026-07-muenchen1-img-9794': '2026_07_München1/2026-07-04_21-00_apple_IMG_9794.jpeg',
	'2026-07-muenchen1-img-8441': '2026_07_München1/2026-07-04_18-35_apple_IMG_8441.jpeg',
	'2026-07-muenchen1-img-8450': '2026_07_München1/2026-07-04_14-00_apple_IMG_8450.jpeg',
	'2026-06-berlin1-212148-dsc5544': '2026_06_Berlin1/2026-06-06_21-21_ordner_@kevinmtg.fotos_260606-212148__DSC5544.jpg',
	'2026-06-berlin1-img-6943': '2026_06_Berlin1/2026-06-06_20-35_apple_IMG_6943.jpeg',
	'2026-06-berlin1-img-6939': '2026_06_Berlin1/2026-06-06_21-04_apple_IMG_6939.jpeg',
	'2026-06-berlin1-img-6964': '2026_06_Berlin1/2026-06-06_22-29_apple_IMG_6964.jpeg',
	'2026-06-berlin1-img-6942': '2026_06_Berlin1/2026-06-06_17-30_apple_IMG_6942.jpeg',
	'2026-06-berlin1-img-6959': '2026_06_Berlin1/2026-06-06_22-08_apple_IMG_6959.jpeg',
	'2025-08-berlin1-50816-dsc06593': '2025_08_Berlin1/2025-08-16_20-00_apple_@justus.fotos-20250816-DSC06593.jpeg',
	'2025-08-berlin1-mtg-fotos-0063': '2025_08_Berlin1/2025-08-15_19-35_eingang_@kevinmtg.fotos-0063.jpeg',
	'2025-07-muenchen2-50712-dsc04834': '2025_07_München2/2025-07-12_15-42_apple_@justus.fotos-20250712-DSC04834.jpeg',
	'2025-07-muenchen2-50712-dsc05105': '2025_07_München2/2025-07-12_15-52_apple_@justus.fotos-20250712-DSC05105.jpeg',
	'2025-07-muenchen2-otos-muc2-0549': '2025_07_München2/2025-07-14_21-19_apple_@kevinmtg.fotos_MUC2-0549.jpeg',
	'2025-07-muenchen2-50712-dsc07610': '2025_07_München2/2025-07-12_18-15_apple_@justus.fotos-20250712-DSC07610.jpeg',
	'2025-07-muenchen2-50712-dsc06378': '2025_07_München2/2025-07-12_16-52_apple_@justus.fotos-20250712-DSC06378.jpeg',
	'2025-07-muenchen2-50713-dsc06046': '2025_07_München2/2025-07-13_18-44_apple_@justus.fotos-20250713-DSC06046.jpeg',
	'2025-07-muenchen2-50712-dsc09684': '2025_07_München2/2025-07-12_20-16_apple_@justus.fotos-20250712-DSC09684.jpeg',
	'2025-05-duesseldorf1-img-6093': '2025_05_Düsseldorf1/2025-05-12_00-10_apple_IMG_6093.jpeg',
	'2025-05-duesseldorf1-img-6112': '2025_05_Düsseldorf1/2025-05-12_00-13_apple_IMG_6112.jpeg',
	'2025-05-duesseldorf1-img-6086': '2025_05_Düsseldorf1/2025-05-12_00-08_apple_IMG_6086.jpeg',
	'2025-05-duesseldorf1-66744133995954': '2025_05_Düsseldorf1/2025-05-18_10-56_insta-post_18066744133995954.jpg',
	'2024-09-timmendorf-mendorf24-3833': '2024_09_Timmendorf/2024-08-31_19-51_ordner_@kevinmtg.fotos-Timmendorf24-3833.jpg',
	'2024-09-timmendorf-mendorf24-3818': '2024_09_Timmendorf/2024-08-31_19-49_eingang_@kevinmtg.fotos-Timmendorf24-3818.jpeg',
	'2024-08-kuehlungsborn2-img-9493': '2024_08_Kühlungsborn2/2024-08-16_19-38_apple_IMG_9493.jpeg',
	'2024-08-kuehlungsborn2-img-2793': '2024_08_Kühlungsborn2/2024-08-17_20-58_apple_IMG_2793.jpeg',
	'2024-08-kuehlungsborn2-img-9503': '2024_08_Kühlungsborn2/2024-08-18_18-18_apple_IMG_9503.jpeg',
	'2024-08-kuehlungsborn2-img-9494': '2024_08_Kühlungsborn2/2024-08-17_20-12_apple_IMG_9494.jpeg',
	'2024-08-kuehlungsborn2-img-9314': '2024_08_Kühlungsborn2/2024-08-16_20-34_apple_IMG_9314.jpeg',
	'2024-08-kuehlungsborn2-img-2795': '2024_08_Kühlungsborn2/2024-08-17_15-47_apple_IMG_2795.jpeg',
	'2024-07-muenchen-1-3ba8ab253ce3': '2024_07_München/2024-07-21_16-10_apple_90F97EE8-ACF0-4057-80A1-3BA8AB253CE3.jpeg',
	'2024-07-muenchen-img-2799': '2024_07_München/2024-07-21_17-58_apple_IMG_2799.jpeg',
	'2024-07-muenchen-32704076284108': '2024_07_München/2024-07-22_08-24_insta-post_18032704076284108.jpg',
	'2023-09-timmendorf-img-6227': '2023_09_Timmendorf/2023-09-03_18-25_apple_IMG_6227.jpeg',
	'2023-09-timmendorf-img-6033': '2023_09_Timmendorf/2023-09-02_19-06_apple_IMG_6033.jpeg',
	'2023-08-berlin-img-5596': '2023_08_Berlin/2023-08-13_19-04_apple_IMG_5596.jpeg',
	'2023-08-berlin-img-5590': '2023_08_Berlin/2023-08-13_18-59_apple_IMG_5590.jpeg',
	'2023-08-berlin-9-90116036771d': '2023_08_Berlin/2023-08-13_18-56_apple_636048F0-E34F-4AB9-B9F9-90116036771D.jpeg',
	'2025-09-timmendorf-fotos-dsc7754': '2025_09_Timmendorf/2025-09-05_19-50_eingang_@kevinmtg.fotos_DSC7754.jpeg',
	'2025-08-berlin1-50816-dsc05337': '2025_08_Berlin1/2025-08-16_19-21_apple_@justus.fotos-20250816-DSC05337.jpeg',
	'2023-08-berlin-erlin-13082023': '2023_08_Berlin/2023-08-13_15-43_eingang_@kevinmtg.fotos_GBT_Berlin_13082023-.jpeg',
	'choreo-2025-lina': '2025_07_München2/2025-07-11_20-20_apple_@justus.fotos-20250711-DSC00589.jpeg',
	'choreo-2025-toursieg': '2025_07_München2/2025-07-12_18-15_apple_@justus.fotos-20250712-DSC07532.jpeg',
	'choreo-2024-ben': '2024_07_München/standbild_gute-besserung-ben.jpg',
	'2026-berlin2-banner': '2026_06_Berlin2/2026-06-13_15-34_eingang_@kevinmtg.fotos_260613-153400__DSC1280.jpg',
	'2023-berlin-sieg': '2023_08_Berlin/2023-08-13_19-18_eingang_@justus.fotos-20230813-DSC06651.jpg',
	'2023-berlin-1': '2023_08_Berlin/2023-08-13_15-43_apple_2B1C7E1C-6227-4E7E-B8AB-06363DB59EDE.jpeg',
	'2023-berlin-2': '2023_08_Berlin/2023-08-13_19-04_apple_0D1828ED-9D1B-42B9-913B-5B8D9BDCBB4B.jpeg',
	'2023-berlin-3': '2023_08_Berlin/2023-08-13_14-59_apple_26CB0AB4-E6C0-44BC-9BAC-645B26416CD8.jpeg',
	'2023-berlin-4': '2023_08_Berlin/2023-08-13_19-04_apple_F97F307F-1B26-43C3-8083-ADE8D282D11B.jpeg',
	'2023-hamburg-shirts': '2023_08_Elite_Hamburg/2023-08-18_23-38_eingang_PHOTO-2023-08-18-23-38-06.jpg',
	'2023-hamburg-netz': '2023_08_Elite_Hamburg/2023-08-18_23-42_eingang_PHOTO-2023-08-18-23-42-21.jpg',
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

	// Nur neue oder geänderte Fotos rechnen: Ist die Datei in src/assets/fotos neuer als das Original und der
	// Fotograf schon bekannt, bleibt sie, wie sie ist. Alles neu rechnen: node scripts/fotos.mjs --alle
	const alle = process.argv.includes('--alle');
	const creditsDatei = path.join(ziel, 'credits.json');
	const bisher = fs.existsSync(creditsDatei) ? JSON.parse(fs.readFileSync(creditsDatei, 'utf8')) : {};
	const credits = {};
	let neu = 0;
	for (const [name, quelle] of Object.entries(auswahl)) {
		const datei = path.join(ziel, `${name}.jpg`);
		if (!alle && name in bisher && fs.existsSync(datei) && fs.statSync(datei).mtimeMs >= fs.statSync(path.join('assets', quelle)).mtimeMs) {
			credits[name] = bisher[name];
			continue;
		}
		neu++;
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
		// Originalname ohne Datum und Herkunft davor (2025-08-16_17-26_apple_…, siehe assets/_werkzeug/einsortieren.mjs)
		const basis = path.basename(quelle).replace(/^(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}_)?(apple|apple-ca|whatsapp|stream|insta-[a-z]+|ordner|eingang|standbild|zuschnitt)_/, '');
		credits[name] =
			basis.match(/^@([a-z0-9._]+?)[-_]/i)?.[1]?.replace(/\.$/, '') ??
			(basis.startsWith('GBT_') ? 'German Beach Tour' : exifFotograf(path.join('assets', quelle)));
		console.log(name, (fs.statSync(datei).size / 1024).toFixed(0), 'KB', credits[name] ?? '');
	}
	fs.writeFileSync(creditsDatei, JSON.stringify(credits, null, '\t') + '\n');
	// Fotos, die nicht mehr in der Auswahl stehen, wegräumen (sonst hängt der Dev-Server an alten Dateien)
	for (const f of fs.readdirSync(ziel)) {
		if (f.endsWith('.jpg') && !(f.slice(0, -4) in auswahl)) {
			fs.rmSync(path.join(ziel, f));
			console.log('entfernt', f);
		}
	}
	console.log(`${neu} Foto(s) neu gerechnet, ${Object.keys(auswahl).length - neu} unverändert`);
}
