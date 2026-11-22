// Sortiert Fotos und Videos in die Stopp-Ordner unter assets/ (JJJJ_MM_Ort[Stopp]) ein, flach und nach Datum benannt:
//   <JJJJ-MM-TT_HH-MM>_<Herkunft>_<Originalname>      z. B. 2025-08-16_17-26_apple_IMG_9817.jpeg
// Was zu keinem Stopp passt, kommt nach _ohne_Stopp/ (ohne Datum: _ohne_Stopp/ohne_Datum/).
// Welcher Stopp zu welchem Datum gehört, steht im Turnierkalender scripts/medien/termine.json
// (alle Turniere seit 2021; „ordner“ und „fenster“ nur bei denen, wo wir dabei waren).
//
//   node scripts/medien/einsortieren.mjs
//     1. _Eingang/ (mit Unterordnern) nach Datum verschieben
//     2. Dateien, die direkt in einen Stopp-Ordner gelegt wurden, dort nach Datum umbenennen
//     3. _ohne_Stopp/ nachsortieren, falls ein Datum jetzt in ein Turnierfenster fällt (z. B. nach neuem Kalendereintrag)
//
// Jede Bewegung landet in assets/_index/umzug.json (alter → neuer Pfad, relativ zu assets/); Pfade in
// scripts/fotos.mjs, scripts/clips.mjs und scripts/videos.sh werden mitgezogen. Gleicher Inhalt landet nur
// einmal im selben Ordner. Den ersten Umzug (2026-11-22) aus den alten Sammelordnern zeigt die Git-Historie.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const A = 'assets';
const OHNE = '_ohne_Stopp';
const OHNE_DATUM = `${OHNE}/ohne_Datum`;
const MEDIEN = /\.(jpe?g|png|heic|webp|gif|mov|mp4|m4v|avi|3gp)$/i;
const HERKUNFT = ['apple', 'apple-ca', 'whatsapp', 'stream', 'insta-post', 'insta-reel', 'insta-story', 'insta-profil', 'insta-sonst', 'ordner', 'eingang', 'standbild', 'zuschnitt'];
const EINSORTIERT = new RegExp(`^(\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}_)?(${HERKUNFT.join('|')})_`);
/** Tage nach dem Turnier, die je Herkunft noch zählen (Posts kommen oft erst später) */
const NACHLAUF = { 'insta-post': 10, 'insta-reel': 10, 'insta-story': 1, stream: 1 };

// Turnierkalender
const termine = JSON.parse(fs.readFileSync('scripts/medien/termine.json', 'utf8'));
const dabei = termine.filter((t) => t.ordner);
for (const t of dabei) fs.mkdirSync(path.join(A, t.ordner), { recursive: true });
const plusTage = (tag, n) => new Date(Date.parse(tag) + n * 864e5).toISOString().slice(0, 10);
/** Stopp-Ordner zu „JJJJ-MM-TT …“ */
function stoppZu(datum, herkunft) {
	const tag = datum.slice(0, 10);
	const t = dabei.filter((t) => t.fenster[0] <= tag && tag <= plusTage(t.fenster[1], NACHLAUF[herkunft] ?? 0));
	return t.length ? t.at(-1).ordner : null;
}
/** Turnier aus dem Kalender, bei dem wir laut Ordnern nicht waren (für den Hinweis am Ende) */
const fremd = (datum) => termine.find((t) => !t.ordner && t.von && plusTage(t.von, -1) <= datum.slice(0, 10) && datum.slice(0, 10) <= plusTage(t.bis, 1));

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
		['-fast', '-j', '-q', '-api', 'QuickTimeUTC', '-d', '%Y-%m-%d %H:%M', '-DateTimeOriginal', '-CreationDate', '-CreateDate', '-FileModifyDate', '-@', liste],
		{ encoding: 'utf8', maxBuffer: 256e6 },
	);
	fs.rmSync(liste);
	const echt = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d) && !d.startsWith('0000');
	// CreateDate (Videos) nur, wenn es nicht bloß der Tag des Exports/Kopierens ist (sonst gleich dem Dateidatum)
	const erstellt = (x) => (echt(x.CreateDate) && Math.abs(Date.parse(x.CreateDate) - Date.parse(String(x.FileModifyDate).slice(0, 16))) > 2 * 864e5 ? x.CreateDate : null);
	return Object.fromEntries(JSON.parse(out || '[]').map((x) => [x.SourceFile, [x.DateTimeOriginal, x.CreationDate].find(echt) ?? erstellt(x)]));
}

/** Datum aus dem Dateinamen (WhatsApp, Bildschirmaufnahmen, Kamera-Namen wie 20230902-DSC…) */
function namensDatum(name) {
	let m = name.match(/(20\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/); // WhatsApp
	if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
	if (/^WhatsApp (Image|Video)/.test(name)) return null; // Datum im Namen = Tag des Teilens, nicht der Aufnahme
	m = name.match(/^Screen Recording (20\d{2}-\d{2}-\d{2}) at (\d{2})\.(\d{2})/);
	if (m) return `${m[1]} ${m[2]}:${m[3]}`;
	m = name.match(/(?<!\d)(20\d{2})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})(?!\d)/); // 20260606212108
	if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
	return null;
}

/** { quelle, datum, herkunft, stopp, name? } – name gesetzt = Dateiname bleibt (nur Ordner wechselt) */
const eintraege = [];

