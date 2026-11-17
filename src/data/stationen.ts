import { foto, type Foto } from './fotos';

export interface Station {
	jahr: number;
	ort: string;
	zusatz?: string;
	motto: string;
	fotos: Foto[];
}

// Neueste zuerst
export const stationen: Station[] = [
	{
		jahr: 2026,
		ort: 'Dortmund',
		motto: 'Jetzt brennt der Pott',
		fotos: [
			foto('2026-dortmund-1', 'Rote Fackelwand und Rauch vor dem Banner „Jetzt brennt der Pott“ am Spielfeldrand'),
			foto('2026-dortmund-2', 'Fans oben ohne jubeln im roten Licht brennender Fackeln'),
			foto('2026-dortmund-3', 'Fackeln und weißer Rauch hinter der Bande, der Block jubelt'),
		],
	},
	{
		jahr: 2026,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		motto: 'Weltklasse im Sand, Weltklasse im Block',
		fotos: [
			foto('2026-hamburg-1', 'Zwei Spieler jubeln mit erhobenen Fäusten vor rotem Fackelrauch'),
			foto('2026-hamburg-2', 'Banner „Norge“ mit Wikingerhelm über der Bande, dahinter die volle Tribüne'),
			foto('2026-hamburg-3', 'Spieler laufen auf den Block zu, hinter ihnen brennen Fackeln'),
		],
	},
	{
		jahr: 2026,
		ort: 'München',
		motto: 'Rot glüht der Süden',
		fotos: [
			foto('2026-muenchen-1', 'Der Block bei Nacht, rote Fackeln und Rauch über den Köpfen'),
			foto('2026-muenchen-2', 'Ein Fan hält eine Fackel in die Luft, alles in rotes Licht getaucht'),
		],
	},
	{
		jahr: 2026,
		ort: 'Berlin',
		motto: 'Nachtschicht in der Hauptstadt',
		fotos: [
			foto('2026-berlin-1', 'Feuerwand aus Fackeln am Spielfeldrand bei Nacht'),
			foto('2026-berlin-4', 'Die Gruppe in weißen Shirts jubelt hinter dem Fraktion-Bräune-Banner'),
			foto('2026-berlin-3', 'Nahaufnahme einer Fackel in dichtem rotem Rauch'),
			foto('2026-berlin-2', 'Fans schreien hinter dem Banner mit den bunten Buchstaben'),
			foto('2026-berlin-5', 'Der Center Court von oben bei Nacht, Fackeln leuchten im Block'),
		],
	},
	{
		jahr: 2025,
		ort: 'Timmendorfer Strand',
		motto: 'One Last Dance',
		fotos: [
			foto('2025-timmendorf-1', 'Grüner Rauch hüllt die Tribüne ein, darunter die Choreo „33 Jahre – Danke Timmendorf – One Last Dance“'),
			foto('2025-timmendorf-3', 'Ein riesiges „33 Jahre“-Banner wird über die Tribüne gezogen'),
			foto('2025-timmendorf-2', 'Fahne mit dem Fraktion-Bräune-Logo vor blauem Himmel, darunter Fackelrauch'),
			foto('2025-timmendorf-5', 'Rote Fackeln in der Nacht'),
		],
	},
	{
		jahr: 2024,
		ort: 'Timmendorfer Strand',
		motto: 'Unsere Helden aus Paris',
		fotos: [
			foto('2024-timmendorf-2', 'Banner „Unsere Helden aus Paris“ mit olympischen Ringen, darüber fliegt Konfetti'),
			foto('2024-timmendorf-1', 'Ein Fan mit Fackel schreit vor Begeisterung'),
			foto('2024-timmendorf-3', 'Lila Rauch und Fahnen am Spielfeldrand, aus der Fischaugen-Perspektive'),
			foto('2024-timmendorf-6', 'Fackeln und lila Rauch mitten im Block'),
			foto('2024-timmendorf-5', 'Gruppenfoto mit goldenen Ketten auf der Tribüne'),
			foto('2024-timmendorf-4', 'Gelber Rauch und Fahne vor dem Center Court'),
		],
	},
	{
		jahr: 2023,
		ort: 'Timmendorfer Strand',
		motto: 'Oben ohne, Pappe in der Hand',
		fotos: [
			foto('2023-timmendorf-2', 'Das Banner „Fraktion Bräune“ mit bunten Buchstaben vor der vollen Tribüne'),
			foto('2023-timmendorf-1', 'Fans oben ohne singen mit Fahne und Schildern auf der Tribüne'),
			foto('2023-timmendorf-3', 'Drei Fans oben ohne jubeln an der Bande'),
			foto('2023-timmendorf-4', 'Selbstgemalte Schilder wie „Ballern“ über dem Banner'),
		],
	},
];
