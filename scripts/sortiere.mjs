// Teil 1: Legt in jeden Stations-Ordner unter assets/ (JJJJ_MM_Ort) einen Unterordner „auf_der_Seite“ mit den
// Originaldateien, die die Website für diesen Stopp benutzt: Fotos (scripts/fotos.mjs) und die Quellen der Clips
// (scripts/clips.mjs) von Stationen, Choreos und TV-Momenten. So sieht man im Finder, was schon verwendet ist.
//
// Die Dateien sind APFS-Klone (cp -c): sie belegen keinen zusätzlichen Platz, und Änderungen an der Kopie
// berühren das Original nicht. Der Unterordner wird bei jedem Lauf neu erzeugt, also nichts darin von Hand pflegen.
// Aufruf: node scripts/sortiere.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { auswahl } from './fotos.mjs';
import { clips } from './clips.mjs';

const ASSETS = 'assets';
const UNTER = 'auf_der_Seite';
const ordner = fs.readdirSync(ASSETS).filter((d) => /^\d{4}_\d{2}_/.test(d));

/** Stations-Ordner zu Jahr, Monat, Ort, Stopp, Zusatz */
function zielOrdner({ jahr, monat, ort, stopp, zusatz }) {
	const vorne = `${jahr}_${String(monat).padStart(2, '0')}_`;
	const ortKurz = ort.normalize('NFC').slice(0, 6);
	const treffer = ordner.filter((d) => {
		const rest = d.slice(vorne.length).normalize('NFC');
		if (!d.startsWith(vorne) || !rest.includes(ortKurz)) return false;
		if (/elite/i.test(rest) !== /elite/i.test(zusatz ?? '')) return false;
		const nr = rest.match(/(\d)$/)?.[1];
		return !stopp || !nr || Number(nr) === stopp;
	});
	if (treffer.length !== 1) throw new Error(`Kein eindeutiger Ordner für ${vorne}${ort} ${stopp ?? ''} ${zusatz ?? ''}: ${treffer}`);
	return treffer[0];
}

