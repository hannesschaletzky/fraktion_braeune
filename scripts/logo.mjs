// Färbt das Outline-Logo ein: FRAKTION und der Ball papierweiß, BRÄUNE in Regenbogenfarben wie auf den Bannern.
// Eingabe: großes Rendering des Logos (schwarze Linien auf weiß oder transparent), z. B. per
//   qlmanage -t -s 3200 -o /tmp assets/logo/FraktinBräune_Front_zentriert.ai
// Aufruf: node scripts/logo.mjs <eingabe.png>   → src/assets/logo-bunt.png, src/assets/logo-hell.png
import sharp from 'sharp';

const eingabe = process.argv[2];
if (!eingabe) throw new Error('Aufruf: node scripts/logo.mjs <eingabe.png>');

const PAPIER = [248, 242, 231];
const TINTE = [26, 18, 24];
const REGENBOGEN = [
	[255, 46, 77],
	[255, 122, 26],
	[255, 210, 63],
	[47, 212, 122],
	[58, 139, 255],
	[165, 91, 255],
];

// Auf die Linien zuschneiden, Weiß und Transparenz gelten beide als "keine Linie"
const { data: roh, info } = await sharp(eingabe)
	.flatten({ background: '#ffffff' })
	.greyscale()
	.trim({ threshold: 40 })
	.extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' })
	.raw()
	.toBuffer({ resolveWithObject: true });
const { width: B, height: H } = info;
const tinte = new Uint8Array(B * H);
for (let i = 0; i < B * H; i++) tinte[i] = roh[i * info.channels] < 128 ? 1 : 0;

// Zusammenhängende Flächen ohne Linie beschriften
const label = new Int32Array(B * H).fill(-1);
const flaechen = [];
for (let start = 0; start < B * H; start++) {
	if (tinte[start] || label[start] >= 0) continue;
	const id = flaechen.length;
	const f = { id, n: 0, sx: 0, sy: 0, x0: B, x1: 0, y0: H, y1: 0, rand: false };
	const stapel = [start];
	label[start] = id;
	while (stapel.length) {
		const p = stapel.pop();
		const x = p % B, y = (p / B) | 0;
		f.n++; f.sx += x; f.sy += y;
		if (x < f.x0) f.x0 = x; if (x > f.x1) f.x1 = x;
		if (y < f.y0) f.y0 = y; if (y > f.y1) f.y1 = y;
		if (x === 0 || y === 0 || x === B - 1 || y === H - 1) f.rand = true;
		for (const q of [x > 0 && p - 1, x < B - 1 && p + 1, y > 0 && p - B, y < H - 1 && p + B]) {
			if (q !== false && !tinte[q] && label[q] < 0) { label[q] = id; stapel.push(q); }
		}
	}
	f.cx = f.sx / f.n; f.cy = f.sy / f.n;
	flaechen.push(f);
}

// Nachbarschaft über eine dünne Linie hinweg (Zeilen und Spalten abtasten)
const MAX_LINIE = Math.round(B / 60);
const nachbarn = flaechen.map(() => new Set());
function abtasten(laenge, anzahl, idx) {
	for (let a = 0; a < anzahl; a++) {
		let vorher = -1, lauf = 0;
		for (let b = 0; b < laenge; b++) {
			const p = idx(a, b);
			if (tinte[p]) { lauf++; continue; }
			const l = label[p];
			if (vorher >= 0 && lauf > 0 && lauf <= MAX_LINIE && vorher !== l) { nachbarn[vorher].add(l); nachbarn[l].add(vorher); }
			vorher = l; lauf = 0;
		}
	}
}
abtasten(B, H, (y, x) => y * B + x);
abtasten(H, B, (x, y) => y * B + x);

// Tiefe: Außenfläche 0, Buchstabenkörper 1, Innenräume (A, R, B …) 2
const tiefe = flaechen.map((f) => (f.rand ? 0 : -1));
const schlange = flaechen.filter((f) => f.rand).map((f) => f.id);
while (schlange.length) {
	const a = schlange.shift();
	for (const b of nachbarn[a]) if (tiefe[b] < 0) { tiefe[b] = tiefe[a] + 1; schlange.push(b); }
}

const MIN = (B * H) / 20000; // Rauschen ignorieren
const koerper = flaechen.filter((f) => tiefe[f.id] === 1 && f.n > MIN);
const mitteY = (Math.min(...koerper.map((f) => f.y0)) + Math.max(...koerper.map((f) => f.y1))) / 2;

// Körper zu Buchstaben gruppieren (überlappen sie horizontal, gehören sie zusammen: Ä-Punkte zum A)
function buchstaben(zeile) {
	const sortiert = zeile.sort((a, b) => a.x0 - b.x0);
	const gruppen = [];
	for (const f of sortiert) {
		const g = gruppen.find((g) => f.x0 < g.x1 && f.x1 > g.x0);
		if (g) { g.teile.push(f); g.x0 = Math.min(g.x0, f.x0); g.x1 = Math.max(g.x1, f.x1); g.y0 = Math.min(g.y0, f.y0); g.y1 = Math.max(g.y1, f.y1); }
		else gruppen.push({ teile: [f], x0: f.x0, x1: f.x1, y0: f.y0, y1: f.y1 });
	}
	return gruppen.sort((a, b) => a.x0 - b.x0);
}
const oben = buchstaben(koerper.filter((f) => f.cy < mitteY));
const unten = buchstaben(koerper.filter((f) => f.cy >= mitteY));
console.log(`Erkannt: ${oben.length} Buchstaben oben, ${unten.length} unten`);

const farbeBunt = new Map();
const farbeHell = new Map();
for (const g of oben) for (const f of g.teile) { farbeBunt.set(f.id, PAPIER); farbeHell.set(f.id, PAPIER); }
unten.forEach((g, i) => {
	for (const f of g.teile) { farbeBunt.set(f.id, REGENBOGEN[i % REGENBOGEN.length]); farbeHell.set(f.id, PAPIER); }
});
// Der Ball (das O in FRAKTION, vorletzter Buchstabe oben): alle Flächen darin weiß füllen
const ball = oben[oben.length - 2];
if (ball) {
	for (const f of flaechen) {
		if (tiefe[f.id] >= 1 && f.cx > ball.x0 && f.cx < ball.x1 && f.cy > ball.y0 && f.cy < ball.y1) {
			farbeBunt.set(f.id, PAPIER); farbeHell.set(f.id, PAPIER);
		}
	}
}

async function schreiben(farben, ziel, breite) {
	const aus = Buffer.alloc(B * H * 4);
	for (let p = 0; p < B * H; p++) {
		let c = null;
		if (tinte[p]) c = TINTE;
		else { const f = farben.get(label[p]); if (f) c = f; }
		if (c) { aus[p * 4] = c[0]; aus[p * 4 + 1] = c[1]; aus[p * 4 + 2] = c[2]; aus[p * 4 + 3] = 255; }
	}
	await sharp(aus, { raw: { width: B, height: H, channels: 4 } }).resize({ width: breite }).png({ compressionLevel: 9, palette: true, colours: 64 }).toFile(ziel);
	console.log('→', ziel);
}
await schreiben(farbeBunt, 'src/assets/logo-bunt.png', 2000);
await schreiben(farbeHell, 'src/assets/logo-hell.png', 1200);
