// Legt in jeden Stations-Ordner unter assets/ (JJJJ_MM_Ort) einen Unterordner „auf_der_Seite“ mit den
// Originaldateien, die die Website für diesen Stopp benutzt: Fotos (scripts/fotos.mjs) und die Quellen der Clips
// (scripts/clips.mjs) von Stationen, Choreos und TV-Momenten. So sieht man im Finder, was schon verwendet ist.
//
// Die Dateien sind APFS-Klone (cp -c): sie belegen keinen zusätzlichen Platz, und Änderungen an der Kopie
// berühren das Original nicht. Der Unterordner wird bei jedem Lauf neu erzeugt, also nichts darin von Hand pflegen.
// Aufruf: node scripts/sortiere.mjs
import fs from 'node:fs';
import path from 'node:path';
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