/** Einträge (Stationen bzw. Choreos) grob aus der TS-Datei lesen: Kopfdaten, foto('…') und clips: [...] */
function eintraege(datei) {
	const text = fs.readFileSync(datei, 'utf8');
	const start = text.indexOf('[', text.indexOf('export const'));
	return text
		.slice(start)
		.split(/\n\t\{\n/)
		.slice(1)
		.map((block) => ({
			jahr: Number(block.match(/jahr: (\d{4})/)[1]),
			monat: Number(block.match(/monat: (\d+)/)[1]),
			ort: block.match(/ort: '([^']+)'/)[1],
			stopp: Number(block.match(/stopp: (\d)/)?.[1]) || undefined,
			zusatz: block.match(/zusatz: '([^']+)'/)?.[1],
			fotos: [...block.matchAll(/foto\('([^']+)'/g)].map((m) => m[1]),
			clips: [...(block.match(/clips: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]),
		}));
}

// TV-Momente hängen an keiner Station; Zuordnung nach „wann“ in src/data/clips.ts
const tv = {
	'hamburg26-elitesieg': '2026_08_Elite_Hamburg',
	'hamburg26-respekt': '2026_08_Elite_Hamburg',
	'hamburg26-bilder': '2026_08_Elite_Hamburg',
	'wdr4-dortmund': '2026_08_Dortmund',
	'gbt-allstars': '2025_08_Berlin2',
	'berlin25-chenoa': '2025_08_Berlin1',
	'br24-ultras': '2025_07_München2',
	'gbt-eltern': '2025_07_München2',
	'gbt-geheim': '2025_07_München2',
	'gbt-ericdani': '2025_05_Düsseldorf1',
	'muenchen24-traum': '2024_07_München',
	'duesseldorf24-zuendeln': '2024_05_Düsseldorf',
	'duesseldorf24-shirts': '2024_05_Düsseldorf',
};

/** ordner → Map(Zieldateiname → Quellpfad) */
const plan = new Map();
const nimm = (dir, name, quelle) => {
	if (!fs.existsSync(quelle)) throw new Error(`Quelle fehlt: ${quelle}`);
	if (!plan.has(dir)) plan.set(dir, new Map());
	plan.get(dir).set(`${name}__${path.basename(quelle)}`, quelle);
};
const clipQuellen = (name) => {
	if (!clips[name]) return []; // ältere Clips aus scripts/videos.sh liegen schon in 2023_09_Timmendorf
	return [...new Set(clips[name].teile.map((t) => t[0]))];
};

const vergeben = new Set();
for (const e of [...eintraege('src/data/stationen.ts'), ...eintraege('src/data/choreos.ts')]) {
	const dir = zielOrdner(e);
	for (const f of e.fotos) {
		if (!auswahl[f]) throw new Error(`Foto ${f} fehlt in scripts/fotos.mjs`);
		nimm(dir, f, path.join(ASSETS, auswahl[f]));
		vergeben.add(f);
	}
	for (const c of e.clips) {
		for (const q of clipQuellen(c)) nimm(dir, c, q);
		vergeben.add(c);
	}
}
for (const [c, dir] of Object.entries(tv)) {
	for (const q of clipQuellen(c)) nimm(dir, c, q);
	vergeben.add(c);
}
// TV-Momente aus scripts/videos.sh (Timmendorf 2023): Zeilen „name|Datei|Start|Länge“, die nicht mehr laufen, sind auskommentiert
const sh = fs.readFileSync('scripts/videos.sh', 'utf8');
const shQuelle = sh.match(/^quelle=(\S+)/m)[1];
for (const [, name, datei] of sh.matchAll(/^([a-z0-9-]+)\|([^|]+)\|/gm)) nimm(path.basename(shQuelle), name, path.join(shQuelle, datei));

for (const dir of ordner) fs.rmSync(path.join(ASSETS, dir, UNTER), { recursive: true, force: true });
for (const [dir, dateien] of [...plan].sort()) {
	const ziel = path.join(ASSETS, dir, UNTER);
	fs.mkdirSync(ziel, { recursive: true });
	for (const [name, quelle] of dateien) execFileSync('cp', ['-c', quelle, path.join(ziel, name)]);
	console.log(`${dir}: ${dateien.size}`);
}

const rest = [...Object.keys(auswahl), ...Object.keys(clips)].filter((n) => !vergeben.has(n));
if (rest.length) console.log(`\nKeinem Stopp zugeordnet: ${rest.join(', ')}`);

// ---------------------------------------------------------------------------------------------------------------
// Teil 2: „alles/“ = jedes Foto und Video, das zeitlich zum Stopp passt, mit Datum und Herkunft im Namen.
// Was zu keinem Stopp passt, landet in assets/_ohne_Stopp/ (ohne Datum: _ohne_Stopp/ohne_Datum/).

const ALLES = 'alles';
const OHNE = path.join(ASSETS, '_ohne_Stopp');
const MEDIEN = /\.(jpe?g|png|heic|webp|gif|mov|mp4|m4v)$/i;

// Turnier-Zeiträume aus scripts/medien/events.py, zugeordnet zu den Ordnern
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
for (const z of zeitraeume) if (!ordnerZu[z.key] || !ordner.includes(ordnerZu[z.key])) throw new Error(`Ordner zu ${z.key} fehlt`);

const plusTage = (tag, n) => new Date(Date.parse(tag) + n * 864e5).toISOString().slice(0, 10);
/** Ordner des Stopps zu einem Datum „JJJJ-MM-TT …“; nachlauf = Tage nach dem Turnier, die noch zählen (Posts kommen später) */
function stoppZu(datum, nachlauf = 0) {
	const tag = datum.slice(0, 10);
	const treffer = zeitraeume.filter((z) => z.von <= tag && tag <= plusTage(z.bis, nachlauf));
	return treffer.length ? ordnerZu[treffer.at(-1).key] : null;
}

/** alle Mediendateien direkt in einem Ordner (ohne Unterordner) */
const dateienIn = (dir) =>
	fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => MEDIEN.test(f)).map((f) => path.join(dir, f)) : [];

// Aufnahmedaten per exiftool (Fotos: DateTimeOriginal, Videos: CreationDate mit Zeitzone)
function exifDaten(dateien) {
	if (!dateien.length) return {};
	const liste = path.join(os.tmpdir(), `sortiere-${process.pid}.txt`);
	fs.writeFileSync(liste, dateien.join('\n'));
	const out = execFileSync(
		'exiftool',
		['-fast2', '-j', '-q', '-api', 'QuickTimeUTC', '-d', '%Y-%m-%d %H:%M', '-DateTimeOriginal', '-CreationDate', '-@', liste],
		{ encoding: 'utf8', maxBuffer: 64e6 },
	);
	fs.rmSync(liste);
	const echt = (d) => d && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d) && !d.startsWith('0000');
	return Object.fromEntries(
		JSON.parse(out || '[]').map((x) => [x.SourceFile, [x.DateTimeOriginal, x.CreationDate].find(echt) ?? null]),
	);
}

/** { quelle, datum, herkunft, stopp } */
const medien = [];

