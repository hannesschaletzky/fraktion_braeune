import aufGehts from '../assets/1.jpg';
import { foto, type Foto } from './fotos';

export interface Choreo {
	jahr: number;
	ort: string;
	zusatz?: string;
	/** Text auf dem Banner */
	titel: string;
	/** Was dazugehörte, als kurze Schlagworte */
	zutaten: string[];
	fotos: Foto[];
}

// Neueste zuerst
export const choreos: Choreo[] = [
	{
		jahr: 2026,
		ort: 'Dortmund',
		titel: 'Jetzt brennt der Pott',
		zutaten: ['Banner mit Förderturm', 'Pyro-Wand'],
		fotos: [foto('2026-dortmund-1', 'Pyro-Wand vor dem Banner „Jetzt brennt der Pott“')],
	},
	{
		jahr: 2026,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		titel: 'Living Legends',
		zutaten: ['Banner', 'Norge-Fahne mit Wikingerhelm', 'Fackeln'],
		fotos: [
			foto('choreo-hamburg-legends', 'Banner „Living Legends“ und Norge-Fahne hinter rotem Rauch'),
			foto('2026-hamburg-2', 'Norge-Fahne mit Wikingerhelm über der Bande'),
		],
	},
	{
		jahr: 2026,
		ort: 'Berlin',
		titel: 'Unser Wunsch: Toursieg',
		zutaten: ['Schilder'],
		fotos: [foto('choreo-berlin-toursieg', 'Schilder „Unser Wunsch: Toursieg“ an der Bande')],
	},
	{
		jahr: 2026,
		ort: 'Berlin',
		titel: 'Alles Gute, Eric ♥',
		zutaten: ['Buchstabentafeln'],
		fotos: [foto('choreo-berlin-eric', 'Buchstabentafeln „Alles Gute Eric“ mit Herz auf der leeren Tribüne')],
	},
	{
		jahr: 2025,
		ort: 'Timmendorfer Strand',
		titel: '33 Jahre – Danke Timmendorf – One Last Dance',
		zutaten: ['Riesenbanner', 'Grüne Papptafeln', 'Grüner Rauch'],
		fotos: [
			foto('2025-timmendorf-1', 'Grüner Rauch über der Choreo „33 Jahre – Danke Timmendorf – One Last Dance“'),
			foto('2025-timmendorf-3', 'Das „33 Jahre“-Banner wird über die Tribüne gezogen, dahinter grüne Tafeln'),
		],
	},
	{
		jahr: 2025,
		ort: 'Timmendorfer Strand',
		titel: 'Auf geht’s, kämpfen und siegen',
		zutaten: ['Banner', 'Fahnen', 'Fackeln'],
		fotos: [{ bild: aufGehts, alt: 'Banner „Auf geht’s kämpfen und siegen“, davor zwei Fackeln im Sand', credit: null }],
	},
	{
		jahr: 2024,
		ort: 'Timmendorfer Strand',
		titel: 'Unsere Helden aus Paris',
		zutaten: ['Banner mit olympischen Ringen', 'Konfetti'],
		fotos: [foto('2024-timmendorf-2', 'Banner „Unsere Helden aus Paris“ mit olympischen Ringen')],
	},
	{
		jahr: 2024,
		ort: 'Timmendorfer Strand',
		titel: 'Christ · Grüne · Abfaaahrt',
		zutaten: ['Banner am Oberrang', 'Rauch'],
		fotos: [foto('choreo-2024-abfahrt', 'Banner „Christ · Grüne · Abfaaahrt“ am Oberrang mit orangem Rauch')],
	},
	{
		jahr: 2024,
		ort: 'Timmendorfer Strand',
		titel: 'Purple Party',
		zutaten: ['Banner', 'Lila Rauch'],
		fotos: [
			foto('choreo-2024-purple', 'Lila Banner „Purple Party“ in der vollen Tribüne'),
			foto('2024-timmendorf-6', 'Fackeln und lila Rauch im Block'),
		],
	},
	{
		jahr: 2023,
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
