// Sortiert Fotos und Videos in die Stopp-Ordner unter assets/ (JJJJ_MM_Ort[Stopp]) ein, flach und nach Datum benannt:
//   <JJJJ-MM-TT_HH-MM>_<Herkunft>_<Originalname>      z. B. 2025-08-16_17-26_apple_IMG_9817.jpeg
// Was zu keinem Stopp passt, kommt nach _ohne_Stopp/ (ohne Datum: _ohne_Stopp/ohne_Datum/).
//
//   node scripts/medien/einsortieren.mjs          _Eingang/ einsortieren (Dateien werden verschoben) und
//                                                 neu abgelegte Dateien direkt in Stopp-Ordnern umbenennen
//   node scripts/medien/einsortieren.mjs --umzug  einmalig: die alten Sammelordner (Apple-Album, WhatsApp,
//                                                 Stream-Aufnahmen, Instagram-Export) als APFS-Klone einsortieren
//
// Jede Bewegung wird in assets/_index/umzug.json festgehalten (alter Pfad → neuer Pfad, relativ zu assets/).
// Gleicher Inhalt landet nur einmal im selben Ordner. Prüfen: node scripts/medien/pruefe.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const A = 'assets';
const OHNE = '_ohne_Stopp';
const OHNE_DATUM = `${OHNE}/ohne_Datum`;
const MEDIEN = /\.(jpe?g|png|heic|webp|gif|mov|mp4|m4v|avi|3gp)$/i;
const HERKUNFT = ['apple', 'apple-ca', 'whatsapp', 'stream', 'insta-post', 'insta-reel', 'insta-story', 'insta-profil', 'insta-sonst', 'ordner', 'eingang'];
/** schon einsortiert? (Datum optional, dann Herkunft) */
export const EINSORTIERT = new RegExp(`^(\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}_)?(${HERKUNFT.join('|')})_`);
/** Originalname ohne Datum und Herkunft */
export const original = (name) => name.replace(EINSORTIERT, '');

const umzug = process.argv.includes('--umzug');
const stoppOrdner = fs.readdirSync(A).filter((d) => /^\d{4}_\d{2}_/.test(d));

// Turnier-Zeiträume (scripts/medien/events.py) → Stopp-Ordner
const zeitraeume = [...fs.readFileSync('scripts/medien/events.py', 'utf8').matchAll(/\('([\w-]+)',\s*'([\d-]+)',\s*'([\d-]+)'/g)].map(
	([, key, von, bis]) => ({ key, von, bis }),
);
const ordnerZu = {
	'2022-timmendorf': '2022_09_Timmendorf',
	'2023-hamburg-gbt': '2023_06_Hamburg',
	'2023-berlin': '2023_08_Berlin',
	'2023-hamburg': '2023_08_Elite_Hamburg',
	'2023-timmendorf': '2023_09_Timmendorf',
	'2024-duesseldorf': '2024_05_Düsseldorf',
	'2024-bremen': '2024_06_Bremen',
	'2024-muenchen': '2024_07_München',
	'2024-paris': '2024_08_Paris',
	'2024-kuehlungsborn': '2024_08_Kühlungsborn2',
	'2024-timmendorf': '2024_09_Timmendorf',
	'2025-duesseldorf': '2025_05_Düsseldorf1',
	'2025-muenchen': '2025_07_München2',
	'2025-berlin1': '2025_08_Berlin1',
	'2025-berlin2': '2025_08_Berlin2',
	'2025-timmendorf': '2025_09_Timmendorf',
	'2026-berlin1': '2026_06_Berlin1',
	'2026-berlin2': '2026_06_Berlin2',
	'2026-muenchen': '2026_07_München1',
	'2026-hamburg': '2026_08_Elite_Hamburg',
	'2026-dortmund': '2026_08_Dortmund',
};
for (const z of zeitraeume) {
	if (!ordnerZu[z.key] || !stoppOrdner.some((d) => d.normalize('NFC') === ordnerZu[z.key].normalize('NFC')))
		throw new Error(`Ordner zu ${z.key} fehlt (events.py und ordnerZu abgleichen)`);
}
const plusTage = (tag, n) => new Date(Date.parse(tag) + n * 864e5).toISOString().slice(0, 10);
/** Stopp-Ordner zu „JJJJ-MM-TT …“; nachlauf = Tage nach dem Turnier, die noch zählen (Posts kommen später) */
function stoppZu(datum, nachlauf = 0) {
	const tag = datum.slice(0, 10);
	const t = zeitraeume.filter((z) => z.von <= tag && tag <= plusTage(z.bis, nachlauf));
	return t.length ? ordnerZu[t.at(-1).key] : null;
}

const dateienIn = (dir, rekursiv = false) => {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) return rekursiv ? dateienIn(p, true) : [];
		return MEDIEN.test(e.name) ? [p] : [];
	});
};