// 1. _Eingang; liegt eine Datei in einem Unterordner, der wie ein Stopp-Ordner heißt (z. B. _Eingang/2022_08_München_EM/),
//    gehört sie zu diesem Stopp, sonst entscheidet das Datum
{
	const neu = dateienIn(path.join(A, '_Eingang'), true);
	const daten = exifDaten(neu);
	const ordner = new Set(fs.readdirSync(A).filter((d) => /^\d{4}_\d{2}_/.test(d)).map((d) => d.normalize('NFC')));
	for (const f of neu) {
		const datum = daten[f] ?? namensDatum(path.basename(f));
		const unter = path.relative(path.join(A, '_Eingang'), f).split(path.sep)[0].normalize('NFC');
		const stopp = ordner.has(unter) ? unter : datum && stoppZu(datum, 'eingang');
		eintraege.push({ quelle: f, datum, herkunft: 'eingang', stopp });
	}
}
// 2. direkt in Stopp-Ordner gelegt
{
	const stoppOrdner = fs.readdirSync(A).filter((d) => /^\d{4}_\d{2}_/.test(d));
	const roh = stoppOrdner.flatMap((d) => dateienIn(path.join(A, d))).filter((f) => !EINSORTIERT.test(path.basename(f)));
	const daten = exifDaten(roh);
	for (const f of roh) {
		const datum = daten[f] ?? namensDatum(path.basename(f));
		eintraege.push({ quelle: f, datum, herkunft: 'ordner', stopp: path.basename(path.dirname(f)) });
	}
}
// 3. _ohne_Stopp nachsortieren (Datum und Herkunft stehen im Namen)
const hinweise = {};
for (const f of dateienIn(path.join(A, OHNE))) {
	const m = path.basename(f).match(EINSORTIERT);
	if (!m?.[1]) continue;
	const datum = m[1].slice(0, 10) + ' ' + m[1].slice(11, 16).replace('-', ':');
	const stopp = stoppZu(datum, m[2]);
	if (stopp) eintraege.push({ quelle: f, datum, herkunft: m[2], stopp, name: path.basename(f) });
	else if (fremd(datum)) {
		const t = fremd(datum);
		const k = `${t.ort} ${t.jahr}${t.tourstopp ? ` (Tour-Stopp ${t.tourstopp})` : ''}`;
		hinweise[k] = (hinweise[k] ?? 0) + 1;
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
const bewegt = []; // [alt, neu] relativ zu assets
const zaehler = {};
let doppelt = 0;
const speichern = () => fs.writeFileSync(protokollDatei, JSON.stringify(protokoll, null, '\t') + '\n');
process.on('exit', speichern); // auch bei einem Fehler festhalten, was schon bewegt wurde

for (const e of eintraege) {
	const zielDir = path.join(A, e.stopp ?? (e.datum ? OHNE : OHNE_DATUM));
	fs.mkdirSync(zielDir, { recursive: true });
	const vorne = e.datum ? `${e.datum.replace(' ', '_').replace(':', '-')}_` : '';
	const basis = e.name ?? `${vorne}${e.herkunft}_${path.basename(e.quelle)}`;
	const groesse = fs.statSync(e.quelle).size;

	let ziel = null;
	const gleich = (bestand(zielDir).get(groesse) ?? []).find((f) => f !== e.quelle && hash(f) === hash(e.quelle));
	if (gleich && e.herkunft !== 'ordner') {
		// gleicher Inhalt liegt dort schon: Quelle entfernen (Stopp-Ordner-Originale bleiben immer erhalten)
		ziel = gleich;
		doppelt++;
		fs.rmSync(e.quelle);
	}
	if (!ziel) {
		ziel = path.join(zielDir, basis);
		for (let i = 2; fs.existsSync(ziel); i++) ziel = path.join(zielDir, basis.replace(/(\.[^.]+)$/, ` (${i})$1`));
		fs.renameSync(e.quelle, ziel);
		const m = bestand(zielDir);
		if (m.has(groesse)) m.set(groesse, m.get(groesse).filter((f) => f !== e.quelle));
		m.set(groesse, [...(m.get(groesse) ?? []), ziel]);
		if (hashCache.has(e.quelle)) hashCache.set(ziel, hashCache.get(e.quelle));
	}
	const alt = path.relative(A, e.quelle);
	const neu = path.relative(A, ziel);
	// Protokoll: frühere Einträge, die auf die alte Stelle zeigten, mitziehen
	for (const [k, v] of Object.entries(protokoll)) if (v === alt) protokoll[k] = neu;
	protokoll[alt] = neu;
	bewegt.push([alt, neu]);
	const k = path.relative(A, zielDir);
	zaehler[k] = (zaehler[k] ?? 0) + 1;
}

// Pfade in den Website-Skripten mitziehen
const NFC = (s) => s.normalize('NFC');
for (const datei of ['scripts/fotos.mjs', 'scripts/clips.mjs', 'scripts/videos.sh']) {
	const vorher = NFC(fs.readFileSync(datei, 'utf8'));
	let text = vorher;
	for (const [alt, neu] of bewegt) {
		text = text.replaceAll(NFC(alt), NFC(neu));
		// videos.sh nennt Dateien relativ zu seinem Quellordner
		if (path.dirname(alt) === path.dirname(neu)) text = text.replaceAll(`|${NFC(path.basename(alt))}|`, `|${NFC(path.basename(neu))}|`);
	}
	if (text !== vorher) {
		fs.writeFileSync(datei, text);
		console.log(`Pfade angepasst: ${datei}`);
	}
}

for (const [k, n] of Object.entries(zaehler).sort()) console.log(`${k}: ${n}`);
console.log(`\n${eintraege.length} Dateien bewegt${doppelt ? `, davon ${doppelt} schon vorhanden (Quelle entfernt)` : ''}`);
for (const [k, n] of Object.entries(hinweise)) console.log(`Hinweis: ${n} Dateien in _ohne_Stopp fallen in ${k} – waren wir da? Dann Ordner in termine.json eintragen.`);
