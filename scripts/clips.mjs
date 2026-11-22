// Schneidet Clips aus dem Rohmaterial (assets/, nicht im Repo) nach public/videos/<name>.mp4 + .webp (Vorschaubild).
// Ein Clip kann aus mehreren Ausschnitten einer Datei oder aus mehreren Dateien bestehen und wird bei
// Bildschirmaufnahmen auf das Streambild zugeschnitten. Ton wird an jedem Schnitt kurz ein- und ausgeblendet.
// Braucht ffmpeg (brew install ffmpeg). Aufruf: node scripts/clips.mjs [name ...]   (ohne Namen: alle)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import sharp from 'sharp';

// Quellen liegen in den Stopp-Ordnern unter assets/ (siehe scripts/medien/einsortieren.mjs)

/**
 * teile: [Datei, Start, Ende] (Ende null = bis Schluss)
 * crop:  ffmpeg-crop "w:h:x:y" in Pixeln der Quelle (für Bildschirmaufnahmen)
 * hoch:  Hochkant-Video vom Handy
 * poster: Sekunde im fertigen Clip für das Vorschaubild (Standard 1)
 * stumm: ohne Tonspur (nur im Ausnahmefall: Stories und Reels behalten ihren Ton, auch mit Musik, so will es Hannes)
 */