/** Aufnahmedatum per exiftool (Fotos: DateTimeOriginal, Videos: CreationDate mit Zeitzone) */
function exifDaten(dateien) {
	if (!dateien.length) return {};
	const liste = path.join(os.tmpdir(), `einsortieren-${process.pid}.txt`);
	fs.writeFileSync(liste, dateien.join('\n'));
	const out = execFileSync(
		'exiftool',
		['-fast2', '-j', '-q', '-api', 'QuickTimeUTC', '-d', '%Y-%m-%d %H:%M', '-DateTimeOriginal', '-CreationDate', '-@', liste],
		{ encoding: 'utf8', maxBuffer: 256e6 },
	);
	fs.rmSync(liste);
	const echt = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d) && !d.startsWith('0000');
	return Object.fromEntries(JSON.parse(out || '[]').map((x) => [x.SourceFile, [x.DateTimeOriginal, x.CreationDate].find(echt) ?? null]));
}

/** Datum aus dem Dateinamen (WhatsApp, Bildschirmaufnahmen, Kamera-Namen wie 20230902-DSC…) */
function namensDatum(name) {
	let m = name.match(/(20\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/); // WhatsApp
	if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
	m = name.match(/(20\d{2}-\d{2}-\d{2}) at (\d{2})\.(\d{2})/); // Screen Recording
	if (m) return `${m[1]} ${m[2]}:${m[3]}`;
	m = name.match(/(?<!\d)(20\d{2})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})(?!\d)/); // 20260606212108
	if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
	return null;
}

// --- Einträge sammeln: { quelle, datum, herkunft, stopp, aktion: 'klon' | 'verschieben' } ---
const eintraege = [];

