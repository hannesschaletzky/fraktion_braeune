// Auswahl der Karten auf der Startseite: je eine Station und eine Choreo aus 2026, 2025 und 2024,
// kein Foto und kein Turnier doppelt (die Choreos überspringen, was schon bei den Stationen steht).
import { stationen } from './stationen';
import { choreos } from './choreos';

const jahre = [2026, 2025, 2024];

export const startStationen = jahre
	.map((j) => stationen.find((s) => s.jahr === j && s.fotos.length))
	.filter((s) => s !== undefined);

// Choreos von anderen Turnieren als die gezeigten Stationen, damit beide Reihen verschieden wirken
const turniere = new Set(startStationen.map((s) => `${s.jahr}-${s.ort}`));
const belegt = new Set(startStationen.map((s) => s.fotos[0].bild.src));

export const startChoreos = jahre
	.map((j) => choreos.find((c) => c.jahr === j && !turniere.has(`${c.jahr}-${c.ort}`) && !belegt.has(c.fotos[0].bild.src)))
	.filter((c) => c !== undefined);