export const clips = {
	// Im Fernsehen: Kommentar über die Fraktion
	'duesseldorf24-zuendeln': { teile: [['assets/2024_05_Düsseldorf/2024-05-14_20-29_stream_Screen Recording 2024-05-14 at 20.29.00.mov', 8, 40]], crop: '3448:1940:0:108', poster: 22 },
	'duesseldorf24-shirts': { teile: [['assets/2024_05_Düsseldorf/2024-05-13_15-01_stream_Screen Recording 2024-05-13 at 15.01.52.mov', 11.2, 44]], crop: '3448:1940:0:108', poster: 14 },
	'muenchen24-traum': {
		teile: [
			['assets/2024_07_München/2024-07-21_21-55_whatsapp_VIDEO-2024-07-21-21-55-22.mp4', 30.4, 47.6],
			['assets/2024_07_München/2024-07-21_21-55_whatsapp_VIDEO-2024-07-21-21-55-22.mp4', 77.2, 86],
		],
	},
	'berlin25-chenoa': {
		teile: [
			['assets/2025_08_Berlin1/2025-08-17_21-34_stream_Screen Recording 2025-08-17 at 21.34.32.mov', 7, 63],
			['assets/2025_08_Berlin1/2025-08-17_21-34_stream_Screen Recording 2025-08-17 at 21.34.32.mov', 81, 88],
		],
		crop: '1806:1016:16:0',
		poster: 37,
	},
	'hamburg26-bilder': { teile: [['assets/2026_08_Elite_Hamburg/2026-08-10_00-10_stream_Screen Recording 2026-08-10 at 00.10.56.mov', 0, null]], crop: '2750:1547:8:330' },
	'hamburg26-respekt': { teile: [['assets/2026_08_Elite_Hamburg/2026-08-10_00-50_stream_Screen Recording 2026-08-10 at 00.50.33.mov', 0, null]], crop: '2288:1287:304:388', poster: 20 },
	'hamburg26-elitesieg': { teile: [['assets/2026_08_Elite_Hamburg/2026-08-10_01-32_stream_Screen Recording 2026-08-10 at 01.32.06.mov', 0, null]], crop: '2270:1277:262:84' },

	// Fernsehbeitrag BR24 Sport über uns (als Story geteilt, hochkant)
	'br24-ultras': { teile: [['assets/2025_07_München2/2025-07-13_03-15_insta-story_18082518853888070.mp4', 0, null]], hoch: true, poster: 3 },
	// Interviews und Reaktionen aus Stories (hochkant)
	'wdr4-dortmund': { teile: [['assets/2026_08_Dortmund/2026-08-27_05-28_insta-story_18113633092959950.mp4', 0, null]], hoch: true, poster: 5 },
	'twitch-aura': { teile: [['assets/_ohne_Stopp/2026-09-11_05-26_insta-story_18114120593061089.mp4', 6.5, null]], hoch: true, poster: 3 },
	'gbt-allstars': { teile: [['assets/2025_08_Berlin2/2025-08-24_06-58_insta-story_17857239621484690.mp4', 0, null]], hoch: true, poster: 3 },
	'gbt-geheim': { teile: [['assets/2025_07_München2/2025-07-12_03-54_insta-story_18044394341297957.mp4', 0, null]], hoch: true, poster: 30 },
	'gbt-ericdani': { teile: [['assets/2025_05_Düsseldorf1/2025-05-10_08-04_insta-story_18005394017768097.mp4', 9, null]], hoch: true, poster: 32 },
	// GBT-Interview Entweder-oder (Story, hochkant)
	'gbt-eltern': { teile: [['assets/2025_07_München2/2025-07-13_06-08_insta-story_18081912094848707.mp4', 4.4, 24.8]], hoch: true, poster: 12 },

	// Award-Interview auf der Bühne, Timmendorf 2025
	'award25-interview': { teile: [['assets/_ohne_Stopp/ohne_Datum/apple_IMG_1422.mov', 89, 166]], hoch: true },

	// Aus dem Block (Handy)
	'timmendorf25-makingof': {
		teile: [
			['assets/2025_09_Timmendorf/2025-09-03_10-58_apple-ca_IMG_0499.mov', 0, null],
			['assets/2025_09_Timmendorf/2025-09-03_14-19_apple-ca_IMG_0503.mov', 0, null],
			['assets/2025_09_Timmendorf/2025-09-03_14-19_apple-ca_IMG_0504.mov', 0, null],
			['assets/_ohne_Stopp/ohne_Datum/apple_IMG_0507.mov', 0, null],
		],
		hoch: true,
	},
	'timmendorf25-fackel': { teile: [['assets/_ohne_Stopp/ohne_Datum/apple_IMG_0598.mov', 0, null]], hoch: true },
	'timmendorf25-fahne': { teile: [['assets/_ohne_Stopp/ohne_Datum/apple_IMG_0729.mov', 0, null]], hoch: true },
	'berlin25-pyro': { teile: [['assets/2024_09_Timmendorf/2024-09-01_17-25_apple-ca_IMG_9767 (2).mov', 18, 48]], hoch: true },

	// Aus dem Block: unsere Instagram-Stories mit Originalton (Gesänge, Jubel, Pyro)
	'dortmund26-brennt': { teile: [['assets/2026_08_Dortmund/2026-08-29_11-07_insta-story_18107768558334052.mp4', 0, null]], hoch: true, poster: 21 },
	'dortmund26-angezuendet': { teile: [['assets/2026_08_Dortmund/2026-08-28_11-32_insta-story_17988944285851833.mp4', 0, null]], hoch: true, poster: 3 },
	'dortmund26-nele': { teile: [['assets/2026_08_Dortmund/2026-08-28_09-51_insta-story_17866892640645777.mp4', 0, 20]], hoch: true, poster: 5 },
	'hamburg26-pyro': { teile: [['assets/2026_08_Elite_Hamburg/2026-08-08_12-19_insta-story_17925667398401067.mp4', 0, 30]], hoch: true, poster: 18 },
	'muenchen26-goated': { teile: [['assets/2026_07_München1/2026-07-04_12-31_insta-story_18097996475601176.mp4', 0, null]], hoch: true, poster: 4 },
	'muenchen26-chenoa': { teile: [['assets/2026_07_München1/2026-07-03_09-03_insta-story_18086029685138250.mp4', 0, 18]], hoch: true, poster: 3 },
	'berlin26-pyrobts': { teile: [['assets/2026_06_Berlin1/2026-06-06_12-38_insta-story_17890284264378149.mp4', 0, null]], hoch: true, poster: 3 },
	'berlin26-fackelreihe': { teile: [['assets/2026_06_Berlin2/2026-06-13_11-29_insta-story_18046417976571310.mp4', 0, null]], hoch: true, poster: 12 },
	'berlin26-feuerwerk': { teile: [['assets/2026_06_Berlin1/2026-06-06_18-37_insta-story_18117450868692699.mp4', 0, null]], hoch: true, poster: 33 },
	'berlin26-trommel': { teile: [['assets/2026_06_Berlin1/2026-06-06_12-39_insta-story_18095074781223588.mp4', 0, null]], hoch: true, poster: 4 },
	'berlin26-fahnen': { teile: [['assets/2026_06_Berlin2/2026-06-13_06-42_insta-story_17911485870223540.mp4', 0, null]], hoch: true, poster: 3 },
	'berlin25-hey': { teile: [['assets/2025_08_Berlin2/2025-08-23_09-04_insta-story_18078541817312463.mp4', 0, null]], hoch: true, poster: 4 },
	'berlin25-licht': { teile: [['assets/2025_08_Berlin2/2025-08-23_11-25_insta-story_17976438464911307.mp4', 0, null]], hoch: true, poster: 2 },
	'berlin25-robinjonas': { teile: [['assets/2025_08_Berlin1/2025-08-15_09-11_insta-story_18039687767393318.mp4', 0, 22]], hoch: true, poster: 10 },
	'berlin25-btspyro': { teile: [['assets/2025_08_Berlin1/2025-08-15_09-32_insta-story_18015423290717085.mp4', 0, null]], hoch: true, poster: 2 },
	'duesseldorf25-paulies': { teile: [['assets/2025_05_Düsseldorf1/2025-05-10_03-24_insta-story_18195162445308395.mp4', 0, null]], hoch: true, poster: 3 },
	'timmendorf24-ericmomme': { teile: [['assets/2024_09_Timmendorf/2024-08-30_05-32_insta-story_18240282706274457.mp4', 0, null]], hoch: true, poster: 3 },
	'kuehlungsborn24-mvp': { teile: [['assets/2024_08_Kühlungsborn2/2024-08-16_09-40_insta-story_17914065161892403.mp4', 0, null]], hoch: true, poster: 6 },
	'kuehlungsborn24-freak': { teile: [['assets/2024_08_Kühlungsborn2/2024-08-17_10-13_insta-story_18364660513103923.mp4', 0, null]], hoch: true, poster: 5 },
	'duesseldorf24-huette': { teile: [['assets/2024_05_Düsseldorf/2024-05-12_03-57_insta-story_18036237307747065.mp4', 0, null]], hoch: true, poster: 4 },
	'bremen24-schalala': { teile: [['assets/2024_06_Bremen/2024-06-09_04-24_insta-story_18033214378841792.mp4', 0, null]], hoch: true, poster: 5 },
	'hamburg23gbt-fanclub': { teile: [['assets/2023_06_Hamburg/2023-06-03_13-09_insta-story_18086321017349394.mp4', 0, null]], hoch: true, poster: 1 },
	'hamburg23gbt-achtelfinale': { teile: [['assets/2023_06_Hamburg/2023-06-02_11-33_insta-story_17969807639235967.mp4', 0, null]], hoch: true, poster: 6 },
	'hamburg23gbt-sieg': { teile: [['assets/2023_06_Hamburg/2023-06-03_13-08_insta-story_18367444630049570.mp4', 0, null]], hoch: true, poster: 9 },
	'hamburg23-sverige': { teile: [['assets/2023_08_Elite_Hamburg/2023-08-20_04-17_insta-story_18026018026611712.mp4', 0, null]], hoch: true, poster: 7 },
	'berlin23-zustand': { teile: [['assets/2023_08_Berlin/2023-08-16_09-42_insta-reel_17972904869329090.mp4', 0, null]], hoch: true, poster: 12 },
	'berlin23-richie': { teile: [['assets/2023_08_Berlin/2023-08-13_08-21_insta-story_18011640775824456.mp4', 0, null]], hoch: true, poster: 7 },
	'muenchen25-wirauch': { teile: [['assets/2025_07_München2/2025-07-12_09-03_insta-story_18031603538679791.mp4', 0, null]], hoch: true, poster: 8 },
	'muenchen25-atmo': { teile: [['assets/2025_07_München2/2025-07-12_05-50_insta-story_17902616607218159.mp4', 0, null]], hoch: true, poster: 6 },
	'duesseldorf25-fahnen': { teile: [['assets/2025_05_Düsseldorf1/2025-05-10_09-30_insta-story_18048096161525054.mp4', 0, null]], hoch: true, poster: 4 },
	'duesseldorf24-tuecher': { teile: [['assets/2024_05_Düsseldorf/2024-05-12_05-36_insta-story_17973986750705600.mp4', 0, null]], hoch: true, poster: 8 },
	'paris24-allez': { teile: [['assets/2024_08_Paris/2024-08-08_08-11_insta-story_18343936270136038.mp4', 0, null]], hoch: true, poster: 5 },
	'muenchen24-nacht': { teile: [['assets/2024_07_München/2024-07-19_13-13_insta-story_18050077033794473.mp4', 0, null]], hoch: true, poster: 6 },
	'muenchen24-feuerwerk': { teile: [['assets/2024_07_München/2024-07-20_12-51_insta-story_18027380147510704.mp4', 0, null]], hoch: true, poster: 4 },
	'timmendorf23-trommel': { teile: [['assets/2023_09_Timmendorf/2023-08-31_03-21_insta-story_18003094021966675.mp4', 0, null]], hoch: true, poster: 4 },
	'timmendorf23-gekommen': { teile: [['assets/2023_09_Timmendorf/2023-09-01_02-33_insta-story_17922140525775157.mp4', 0, null]], hoch: true, poster: 5 },
	'hamburg23-support': { teile: [['assets/2023_08_Elite_Hamburg/2023-08-17_05-17_insta-story_17989915973488514.mp4', 0, null]], hoch: true, poster: 18 },
	'timmendorf24-mvp': { teile: [['assets/2024_09_Timmendorf/2024-08-31_10-23_insta-story_17934347210913264.mp4', 0, null]], hoch: true, poster: 4 },
	'bremen23-abfahrt': { teile: [['assets/2023_05_Bremen1/2023-05-13_23-54_insta-story_17893895657750574.mp4', 0, null]], hoch: true, poster: 4 },
	'bremen23-block': { teile: [['assets/2023_05_Bremen1/2023-05-14_06-44_insta-story_17986052834029717.mp4', 0, null]], hoch: true, poster: 12 },
	'bremen24-tim': { teile: [['assets/2024_06_Bremen/ordner_037d3652-6598-4984-a00e-8222ac1271c0.MP4', 0, null]], hoch: true, poster: 6 },
	// Eigenes Handyvideo, quer gefilmt: mittig auf Hochkant zugeschnitten
	'bremen24-jubel': { teile: [['assets/2024_06_Bremen/ordner_b077f5f9-569e-49d1-8416-f6ed5fea1bdb.MP4', 0, null]], crop: '405:720:437:0', hoch: true, poster: 12 },
	'paris24-olympia': { teile: [['assets/2024_08_Paris/2024-08-08_09-18_insta-story_18347289610137992.mp4', 0, null]], hoch: true, poster: 13 },
	'muenchen26-rudern': { teile: [['assets/2026_07_München1/2026-07-10_09-04_insta-reel_18218353558332396.mp4', 0, null]], hoch: true, poster: 11 },

	// Reels und Stories mit unterlegter Musik
	'hamburg26-legends': { teile: [['assets/2026_08_Elite_Hamburg/2026-08-09_04-44_insta-story_18110183801107532.mp4', 0, null]], hoch: true, poster: 6 },
	'timmendorf25-abfahrt': { teile: [['assets/2025_09_Timmendorf/2025-09-05_08-47_insta-story_18087085723869671.mp4', 0, null]], hoch: true, poster: 6 },
	'timmendorf25-gruen': { teile: [['assets/2025_09_Timmendorf/2025-09-06_06-45_insta-story_18053289710210406.mp4', 0, null]], hoch: true, poster: 3 },
	'reel-crew': { teile: [['assets/2025_08_Berlin2/2025-08-28_06-49_insta-reel_18069536500899792.mp4', 0, null]], hoch: true, poster: 4 },
	'reel-choreo-bts': { teile: [['assets/2026_06_Berlin1/2026-06-10_06-26_insta-reel_17877498645476676.mp4', 0, null]], hoch: true, poster: 38 },
	'reel-award-training': { teile: [['assets/2025_09_Timmendorf/2025-09-04_01-59_insta-reel_18136506835439222.mp4', 0, null]], hoch: true, poster: 24 },
	'reel-dortmund-pov': { teile: [['assets/2026_08_Dortmund/2026-08-31_06-40_insta-reel_17887438701612901.mp4', 0, null]], hoch: true, poster: 40 },
};

