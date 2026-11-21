import { foto, type Foto } from './fotos';
import type { ClipName } from './clips';

export interface Station {
	jahr: number;
	ort: string;
	zusatz?: string;
	/** Unsere eigenen Worte aus dem Instagram-Post bzw. der Story zum Turnier */
	motto: string;
	fotos: Foto[];
	/** Stories aus dem Block (Handy-Videos) */
	clips?: ClipName[];
}

// Neueste zuerst
export const stationen: Station[] = [
	{
		jahr: 2026,
		ort: 'Dortmund',
		zusatz: 'GBC',
		motto: 'Long story short, das Wochenende war eine 10/10.',
		fotos: [
			foto('2026-dortmund-1', 'Rote Fackelwand und Rauch vor dem Banner „Jetzt brennt der Pott“ am Spielfeldrand'),
			foto('2026-dortmund-3', 'Fackeln und weißer Rauch hinter der Bande, der Block jubelt'),
		],
		clips: ['dortmund26-brennt', 'dortmund26-nele', 'dortmund26-angezuendet'],
	},
	{
		jahr: 2026,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		motto: 'Unser Wunsch wurde erfüllt – ELITE SIEG 🧞‍♂️',
		fotos: [
			foto('2026-hamburg-1', 'Zwei Spieler jubeln mit erhobenen Fäusten vor rotem Fackelrauch'),
			foto('2026-hamburg-2', 'Banner „Norge“ mit Wikingerhelm über der Bande, dahinter die volle Tribüne'),
			foto('2026-hamburg-3', 'Spieler laufen auf den Block zu, hinter ihnen brennen Fackeln'),
		],
		clips: ['hamburg26-pyro', 'hamburg26-legends'],
	},
	{
		jahr: 2026,
		ort: 'München',
		motto: 'Letztes Wochenende wurde in München ordentlich gerudert.',
		fotos: [
			foto('2026-muenchen-1', 'Der Block bei Nacht, rote Fackeln und Rauch über den Köpfen'),
			foto('2026-muenchen-2', 'Ein Fan hält eine Fackel in die Luft, alles in rotes Licht getaucht'),
		],
		clips: ['muenchen26-rudern', 'muenchen26-chenoa', 'muenchen26-goated'],
	},
	{
		jahr: 2026,
		ort: 'Berlin',
		motto: 'Die Hauptstadt hat geliefert.',
		fotos: [
			foto('2026-berlin-1', 'Feuerwand aus Fackeln am Spielfeldrand bei Nacht'),
			foto('2026-berlin-4', 'Die Gruppe in weißen Shirts jubelt hinter dem Fraktion-Bräune-Banner'),
			foto('2026-berlin-3', 'Nahaufnahme einer Fackel in dichtem rotem Rauch'),
			foto('2026-berlin-2', 'Fans schreien hinter dem Banner mit den bunten Buchstaben'),
			foto('2026-berlin-5', 'Der Center Court von oben bei Nacht, Fackeln leuchten im Block'),
		],
		clips: ['berlin26-pyrobts', 'berlin26-fackelreihe'],
	},
	{
		jahr: 2025,
		ort: 'Timmendorfer Strand',
		motto: 'Ein allerletzter Tanz … aber was für einer!',
		fotos: [
			foto('2025-timmendorf-1', 'Grüner Rauch hüllt die Tribüne ein, darunter die Choreo „33 Jahre – Danke Timmendorf – One Last Dance“'),
			foto('2025-timmendorf-3', 'Ein riesiges „33 Jahre“-Banner wird über die Tribüne gezogen'),
			foto('2025-timmendorf-2', 'Fahne mit dem Fraktion-Bräune-Logo vor blauem Himmel, darunter Fackelrauch'),
			foto('2025-timmendorf-5', 'Rote Fackeln in der Nacht'),
		],
		clips: ['timmendorf25-fackel', 'timmendorf25-fahne'],
	},
	{
		jahr: 2025,
		ort: 'Berlin',
		zusatz: 'I + II',
		motto: 'Berlin, was war das denn?!',
		fotos: [
			foto('2025-berlin-1', 'Die Gruppe jubelt auf der roten Tribüne mit einem Pokal'),
			foto('choreo-2025-baerenhorde', 'Choreo „Die Bärenhorde stürmt das Feld – für den geilsten Club der Welt“'),
			foto('2025-berlin-2', 'Selfie aus dem Block, alle lachen in die Kamera'),
			foto('2025-berlin-3', 'Der Block von oben, Fahnen und Rauch über der Tribüne'),
		],
		clips: ['berlin25-licht', 'berlin25-robinjonas', 'berlin25-btspyro'],
	},
	{
		jahr: 2025,
		ort: 'München',
		motto: 'München liefert. Wir auch.',
		fotos: [
			foto('choreo-2025-bayern', 'Choreo „Wir sind eure Hauptstadt – ihr Bayern!“'),
			foto('2025-muenchen-1', 'Der Block oben ohne mit erhobenen Armen'),
			foto('2025-muenchen-2', 'Fans jubeln auf der Tribüne in München'),
		],
	},
	{
		jahr: 2025,
		ort: 'Düsseldorf',
		motto: 'Und die Fahnen wehen wieder.',
		fotos: [
			foto('2025-duesseldorf-1', 'Der Block reißt die Arme hoch'),
			foto('choreo-2025-pott', 'Banner „Unser Pott hat richtig Dampf“ mit blauem Rauch'),
			foto('2025-duesseldorf-2', 'Die Gruppe auf der Tribüne in Düsseldorf'),
		],
		clips: ['duesseldorf25-paulies'],
	},
	{
		jahr: 2024,
		ort: 'Timmendorfer Strand',
		motto: 'Wie GEISTESKRANK war bitte dieses Jahr Timmendorf?!',
		fotos: [
			foto('2024-timmendorf-2', 'Banner „Unsere Helden aus Paris“ mit olympischen Ringen, darüber fliegt Konfetti'),
			foto('2024-timmendorf-1', 'Ein Fan mit Fackel schreit vor Begeisterung'),
			foto('2024-timmendorf-3', 'Lila Rauch und Fahnen am Spielfeldrand, aus der Fischaugen-Perspektive'),
			foto('2024-timmendorf-6', 'Fackeln und lila Rauch mitten im Block'),
			foto('2024-timmendorf-5', 'Gruppenfoto mit goldenen Ketten auf der Tribüne'),
			foto('2024-timmendorf-4', 'Gelber Rauch und Fahne vor dem Center Court'),
		],
		clips: ['timmendorf24-ericmomme'],
	},
	{
		jahr: 2024,
		ort: 'Paris',
		zusatz: 'Olympia',
		motto: 'Nett hier, wann GBT in Paris?',
		fotos: [],
		clips: ['paris24-olympia'],
	},
	{
		jahr: 2024,
		ort: 'München',
		motto: 'München hat richtig geschmeckt.',
		fotos: [
			foto('2024-muenchen-1', 'Der Block hinter dem Fraktion-Bräune-Banner in München'),
			foto('choreo-2024-aufgehts', 'Banner „Auf geht’s, kämpfen und siegen“ im grünen Rauch'),
			foto('2024-muenchen-2', 'Die Gruppe jubelt an der Bande'),
		],
	},
	{
		jahr: 2023,
		ort: 'Timmendorfer Strand',
		motto: 'Wer hätte gedacht, dass aus ein paar Freunden … sowas unfassbar Geiles entsteht?',
		fotos: [
			foto('2023-timmendorf-2', 'Das Banner „Fraktion Bräune“ mit bunten Buchstaben vor der vollen Tribüne'),
			foto('2023-timmendorf-1', 'Fans oben ohne singen mit Fahne und Schildern auf der Tribüne'),
			foto('2023-timmendorf-3', 'Drei Fans oben ohne jubeln an der Bande'),
			foto('2023-timmendorf-4', 'Selbstgemalte Schilder wie „Ballern“ über dem Banner'),
		],
	},
];
