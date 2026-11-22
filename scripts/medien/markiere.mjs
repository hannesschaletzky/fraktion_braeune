// Markiert im Finder alle Originale unter assets/, die die Website benutzt, mit dem grünen Tag „Auf der Seite“
// (Fotos aus scripts/fotos.mjs, Clip-Quellen aus scripts/clips.mjs und scripts/videos.sh, sofern der Name in src/
// vorkommt). Bei allen anderen Dateien in den Stopp-Ordnern wird genau dieser Tag wieder entfernt; andere Tags bleiben.
// Aufruf: node scripts/medien/markiere.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { auswahl } from '../fotos.mjs';
import { clips } from '../clips.mjs';

const A = 'assets';
const ATTR = 'com.apple.metadata:_kMDItemUserTags';
// Binäre plist mit ["Auf der Seite\n2"] (2 = grün); nur dieser Wert wird gesetzt und entfernt
const TAG = '62706c6973743030a1015f100f417566206465722053656974650a32080a000000000000010100000000000000020000000000000000000000000000001c';

// Namen, die im Quelltext der Seite vorkommen
const quelltext = [];
const lies = (dir) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) lies(p);
		else if (/\.(ts|astro)$/.test(e.name)) quelltext.push(fs.readFileSync(p, 'utf8'));
	}
};
lies('src');
const text = quelltext.join('\n');
const benutzt = (name) => text.includes(`'${name}'`);

const markiert = new Set();
for (const [name, rel] of Object.entries(auswahl)) if (benutzt(name)) markiert.add(path.join(A, rel));
for (const [name, c] of Object.entries(clips)) if (benutzt(name)) for (const t of c.teile) markiert.add(t[0]);
const sh = fs.readFileSync('scripts/videos.sh', 'utf8');
const shQuelle = sh.match(/^quelle=(\S+)/m)[1];
for (const [, name, datei] of sh.matchAll(/^([a-z0-9-]+)\|([^|]+)\|/gm)) if (benutzt(name)) markiert.add(path.join(shQuelle, datei));

for (const f of markiert) execFileSync('xattr', ['-wx', ATTR, TAG, f]);

// Tag bei allen anderen entfernen, wenn er der einzige Tag ist
let entfernt = 0;
const alle = [];
const sammle = (dir) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) sammle(p);
		else alle.push(p);
	}
};
for (const d of fs.readdirSync(A)) if (/^\d{4}_\d{2}_/.test(d) || d === '_ohne_Stopp') sammle(path.join(A, d));
for (const f of alle) {
	if (markiert.has(f)) continue;
	const r = spawnSync('xattr', ['-px', ATTR, f], { encoding: 'utf8' });
	if (r.status === 0 && r.stdout.replace(/\s/g, '').toLowerCase() === TAG) {
		execFileSync('xattr', ['-d', ATTR, f]);
		entfernt++;
	}
}
console.log(`${markiert.size} Dateien mit „Auf der Seite“ markiert${entfernt ? `, bei ${entfernt} entfernt` : ''}`);