function dauer(datei) {
	const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', datei], { encoding: 'utf8' });
	return parseFloat(r.stdout);
}

// Vorschaubild: ffmpeg liefert ein PNG (nicht jedes ffmpeg kann WebP), sharp macht WebP daraus
async function poster(video, sekunde, ziel) {
	const png = spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-ss', String(sekunde), '-i', video, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-']).stdout;
	await sharp(png).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 72 }).toFile(ziel);
}

// Vorschau-Schleife: 4 s ohne Ton in kleiner Auflösung, läuft automatisch, solange das Video sichtbar ist.
// Das volle Video lädt erst beim Tippen auf Ton oder Vollbild (spart mobil den Großteil der Daten).
function vorschau(name, c = {}) {
	const quelle = `public/videos/${name}.mp4`;
	const len = dauer(quelle);
	const L = Math.min(4, len);
	const start = Math.max(0, Math.min((c.poster ?? 1) - 1.5, len - L));
	const hoch = c.hoch ?? false;
	fs.mkdirSync('public/videos/vorschau', { recursive: true });
	const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-ss', String(start), '-t', String(L), '-i', quelle,
		'-vf', `scale=${hoch ? 320 : 480}:-2,fps=24`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '32', '-profile:v', 'high',
		'-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1', `public/videos/vorschau/${name}.mp4`], { encoding: 'utf8' });
	if (r.status !== 0) console.error(`${name} (Vorschau): FEHLER\n${r.stderr}`);
}

