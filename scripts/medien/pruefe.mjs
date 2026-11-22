// Prüft per Prüfsumme (SHA-1), dass jede Datei aus assets/_index/vorher.sha1 (Stand vor dem Einsortieren)
// mit identischem Inhalt in den Stopp-Ordnern oder in _ohne_Stopp/ liegt, und dass jeder Eintrag in
// _index/umzug.json auf eine vorhandene Datei mit demselben Inhalt zeigt.
// Aufruf: node scripts/medien/pruefe.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const A = 'assets';
const MEDIEN = /\.(jpe?g|png|heic|webp|gif|mov|mp4|m4v|avi|3gp)$/i;

const vorher = new Map(); // Pfad → Hash
for (const z of fs.readFileSync(path.join(A, '_index/vorher.sha1'), 'utf8').trim().split('\n')) {
	const [h, ...p] = z.split('  ');
	vorher.set(p.join('  '), h);
}

const ziele = [];
const sammle = (dir) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) sammle(p);
		else if (MEDIEN.test(e.name)) ziele.push(p);
	}
};
for (const d of fs.readdirSync(A)) if (/^\d{4}_\d{2}_/.test(d) || d === '_ohne_Stopp') sammle(path.join(A, d));

// Hashes der neuen Struktur, parallel in Paketen
const jetzt = new Map(); // Pfad relativ zu assets → Hash
for (let i = 0; i < ziele.length; i += 200) {
	const out = execFileSync('shasum', ['-a', '1', ...ziele.slice(i, i + 200)], { encoding: 'utf8', maxBuffer: 64e6 });
	for (const z of out.trim().split('\n')) {
		const [h, ...p] = z.split('  ');
		jetzt.set(path.relative(A, p.join('  ')), h);
	}
}
const inhalte = new Set(jetzt.values());

const fehlt = [...vorher].filter(([, h]) => !inhalte.has(h));
const umzug = JSON.parse(fs.readFileSync(path.join(A, '_index/umzug.json'), 'utf8'));
const falsch = Object.entries(umzug).filter(([alt, neu]) => vorher.has(alt) && jetzt.get(neu) !== vorher.get(alt));
const ohneProtokoll = [...vorher.keys()].filter((p) => !umzug[p]);

console.log(`Quelldateien vorher:        ${vorher.size} (${new Set(vorher.values()).size} verschiedene Inhalte)`);
console.log(`Dateien in der neuen Ablage: ${jetzt.size} (${inhalte.size} verschiedene Inhalte)`);
console.log(`Inhalt fehlt:               ${fehlt.length}`);
console.log(`Protokoll zeigt falsch:     ${falsch.length}`);
console.log(`Ohne Protokolleintrag:      ${ohneProtokoll.length}`);
for (const [p] of fehlt.slice(0, 20)) console.log('  FEHLT', p);
for (const [a, n] of falsch.slice(0, 20)) console.log('  FALSCH', a, '→', n);
for (const p of ohneProtokoll.slice(0, 20)) console.log('  OHNE', p);
process.exit(fehlt.length || falsch.length || ohneProtokoll.length ? 1 : 0);
