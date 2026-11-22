// Schneidet Clips aus dem Rohmaterial (assets/, nicht im Repo) nach public/videos/<name>.mp4 + .webp (Vorschaubild).
// Ein Clip kann aus mehreren Ausschnitten einer Datei oder aus mehreren Dateien bestehen und wird bei
// Bildschirmaufnahmen auf das Streambild zugeschnitten. Ton wird an jedem Schnitt kurz ein- und ausgeblendet.
// Braucht ffmpeg (brew install ffmpeg). Aufruf: node scripts/clips.mjs [name ...]   (ohne Namen: alle)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import sharp from 'sharp';

const R = 'assets/all_recordings/';
const W = 'assets/ausWhatsApp/';
const A = 'assets/shared_album_apple/';
// Instagram-Export: Stories und Reels liegen teils im Export, teils im separat entpackten media/
const IG = (id) => {
	const treffer = spawnSync('find', ['assets/insta_export', '-name', `${id}.mp4`], { encoding: 'utf8' }).stdout.trim().split('\n')[0];
	if (!treffer) throw new Error(`Instagram-Video ${id} nicht gefunden`);
	return treffer;
};

/**
 * teile: [Datei, Start, Ende] (Ende null = bis Schluss)
 * crop:  ffmpeg-crop "w:h:x:y" in Pixeln der Quelle (für Bildschirmaufnahmen)
 * hoch:  Hochkant-Video vom Handy
 * poster: Sekunde im fertigen Clip für das Vorschaubild (Standard 1)
 * stumm: ohne Tonspur (Reels und Stories mit unterlegter Musik: die Rechte daran haben wir nicht)
 */