// Nur beim direkten Aufruf schneiden; scripts/sortiere.mjs liest bloß die Liste
if (import.meta.main) {
	if (process.argv[2] === '--vorschau') {
		// Nur Vorschau-Schleifen neu, für alle Videos (auch die aus scripts/videos.sh): node scripts/clips.mjs --vorschau
		for (const f of fs.readdirSync('public/videos').filter((f) => f.endsWith('.mp4'))) vorschau(f.slice(0, -4), clips[f.slice(0, -4)]);
		process.exit(0);
	}

	if (process.argv[2] === '--poster') {
		// Nur Vorschaubilder neu: node scripts/clips.mjs --poster
		for (const [name, c] of Object.entries(clips)) await poster(`public/videos/${name}.mp4`, c.poster ?? 1, `public/videos/${name}.webp`);
		process.exit(0);
	}

	const auswahl = process.argv.slice(2);
	fs.mkdirSync('public/videos', { recursive: true });

	for (const [name, c] of Object.entries(clips)) {
		if (auswahl.length && !auswahl.includes(name)) continue;
		const dateien = [...new Set(c.teile.map((t) => t[0]))];
		const eingaben = dateien.flatMap((d) => ['-i', d]);
		const breite = c.hoch ? 432 : 854;
		const rate = c.hoch ? ['-crf', '30', '-maxrate', '800k', '-bufsize', '1600k'] : ['-crf', '28', '-maxrate', '1300k', '-bufsize', '2600k'];
		const filter = [];
		c.teile.forEach(([datei, start, ende], i) => {
			const n = dateien.indexOf(datei);
			const bis = ende ?? dauer(datei);
			const len = bis - start;
			const bild = [`trim=${start}:${bis}`, 'setpts=PTS-STARTPTS', c.crop && `crop=${c.crop}`, `scale=${breite}:-2`, 'setsar=1', 'fps=30']
				.filter(Boolean)
				.join(',');
			filter.push(`[${n}:v]${bild}[v${i}]`);
			if (!c.stumm) filter.push(
				`[${n}:a]atrim=${start}:${bis},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,` +
					`afade=t=in:d=0.25,afade=t=out:st=${Math.max(0, len - 0.4).toFixed(2)}:d=0.4[a${i}]`,
			);
		});
		const n = c.teile.length;
		const a = c.stumm ? 0 : 1;
		filter.push(`${c.teile.map((_, i) => `[v${i}]` + (a ? `[a${i}]` : '')).join('')}concat=n=${n}:v=1:a=${a}[v]` + (a ? '[a]' : ''));

		const ziel = `public/videos/${name}.mp4`;
		const r = spawnSync(
			'ffmpeg',
			['-nostdin', '-v', 'error', '-y', ...eingaben, '-filter_complex', filter.join(';'), '-map', '[v]', ...(a ? ['-map', '[a]'] : []),
				'-c:v', 'libx264', '-preset', 'slow', ...rate, '-profile:v', 'high', '-pix_fmt', 'yuv420p',
				...(a ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an']), '-movflags', '+faststart', '-map_metadata', '-1', ziel],
			{ encoding: 'utf8' },
		);
		if (r.status !== 0) {
			console.error(`${name}: FEHLER\n${r.stderr}`);
			continue;
		}
		await poster(ziel, c.poster ?? 1, `public/videos/${name}.webp`);
		vorschau(name, c);
		console.log(`${name}: ${dauer(ziel).toFixed(1)} s, ${Math.round(fs.statSync(ziel).size / 1024)} KB`);
	}
}