// Apple-Album: EXIF; Videos ohne Datum bekommen es von benachbarten IMG_-Nummern, wenn beide Nachbarn zum selben Stopp gehören
{
	const dateien = dateienIn(path.join(ASSETS, 'shared_album_apple'));
	const daten = exifDaten(dateien);
	const nummer = (f) => Number(path.basename(f).match(/^IMG_(\d+)/)?.[1]) || null;
	const mitDatum = dateien.filter((f) => daten[f] && nummer(f)).sort((a, b) => nummer(a) - nummer(b));
	for (const f of dateien) {
		let datum = daten[f];
		let geschaetzt = false;
		const n = nummer(f);
		// Live Photo: Foto mit derselben Nummer hat das Datum
		const zwilling = !datum && n && mitDatum.find((g) => nummer(g) === n);
		if (zwilling) [datum, geschaetzt] = [daten[zwilling], true];
		if (!datum && n) {
			const vor = mitDatum.findLast((g) => nummer(g) < n);
			const nach = mitDatum.find((g) => nummer(g) > n);
			if (vor && nach && n - nummer(vor) <= 30 && nummer(nach) - n <= 30) {
				const s = stoppZu(daten[vor]);
				if (s && s === stoppZu(daten[nach])) [datum, geschaetzt] = [daten[vor], true];
			}
		}
		medien.push({ quelle: f, datum, herkunft: geschaetzt ? 'apple-ca' : 'apple', stopp: datum ? stoppZu(datum) : null });
	}
}

// WhatsApp und Stream-Aufnahmen: Datum steht im Dateinamen
for (const f of dateienIn(path.join(ASSETS, 'ausWhatsApp'))) {
	const m = path.basename(f).match(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
	const datum = m && `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
	medien.push({ quelle: f, datum, herkunft: 'whatsapp', stopp: datum ? stoppZu(datum) : null });
}
for (const f of dateienIn(path.join(ASSETS, 'all_recordings'))) {
	const m = path.basename(f).match(/(\d{4}-\d{2}-\d{2}) at (\d{2})\.(\d{2})/);
	const datum = m && `${m[1]} ${m[2]}:${m[3]}`;
	medien.push({ quelle: f, datum, herkunft: 'stream', stopp: datum ? stoppZu(datum, 1) : null });
}

// Instagram: nur Posts, Reels und Stories aus dem Index (keine Nachrichten o. Ä.)
{
	const ig = JSON.parse(fs.readFileSync(path.join(ASSETS, '_index/ig/ig.json'), 'utf8'));
	const pfade = new Map();
	const sammle = (dir) => {
		for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
			const p = path.join(dir, e.name);
			if (e.isDirectory()) sammle(p);
			else if (MEDIEN.test(e.name)) pfade.set(e.name, p);
		}
	};
	for (const d of fs.readdirSync(path.join(ASSETS, 'insta_export'))) {
		const media = d === 'media' ? path.join(ASSETS, 'insta_export', d) : path.join(ASSETS, 'insta_export', d, 'media');
		if (fs.existsSync(media)) sammle(media);
	}
	const arten = { 'posts_1.html': ['insta-post', 10], 'reels.html': ['insta-reel', 10], 'stories.html': ['insta-story', 1] };
	for (const [datei, [herkunft, nachlauf]] of Object.entries(arten)) {
		for (const eintrag of ig[datei] ?? []) {
			for (const m of eintrag.media) {
				const p = pfade.get(path.basename(m));
				if (!p) continue;
				medien.push({ quelle: p, datum: eintrag.datum || null, herkunft, stopp: eintrag.datum ? stoppZu(eintrag.datum, nachlauf) : null });
			}
		}
	}
}

// Was schon direkt im Stopp-Ordner liegt, gehört zu diesem Stopp
{
	const dateien = ordner.flatMap((d) => dateienIn(path.join(ASSETS, d)));
	const daten = exifDaten(dateien);
	for (const f of dateien) medien.push({ quelle: f, datum: daten[f], herkunft: 'ordner', stopp: path.basename(path.dirname(f)) });
}

// Neu aufbauen
for (const dir of ordner) fs.rmSync(path.join(ASSETS, dir, ALLES), { recursive: true, force: true });
fs.rmSync(OHNE, { recursive: true, force: true });
const zaehler = {};
const belegt = new Set();
for (const m of medien) {
	const vorne = m.datum ? m.datum.replace(' ', '_').replace(':', '-') : null;
	const zielDir = m.stopp ? path.join(ASSETS, m.stopp, ALLES) : m.datum ? OHNE : path.join(OHNE, 'ohne_Datum');
	let name = `${vorne ? vorne + '_' : ''}${m.herkunft}_${path.basename(m.quelle)}`;
	if (belegt.has(path.join(zielDir, name))) continue; // gleiche Datei zweimal im Index (z. B. Post und Reel)
	belegt.add(path.join(zielDir, name));
	fs.mkdirSync(zielDir, { recursive: true });
	execFileSync('cp', ['-c', m.quelle, path.join(zielDir, name)]);
	const k = m.stopp ?? (m.datum ? '_ohne_Stopp' : '_ohne_Stopp/ohne_Datum');
	zaehler[k] = (zaehler[k] ?? 0) + 1;
}
console.log('\nalles/:');
for (const [k, n] of Object.entries(zaehler).sort()) console.log(`  ${k}: ${n}`);