if (umzug) {
	// Apple-Album: EXIF; Videos ohne Datum über das Foto mit derselben Nummer (Live Photo) oder die Nachbarn,
	// wenn beide Nachbarn (höchstens 30 Nummern entfernt) zum selben Stopp gehören
	const apple = dateienIn(path.join(A, 'shared_album_apple'));
	const daten = exifDaten(apple);
	const nummer = (f) => Number(path.basename(f).match(/^IMG_(\d+)/)?.[1]) || null;
	const mitDatum = apple.filter((f) => daten[f] && nummer(f)).sort((a, b) => nummer(a) - nummer(b));
	for (const f of apple) {
		let datum = daten[f];
		let herkunft = 'apple';
		const n = nummer(f);
		if (!datum && n) {
			const zwilling = mitDatum.find((g) => nummer(g) === n);
			const vor = mitDatum.findLast((g) => nummer(g) < n);
			const nach = mitDatum.find((g) => nummer(g) > n);
			if (zwilling) datum = daten[zwilling];
			else if (vor && nach && n - nummer(vor) <= 30 && nummer(nach) - n <= 30 && stoppZu(daten[vor]) && stoppZu(daten[vor]) === stoppZu(daten[nach]))
				datum = daten[vor];
			if (datum) herkunft = 'apple-ca';
		}
		eintraege.push({ quelle: f, datum, herkunft, stopp: datum && stoppZu(datum), aktion: 'klon' });
	}
	for (const f of dateienIn(path.join(A, 'ausWhatsApp'))) {
		const datum = namensDatum(path.basename(f));
		eintraege.push({ quelle: f, datum, herkunft: 'whatsapp', stopp: datum && stoppZu(datum), aktion: 'klon' });
	}
	for (const f of dateienIn(path.join(A, 'all_recordings'))) {
		const datum = namensDatum(path.basename(f));
		eintraege.push({ quelle: f, datum, herkunft: 'stream', stopp: datum && stoppZu(datum, 1), aktion: 'klon' });
	}
	// Instagram: Posts, Reels, Stories, Profilbild, sonstige Inhalte (keine Nachrichten)
	const ig = JSON.parse(fs.readFileSync(path.join(A, '_index/ig/ig.json'), 'utf8'));
	const pfade = new Map();
	for (const d of fs.readdirSync(path.join(A, 'insta_export'))) {
		const media = d === 'media' ? path.join(A, 'insta_export', d) : path.join(A, 'insta_export', d, 'media');
		for (const f of dateienIn(media, true)) pfade.set(path.relative(media, f), f);
	}
	const arten = {
		'posts_1.html': ['insta-post', 10],
		'posts.html': ['insta-post', 10],
		'reels.html': ['insta-reel', 10],
		'stories.html': ['insta-story', 1],
		'profile_photos.html': ['insta-profil', 0],
		'other_content.html': ['insta-sonst', 0],
	};
	const gesehen = new Set();
	for (const [datei, [herkunft, nachlauf]] of Object.entries(arten)) {
		for (const e of ig[datei] ?? []) {
			for (const m of e.media) {
				const p = pfade.get(m.replace(/^media\//, ''));
				if (!p || gesehen.has(p)) continue;
				gesehen.add(p);
				const datum = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(e.datum) ? e.datum : null;
				eintraege.push({ quelle: p, datum, herkunft, stopp: datum && stoppZu(datum, nachlauf), aktion: 'klon' });
			}
		}
	}
	const ohneIndex = [...pfade.values()].filter((p) => !gesehen.has(p));
	for (const p of ohneIndex) eintraege.push({ quelle: p, datum: null, herkunft: 'insta-sonst', stopp: null, aktion: 'klon' });
}

// _Eingang (mit Unterordnern): verschieben, Stopp nach Datum
{
	const neu = dateienIn(path.join(A, '_Eingang'), true);
	const daten = exifDaten(neu);
	for (const f of neu) {
		const datum = daten[f] ?? namensDatum(path.basename(f));
		eintraege.push({ quelle: f, datum, herkunft: 'eingang', stopp: datum && stoppZu(datum), aktion: 'verschieben' });
	}
}

// Dateien direkt im Stopp-Ordner, die noch keinen Datums-Namen haben: dort umbenennen
{
	const roh = stoppOrdner.flatMap((d) => dateienIn(path.join(A, d))).filter((f) => !EINSORTIERT.test(path.basename(f)));
	const daten = exifDaten(roh);
	for (const f of roh) {
		const datum = daten[f] ?? namensDatum(path.basename(f));
		eintraege.push({ quelle: f, datum, herkunft: 'ordner', stopp: path.basename(path.dirname(f)), aktion: 'verschieben' });
	}
}

// --- Ausführen ---
const hashCache = new Map();
function hash(f) {
	if (!hashCache.has(f)) hashCache.set(f, execFileSync('shasum', ['-a', '1', f], { encoding: 'utf8' }).split(' ')[0]);
	return hashCache.get(f);
}
/** Inhalte, die je Zielordner schon liegen: size → [Pfade] */
const imZiel = new Map();
function bestand(dir) {
	if (!imZiel.has(dir)) {
		const m = new Map();
		for (const f of dateienIn(dir)) {
			const s = fs.statSync(f).size;
			m.set(s, [...(m.get(s) ?? []), f]);
		}
		imZiel.set(dir, m);
	}
	return imZiel.get(dir);
}

const protokollDatei = path.join(A, '_index/umzug.json');
const protokoll = fs.existsSync(protokollDatei) ? JSON.parse(fs.readFileSync(protokollDatei, 'utf8')) : {};
const zaehler = {};
let doppelt = 0;

// Stopp-Ordner-Dateien zuerst, damit deren Namen Vorrang haben, wenn gleicher Inhalt auch im Album liegt
eintraege.sort((a, b) => (a.herkunft === 'ordner' ? 0 : 1) - (b.herkunft === 'ordner' ? 0 : 1));
const speichern = () => fs.writeFileSync(protokollDatei, JSON.stringify(protokoll, null, '\t') + '\n');
process.on('exit', speichern); // auch bei einem Fehler festhalten, was schon bewegt wurde
for (const e of eintraege) {
	const zielDir = path.join(A, e.stopp ?? (e.datum ? OHNE : OHNE_DATUM));
	fs.mkdirSync(zielDir, { recursive: true });
	const vorne = e.datum ? `${e.datum.replace(' ', '_').replace(':', '-')}_` : '';
	const basis = `${vorne}${e.herkunft}_${path.basename(e.quelle)}`;
	const groesse = fs.statSync(e.quelle).size;

	// gleicher Inhalt schon im Zielordner?
	const gleich = (bestand(zielDir).get(groesse) ?? []).find((f) => f !== e.quelle && hash(f) === hash(e.quelle));
	let ziel;
	if (gleich) {
		ziel = gleich;
		doppelt++;
		if (e.aktion === 'verschieben' && e.herkunft === 'eingang') fs.rmSync(e.quelle); // schon vorhanden
		else if (e.aktion === 'verschieben') {
			// Stopp-Ordner-Original mit gleichem Inhalt wie eine andere Datei dort: nur umbenennen, nichts löschen
			ziel = null;
		}
	}
	if (!ziel) {
		ziel = path.join(zielDir, basis);
		for (let i = 2; fs.existsSync(ziel); i++) ziel = path.join(zielDir, basis.replace(/(\.[^.]+)$/, ` (${i})$1`));
		if (e.aktion === 'klon') execFileSync('cp', ['-c', '-p', e.quelle, ziel]);
		else fs.renameSync(e.quelle, ziel);
		const m = bestand(zielDir);
		if (e.aktion === 'verschieben' && m.has(groesse)) m.set(groesse, m.get(groesse).filter((f) => f !== e.quelle));
		m.set(groesse, [...(m.get(groesse) ?? []), ziel]);
		if (hashCache.has(e.quelle)) hashCache.set(ziel, hashCache.get(e.quelle));
	}
	protokoll[path.relative(A, e.quelle)] = path.relative(A, ziel);
	const k = path.relative(A, zielDir);
	zaehler[k] = (zaehler[k] ?? 0) + 1;
}
for (const [k, n] of Object.entries(zaehler).sort()) console.log(`${k}: ${n}`);
console.log(`\n${eintraege.length} Dateien, davon ${doppelt} mit gleichem Inhalt schon vorhanden`);