const clips = {
	// Im Fernsehen: Kommentar über die Fraktion
	'duesseldorf24-zuendeln': { teile: [[R + 'Screen Recording 2024-05-14 at 20.29.00.mov', 8, 40]], crop: '3448:1940:0:108', poster: 22 },
	'duesseldorf24-shirts': { teile: [[R + 'Screen Recording 2024-05-13 at 15.01.52.mov', 11.2, 44]], crop: '3448:1940:0:108', poster: 14 },
	'muenchen24-traum': {
		teile: [
			[W + 'VIDEO-2024-07-21-21-55-22.mp4', 30.4, 47.6],
			[W + 'VIDEO-2024-07-21-21-55-22.mp4', 77.2, 86],
		],
	},
	'hamburg26-bilder': { teile: [[R + 'Screen Recording 2026-08-10 at 00.10.56.mov', 0, null]], crop: '2750:1547:8:330' },
	'hamburg26-elitesieg': { teile: [[R + 'Screen Recording 2026-08-10 at 01.32.06.mov', 0, null]], crop: '2270:1277:262:84' },

	// Award-Interview auf der Bühne, Timmendorf 2025
	'award25-interview': { teile: [[A + 'IMG_1422.mov', 89, 166]], hoch: true },

	// Aus dem Block (Handy)
	'timmendorf25-makingof': {
		teile: [
			[A + 'IMG_0499.mov', 0, null],
			[A + 'IMG_0503.mov', 0, null],
			[A + 'IMG_0504.mov', 0, null],
			[A + 'IMG_0507.mov', 0, null],
		],
		hoch: true,
	},
	'timmendorf25-fackel': { teile: [[A + 'IMG_0598.mov', 0, null]], hoch: true },
	'timmendorf25-fahne': { teile: [[A + 'IMG_0729.mov', 0, null]], hoch: true },
	'berlin25-pyro': { teile: [[A + 'IMG_9767 (2).mov', 18, 48]], hoch: true },

	// Aus dem Block: unsere Instagram-Stories mit Originalton (Gesänge, Jubel, Pyro)
	'dortmund26-brennt': { teile: [[IG('18107768558334052'), 0, null]], hoch: true, poster: 21 },
	'dortmund26-angezuendet': { teile: [[IG('17988944285851833'), 0, null]], hoch: true, poster: 3 },
	'dortmund26-nele': { teile: [[IG('17866892640645777'), 0, 20]], hoch: true, poster: 5 },
	'hamburg26-pyro': { teile: [[IG('17925667398401067'), 0, 30]], hoch: true, poster: 18 },
	'muenchen26-goated': { teile: [[IG('18097996475601176'), 0, null]], hoch: true, poster: 4 },
	'muenchen26-chenoa': { teile: [[IG('18086029685138250'), 0, 18]], hoch: true, poster: 3 },
	'berlin26-pyrobts': { teile: [[IG('17890284264378149'), 0, null]], hoch: true, poster: 3 },
	'berlin26-fackelreihe': { teile: [[IG('18046417976571310'), 0, null]], hoch: true, poster: 12 },
	'berlin26-feuerwerk': { teile: [[IG('18117450868692699'), 0, null]], hoch: true, poster: 33 },
	'berlin26-trommel': { teile: [[IG('18095074781223588'), 0, null]], hoch: true, poster: 4 },
	'berlin26-fahnen': { teile: [[IG('17911485870223540'), 0, null]], hoch: true, poster: 3 },
	'berlin25-hey': { teile: [[IG('18078541817312463'), 0, null]], hoch: true, poster: 4 },
	'berlin25-licht': { teile: [[IG('17976438464911307'), 0, null]], hoch: true, poster: 2 },
	'berlin25-robinjonas': { teile: [[IG('18039687767393318'), 0, 22]], hoch: true, poster: 10 },
	'berlin25-btspyro': { teile: [[IG('18015423290717085'), 0, null]], hoch: true, poster: 2 },
	'duesseldorf25-paulies': { teile: [[IG('18195162445308395'), 0, null]], hoch: true, poster: 3 },
	'timmendorf24-ericmomme': { teile: [[IG('18240282706274457'), 0, null]], hoch: true, poster: 3 },
	'kuehlungsborn24-mvp': { teile: [[IG('17914065161892403'), 0, null]], hoch: true, poster: 6 },
	'kuehlungsborn24-freak': { teile: [[IG('18364660513103923'), 0, null]], hoch: true, poster: 5 },
	'duesseldorf24-huette': { teile: [[IG('18036237307747065'), 0, null]], hoch: true, poster: 4 },
	'bremen24-schalala': { teile: [[IG('18033214378841792'), 0, null]], hoch: true, poster: 5 },
	'hamburg23gbt-fanclub': { teile: [[IG('18086321017349394'), 0, null]], hoch: true, poster: 1 },
	'hamburg23gbt-achtelfinale': { teile: [[IG('17969807639235967'), 0, null]], hoch: true, poster: 6 },
	'hamburg23gbt-sieg': { teile: [[IG('18367444630049570'), 0, null]], hoch: true, poster: 9 },
	'hamburg23-sverige': { teile: [[IG('18026018026611712'), 0, null]], hoch: true, poster: 7 },
	'berlin23-zustand': { teile: [[IG('17972904869329090'), 0, null]], hoch: true, poster: 12 },
	'berlin23-richie': { teile: [[IG('18011640775824456'), 0, null]], hoch: true, poster: 7 },
	'muenchen25-wirauch': { teile: [[IG('18031603538679791'), 0, null]], hoch: true, poster: 8 },
	'muenchen25-atmo': { teile: [[IG('17902616607218159'), 0, null]], hoch: true, poster: 6 },
	'duesseldorf25-fahnen': { teile: [[IG('18048096161525054'), 0, null]], hoch: true, poster: 4 },
	'duesseldorf24-tuecher': { teile: [[IG('17973986750705600'), 0, null]], hoch: true, poster: 8 },
	'paris24-allez': { teile: [[IG('18343936270136038'), 0, null]], hoch: true, poster: 5 },
	'muenchen24-nacht': { teile: [[IG('18050077033794473'), 0, null]], hoch: true, poster: 6 },
	'muenchen24-feuerwerk': { teile: [[IG('18027380147510704'), 0, null]], hoch: true, poster: 4 },
	'timmendorf23-trommel': { teile: [[IG('18003094021966675'), 0, null]], hoch: true, poster: 4 },
	'timmendorf23-gekommen': { teile: [[IG('17922140525775157'), 0, null]], hoch: true, poster: 5 },
	'hamburg23-support': { teile: [[IG('17989915973488514'), 0, null]], hoch: true, poster: 18 },
	'timmendorf24-mvp': { teile: [[IG('17934347210913264'), 0, null]], hoch: true, poster: 4 },
	'bremen24-tim': { teile: [['assets/2024_Bremen/037d3652-6598-4984-a00e-8222ac1271c0.MP4', 0, null]], hoch: true, poster: 6 },
	// Eigenes Handyvideo, quer gefilmt: mittig auf Hochkant zugeschnitten
	'bremen24-jubel': { teile: [['assets/2024_Bremen/b077f5f9-569e-49d1-8416-f6ed5fea1bdb.MP4', 0, null]], crop: '405:720:437:0', hoch: true, poster: 12 },
	'paris24-olympia': { teile: [[IG('18347289610137992'), 0, null]], hoch: true, poster: 13 },
	'muenchen26-rudern': { teile: [[IG('18218353558332396'), 0, null]], hoch: true, poster: 11 },

	// Reels und Stories mit unterlegter Musik
	'hamburg26-legends': { teile: [[IG('18110183801107532'), 0, null]], hoch: true, poster: 6 },
	'timmendorf25-abfahrt': { teile: [[IG('18087085723869671'), 0, null]], hoch: true, poster: 6 },
	'timmendorf25-gruen': { teile: [[IG('18053289710210406'), 0, null]], hoch: true, poster: 3 },
	'reel-crew': { teile: [[IG('18069536500899792'), 0, null]], hoch: true, poster: 4 },
	'reel-choreo-bts': { teile: [[IG('17877498645476676'), 0, null]], hoch: true, poster: 38 },
	'reel-award-training': { teile: [[IG('18136506835439222'), 0, null]], hoch: true, poster: 24 },
	'reel-dortmund-pov': { teile: [[IG('17887438701612901'), 0, null]], hoch: true, poster: 40 },
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
