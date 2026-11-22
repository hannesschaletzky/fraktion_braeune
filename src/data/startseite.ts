// Auswahl der Karten auf der Startseite (fest, von Hand):
// Choreos: unsere größten. Stationen: bunte Mischung aus anderen Turnieren, damit sich nichts doppelt.
import { stationen, type Station } from './stationen';
import { choreos, type Choreo } from './choreos';

/** Bildausschnitt der Karte (CSS object-position), wenn das Wichtige nicht in der Mitte ist */
type MitFokus<T> = T & { fokus?: string };

function choreo(titel: string, fokus?: string): MitFokus<Choreo> {
	const c = choreos.find((x) => x.titel === titel);
	if (!c) throw new Error(`Choreo fehlt: ${titel}`);
	return { ...c, fokus };
}
function station(jahr: number, ort: string, stopp?: number): MitFokus<Station> {
	const s = stationen.find((x) => x.jahr === jahr && x.ort === ort && x.stopp === stopp);
	if (!s) throw new Error(`Station fehlt: ${ort} ${jahr}`);
	return s;
}

export const startChoreos = [
	choreo('Jetzt brennt der Pott'),
	choreo('33 Jahre – Danke Timmendorf – One Last Dance'),
	choreo('Unsere Helden aus Paris', '50% 85%'),
];

export const startStationen = [station(2026, 'Berlin', 1), station(2025, 'München', 2), station(2024, 'Kühlungsborn', 2)];
