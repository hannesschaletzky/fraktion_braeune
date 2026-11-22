import aufGehts from '../assets/1.jpg';
import { foto, type Foto } from './fotos';
import type { ClipName } from './clips';

export interface Choreo {
	jahr: number;
	/** Monat (1–12), aus Fotodatum bzw. Story */
	monat: number;
	/** Welcher Stopp in der Stadt (meist zwei pro Jahr), nur wenn sicher */
	stopp?: 1 | 2;
	ort: string;
	zusatz?: string;
	/** Text auf dem Banner */
	titel: string;
	/** Was dazugehörte, als kurze Schlagworte */
	zutaten: string[];
	fotos: Foto[];
	/** Nicht von uns: eine Choreo, die andere Fans für uns gemacht haben */
	vonAnderen?: boolean;
	/** Videos aus Stories und Reels */
	clips?: ClipName[];
}

// Neueste zuerst. Fotos aus unseren Posts bzw. dem Rohmaterial, Clips aus unseren Stories und Reels.
export const choreos: Choreo[] = [
	{
		jahr: 2026,
		monat: 8,
		ort: 'Dortmund',
		zusatz: 'GBC',
		titel: 'Jetzt brennt der Pott',
		zutaten: ['Banner mit Förderturm', 'Pyro-Wand'],
		fotos: [foto('2026-dortmund-1', 'Pyro-Wand vor dem Banner „Jetzt brennt der Pott“')],
		clips: ['dortmund26-brennt', 'reel-dortmund-pov'],
	},
	{
		jahr: 2026,
		monat: 8,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		titel: 'Elite Sieg',
		zutaten: ['Banner', 'Fackeln'],
		fotos: [foto('choreo-2026-elitesieg', 'Banner „Elite Sieg“ zwischen Fackeln und Rauch')],
	},
	{
		jahr: 2026,
		monat: 8,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		titel: 'Living Legends',
		zutaten: ['Unsere erste Choreo für ein internationales Team', 'Norge-Fahne mit Wikingerhelm', 'Fackeln'],
		fotos: [
			foto('choreo-hamburg-legends', 'Banner „Living Legends“ und Norge-Fahne hinter rotem Rauch'),
			foto('2026-hamburg-2', 'Norge-Fahne mit Wikingerhelm über der Bande'),
		],
		clips: ['hamburg26-legends'],
	},
	{
		jahr: 2026,
		monat: 6,
		stopp: 1,
		ort: 'Berlin',
		titel: 'Fünf Jahre Fraktion Bräune',
		zutaten: ['Unser Lieblingsbanner, recycelt', 'Fackeln'],
		fotos: [foto('choreo-2026-fuenf', 'Fackeln rund um das Fraktion-Banner auf dem Sand bei Nacht')],
		clips: ['reel-choreo-bts', 'berlin26-pyrobts'],
	},
	{
		jahr: 2026,
		monat: 6,
		stopp: 2,
		ort: 'Berlin',
		titel: 'Unser Wunsch: Toursieg',
		zutaten: ['Schilder'],
		fotos: [foto('choreo-berlin-toursieg', 'Schilder „Unser Wunsch: Toursieg“ an der Bande')],
	},
	{
		jahr: 2026,
		monat: 6,
		stopp: 1,
		ort: 'Berlin',
		titel: 'Alles Gute, Eric ♥',
		zutaten: ['Buchstabentafeln'],
		fotos: [foto('choreo-berlin-eric', 'Buchstabentafeln „Alles Gute Eric“ mit Herz auf der leeren Tribüne')],
	},
	{
		jahr: 2025,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: '33 Jahre – Danke Timmendorf – One Last Dance',
		zutaten: ['Riesenbanner', 'Grüne Papptafeln', 'Grüner Rauch'],
		fotos: [
			foto('2025-timmendorf-1', 'Grüner Rauch über der Choreo „33 Jahre – Danke Timmendorf – One Last Dance“'),
			foto('2025-timmendorf-3', 'Das „33 Jahre“-Banner wird über die Tribüne gezogen, dahinter grüne Tafeln'),
		],
		clips: ['timmendorf25-makingof', 'timmendorf25-gruen'],
	},
	{
		jahr: 2025,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: 'Auf geht’s, kämpfen und siegen',
		zutaten: ['Banner', 'Fahnen', 'Fackeln'],
		fotos: [{ bild: aufGehts, alt: 'Banner „Auf geht’s kämpfen und siegen“, davor zwei Fackeln im Sand', credit: null }],
		clips: ['timmendorf25-abfahrt'],
	},
	{
		jahr: 2025,
		monat: 8,
		stopp: 2,
		ort: 'Berlin',
		titel: 'Wir regieren die Hauptstadt',
		zutaten: ['Für die Hauptstadt Beacher', 'Banner', 'Rauch'],
		fotos: [foto('choreo-2025-regieren', 'Banner „Wir regieren die Hauptstadt – Hauptstadt Beacher“ mit Rauch')],
	},
	{
		jahr: 2025,
		monat: 8,
		stopp: 1,
		ort: 'Berlin',
		titel: 'Die Bärenhorde stürmt das Feld – für den geilsten Club der Welt',
		zutaten: ['Unsere bislang aufwendigste Choreo', 'Bären-Banner', 'Rauch'],
		fotos: [foto('choreo-2025-baerenhorde', 'Choreo „Die Bärenhorde stürmt das Feld – für den geilsten Club der Welt“ mit Bären-Banner')],
	},
	{
		jahr: 2025,
		monat: 8,
		stopp: 1,
		ort: 'Berlin',
		titel: 'Wir brenn’ für euch – aus BER, für BER',
		zutaten: ['Bären-Banner', 'Fackeln'],
		fotos: [foto('choreo-2025-brenn', 'Banner „Wir brenn’ für euch“ und „Fraktion Bräune aus BER – für BER“ mit Fackeln')],
		clips: ['berlin25-pyro'],
	},
	{
		jahr: 2025,
		monat: 7,
		stopp: 2,
		ort: 'München',
		titel: 'Wir sind eure Hauptstadt – ihr Bayern!',
		zutaten: ['Banner', 'Rauch'],
		fotos: [foto('choreo-2025-bayern', 'Banner „Wir sind eure Hauptstadt – ihr Bayern!“ an der Bande')],
	},
	{
		jahr: 2025,
		monat: 5,
		stopp: 1,
		ort: 'Düsseldorf',
		titel: 'Unser Pott hat richtig Dampf',
		zutaten: ['Banner', 'Blauer Rauch'],
		fotos: [
			foto('choreo-2025-pott', 'Banner „Unser Pott hat richtig Dampf“ mit blauem Rauch'),
			foto('choreo-2025-pott-2', 'Banner „Unser Pott dampft immer noch“ an der Bande'),
		],
	},
	{
		jahr: 2025,
		monat: 5,
		stopp: 1,
		ort: 'Düsseldorf',
		titel: 'Der König ist zurück',
		zutaten: ['Banner', 'Fahnen', 'Rauch'],
		fotos: [foto('choreo-2025-koenig', 'Banner „Der König ist zurück“ unter Fahnen und weißem Rauch')],
	},
	{
		jahr: 2024,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: 'Unsere Helden aus Paris',
		zutaten: ['Banner mit olympischen Ringen', 'Konfetti'],
		fotos: [foto('2024-timmendorf-2', 'Banner „Unsere Helden aus Paris“ mit olympischen Ringen')],
	},
	{
		jahr: 2024,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: 'Christ · Grüne · Abfaaahrt',
		zutaten: ['Side-Court-Choreo', 'Banner am Oberrang', 'Rauch'],
		fotos: [foto('choreo-2024-abfahrt', 'Banner „Christ · Grüne · Abfaaahrt“ am Oberrang mit orangem Rauch')],
	},
	{
		jahr: 2024,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: 'Purple Party People grüßen die Fraktion Bräune',
		vonAnderen: true,
		zutaten: ['Drei Banner'],
		fotos: [
			foto('choreo-2024-purple', 'Drei lila Banner „Purple Party People grüßen die Fraktion Bräune“ in der vollen Tribüne'),
		],
	},
	{
		jahr: 2024,
		monat: 7,
		stopp: 1,
		ort: 'München',
		titel: 'Auf geht’s, kämpfen und siegen',
		zutaten: ['Banner', 'Grüner Rauch'],
		fotos: [foto('choreo-2024-aufgehts', 'Banner „Auf geht’s, kämpfen und siegen“ im grünen Rauch')],
	},
	{
		jahr: 2024,
		monat: 5,
		stopp: 1,
		ort: 'Düsseldorf',
		titel: 'Dieses Jahr wieder Vollgas',
		zutaten: ['Banner', 'Fahnen', 'Rosa Rauch'],
		fotos: [foto('2024-duesseldorf-vollgas', 'Banner „Dieses Jahr wieder Vollgas“ über der Bande, dazu Fahnen und rosa Rauch')],
		clips: ['duesseldorf24-huette'],
	},
	{
		jahr: 2023,
		monat: 9,
		ort: 'Timmendorfer Strand',
		titel: 'Fraktion Bräune',
		zutaten: ['Banner mit Regenbogen-Buchstaben', 'Pappschilder'],
		fotos: [
			foto('2023-timmendorf-2', 'Das Banner „Fraktion Bräune“ mit bunten Buchstaben'),
			foto('2023-timmendorf-4', 'Pappschilder wie „Ballern“ über dem Banner'),
		],
	},
];

export function slug(c: Choreo) {
	return `choreo-${c.jahr}-${c.titel}`
		.toLowerCase()
		.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
