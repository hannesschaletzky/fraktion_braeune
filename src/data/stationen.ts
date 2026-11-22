import { foto, type Foto } from './fotos';
import type { ClipName } from './clips';

export interface Station {
	jahr: number;
	/** Monat (1–12) */
	monat: number;
	ort: string;
	/** Welcher Stopp in der Stadt, wenn es in dem Jahr mehrere gab */
	stopp?: 1 | 2;
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
		monat: 8,
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
		monat: 8,
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
		monat: 7,
		ort: 'München',
		stopp: 1,
		motto: 'Letztes Wochenende wurde in München ordentlich gerudert.',
		fotos: [
			foto('2026-muenchen-1', 'Der Block bei Nacht, rote Fackeln und Rauch über den Köpfen'),
			foto('2026-muenchen-2', 'Ein Fan hält eine Fackel in die Luft, alles in rotes Licht getaucht'),
			foto('2026-muenchen-block', 'Die Gruppe oben ohne in der Sonne hinter dem Banner „Fraktion Bräune“'),
			foto('choreo-2026-brezel-spieler', 'Zwei Spieler drehen sich auf dem Court zur Choreo „Zerbrezelt sie!“ um'),
			foto('2026-muenchen-rauch', 'Fraktion-Fahnen wehen im blauen Rauch'),
			foto('2026-muenchen-tribuene', 'Volle Tribüne unter blauem Himmel, vorne ein Fan oben ohne am Banner'),
		],
		clips: ['muenchen26-rudern', 'muenchen26-chenoa', 'muenchen26-goated'],
	},
	{
		jahr: 2026,
		monat: 6,
		ort: 'Berlin',
		stopp: 2,
		motto: 'Die Hauptstadt hat geliefert.',
		fotos: [
			foto('2026-berlin-2', 'Fans schreien hinter dem Banner mit den bunten Buchstaben'),
			foto('choreo-berlin-toursieg', 'Schilder „Unser Wunsch: Toursieg“ an der Bande'),
			foto('2026-berlin2-1', 'Die Spieler kommen an die Bande und klatschen mit dem Block ab'),
		],
		clips: ['berlin26-fackelreihe', 'berlin26-fahnen'],
	},
	{
		jahr: 2026,
		monat: 6,
		ort: 'Berlin',
		stopp: 1,
		motto: 'Es geht loooos 🎉',
		fotos: [
			foto('2026-berlin-feuerwerk', 'Feuerwerk über der Fackelwand zum fünfjährigen Jubiläum, Spieler auf dem Court bei Nacht'),
			foto('2026-berlin-1', 'Feuerwand aus Fackeln am Spielfeldrand bei Nacht'),
			foto('2026-berlin-4', 'Die Gruppe in weißen Shirts jubelt hinter dem Fraktion-Bräune-Banner'),
			foto('2026-berlin-3', 'Nahaufnahme einer Fackel in dichtem rotem Rauch'),
			foto('2026-berlin-5', 'Der Center Court von oben bei Nacht, Fackeln leuchten im Block'),
		],
		clips: ['berlin26-feuerwerk', 'berlin26-pyrobts', 'berlin26-trommel'],
	},
	{
		jahr: 2025,
		monat: 9,
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
		monat: 8,
		ort: 'Berlin',
		stopp: 2,
		motto: 'Berlin, was war das denn?!',
		fotos: [
			foto('choreo-2025-regieren', 'Choreo „Hier regieren die Hauptstadt Beacher“ mit Fackeln und Rauch'),
			foto('2025-berlin2-1', 'Ein Spieler klatscht mit dem jubelnden Block ab'),
		],
		clips: ['berlin25-licht', 'berlin25-hey'],
	},
	{
		jahr: 2025,
		monat: 8,
		ort: 'Berlin',
		stopp: 1,
		motto: 'Wir holen unseren 1. Titel in der Geschichte der Fraktion! 🥹',
		fotos: [
			foto('2025-berlin-1', 'Die Gruppe jubelt auf der roten Tribüne mit einem Pokal'),
			foto('choreo-2025-baerenhorde', 'Choreo „Die Bärenhorde stürmt das Feld – für den geilsten Club der Welt“'),
			foto('2025-berlin-2', 'Selfie aus dem Block, alle lachen in die Kamera'),
			foto('2025-berlin-3', 'Der Block von oben, Fahnen und Rauch über der Tribüne'),
		],
		clips: ['berlin25-robinjonas', 'berlin25-btspyro'],
	},
	{
		jahr: 2025,
		monat: 7,
		ort: 'München',
		stopp: 2,
		motto: 'München liefert. Wir auch.',
		fotos: [
			foto('choreo-2025-bayern', 'Choreo „Wir sind eure Hauptstadt – ihr Bayern!“'),
			foto('2025-muenchen-1', 'Der Block oben ohne mit erhobenen Armen'),
			foto('2025-muenchen-2', 'Fans jubeln auf der Tribüne in München'),
		],
		clips: ['muenchen25-wirauch', 'muenchen25-atmo'],
	},
	{
		jahr: 2025,
		monat: 5,
		ort: 'Düsseldorf',
		stopp: 1,
		motto: 'Und die Fahnen wehen wieder.',
		fotos: [
			foto('choreo-2025-koenig', 'Banner „Der König ist zurück“ unter Fahnen und weißem Rauch vor blauem Himmel'),
			foto('2025-duesseldorf-1', 'Der Block reißt die Arme hoch'),
			foto('2025-duesseldorf-koenig', 'Banner „Kniet nieder“ und „Der König ist zurück“ im weißen Rauch'),
			foto('2025-duesseldorf-abklatschen', 'Ein Spieler klatscht an der Bande mit dem Block ab'),
			foto('choreo-2025-pott', 'Banner „Unser Pott hat richtig Dampf“ mit blauem Rauch'),
			foto('2025-duesseldorf-2', 'Die Gruppe auf der Tribüne in Düsseldorf'),
		],
		clips: ['duesseldorf25-paulies', 'duesseldorf25-fahnen'],
	},
	{
		jahr: 2024,
		monat: 9,
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
		clips: ['timmendorf24-mvp', 'timmendorf24-ericmomme'],
	},
	{
		jahr: 2024,
		monat: 8,
		ort: 'Kühlungsborn',
		stopp: 2,
		motto: 'Fraktion Bräune im Rentnerparadies 2.0',
		fotos: [
			foto('2024-kuehlungsborn-3', 'Zwei Fans mit Fackeln und rotem Rauch vor der Bande'),
			foto('2024-kuehlungsborn-1', 'Spieler klatschen mit dem jubelnden Block an der Bande ab'),
			foto('2024-kuehlungsborn-2', 'Drei Fans schreien über dem Fraktion-Bräune-Banner in den Himmel'),
			foto('2024-kuehlungsborn-4', 'Zwei Spieler umarmen sich vor Fackeln und dem Banner „Wir brenn’ für euch“'),
		],
		clips: ['kuehlungsborn24-mvp', 'kuehlungsborn24-freak'],
	},
	{
		jahr: 2024,
		monat: 8,
		ort: 'Paris',
		zusatz: 'Olympia',
		motto: 'Nett hier, wann GBT in Paris?',
		fotos: [
			foto('2024-paris-banner', 'Zwei aus der Fraktion mit dem Fraktion-Bräune-Banner und Baguettes vor dem Eiffelturm'),
			foto('2024-paris-1', 'Der Eiffelturm im Abendlicht über dem vollen Beachvolleyball-Stadion'),
			foto('2024-paris-2', 'Blick von der Tribüne auf den Court und die vollen Ränge'),
		],
		clips: ['paris24-olympia', 'paris24-allez'],
	},
	{
		jahr: 2024,
		monat: 7,
		ort: 'München',
		stopp: 1,
		motto: 'München hat richtig geschmeckt.',
		fotos: [
			foto('2024-muenchen-sieg', 'Die Sieger knien jubelnd im Sand, dahinter der Block mit dem Fraktion-Bräune-Banner reißt die Arme hoch'),
			foto('2024-muenchen-1', 'Der Block hinter dem Fraktion-Bräune-Banner in München'),
			foto('choreo-2024-aufgehts', 'Banner „Auf geht’s, kämpfen und siegen“ im grünen Rauch'),
			foto('2024-muenchen-2', 'Die Gruppe jubelt an der Bande'),
		],
		clips: ['muenchen24-nacht', 'muenchen24-feuerwerk'],
	},
	{
		jahr: 2024,
		monat: 6,
		ort: 'Bremen',
		motto: 'Was ein geiler Tag!',
		fotos: [foto('2024-bremen-1', 'Gruppenfoto in Fraktion-Shirts mit Medaillen vor dem Gelände in Bremen')],
		clips: ['bremen24-schalala', 'bremen24-tim', 'bremen24-jubel'],
	},
	{
		jahr: 2024,
		monat: 5,
		ort: 'Düsseldorf',
		stopp: 1,
		motto: 'Es geht wieder looooos!',
		fotos: [
			foto('2024-duesseldorf-vollgas', 'Choreo „Dieses Jahr wieder Vollgas“ mit Fahnen und rosa Rauch'),
			foto('2024-duesseldorf-1', 'Drei aus der Gruppe mit dem Pappschild „Fraktion Bräune“ und den neuen Shirts auf der Tribüne'),
			foto('2024-duesseldorf-court', 'Blick aus dem Block auf den Court in Düsseldorf'),
		],
		clips: ['duesseldorf24-huette', 'duesseldorf24-tuecher'],
	},
	{
		jahr: 2023,
		monat: 9,
		ort: 'Timmendorfer Strand',
		motto: 'Wer hätte gedacht, dass aus ein paar Freunden … sowas unfassbar Geiles entsteht?',
		fotos: [
			foto('choreo-2023-kaempfen', 'Die Gruppe hält das Banner „Auf geht’s kämpfen und siegen!“ auf der Tribüne hoch'),
			foto('2023-timmendorf-2', 'Das Banner „Fraktion Bräune“ mit bunten Buchstaben vor der vollen Tribüne'),
			foto('2023-timmendorf-1', 'Fans oben ohne singen mit Fahne und Schildern auf der Tribüne'),
			foto('2023-timmendorf-3', 'Drei Fans oben ohne jubeln an der Bande'),
			foto('2023-timmendorf-4', 'Selbstgemalte Schilder wie „Ballern“ über dem Banner'),
			foto('2023-timmendorf-medaillen', 'Zwei Fans an der Bande mit Warsteiner-Medaillen und einem Herz-Schild'),
		],
		clips: ['timmendorf23-trommel', 'timmendorf23-gekommen', 'timmendorf23-block'],
	},
	{
		jahr: 2023,
		monat: 8,
		ort: 'Hamburg',
		zusatz: 'Elite16',
		motto: 'Fraktion Bräune wurde zur Fraktion Sverige 🇸🇪',
		fotos: [
			foto('2023-hamburg-1', 'Pappschild „Fraktion Bräune“ im Stadion am Rothenbaum'),
			foto('2023-hamburg-2', 'Das Fraktion-Bräune-Banner auf den leeren Rängen am Rothenbaum'),
		],
		clips: ['hamburg23-sverige', 'hamburg23-support'],
	},
	{
		jahr: 2023,
		monat: 8,
		ort: 'Berlin',
		motto: 'Zustand nach GBT Berlin: Stimmen im Sparmodus, Ohren taub, Bock auf Timmendorf!',
		fotos: [
			foto('2023-berlin-sieg', 'Die Sieger mit Pokal vor dem jubelnden Block, daneben das Banner „Fraktion Bräune“'),
			foto('2023-berlin-1', 'Der Block jubelt hinter dem Banner „Fraktion Bräune“'),
			foto('2023-berlin-2', 'Volle Tribüne, alle reißen die Arme hoch'),
			foto('2023-berlin-3', 'Ein Spieler vor dem Block mit hochgehaltenen Bewertungsschildern'),
			foto('2023-berlin-4', 'Selbstgemalte Pappschilder „Fraktion Bräune“ im Block'),
		],
		clips: ['berlin23-zustand', 'berlin23-richie'],
	},
	{
		jahr: 2023,
		monat: 6,
		ort: 'Hamburg',
		motto: '„Verrückte Menschen ❤️“ – Eric Stadie über uns',
		fotos: [],
		clips: ['hamburg23gbt-fanclub', 'hamburg23gbt-achtelfinale', 'hamburg23gbt-sieg'],
	},
	{
		jahr: 2023,
		monat: 5,
		ort: 'Bremen',
		stopp: 1,
		motto: 'Auswärtsfahrt 🤍',
		fotos: [
			foto('2023-bremen-2', 'Der Block schreit mit Schildern „Schmeckt“, „Ein’n drauf“ und „10/10“ über dem Banner'),
			foto('2023-bremen-1', 'Zwei Spieler in Orange jubeln mit Pokalen vor dem Block, dahinter Schilder wie „Eric Stadie“'),
		],
		clips: ['bremen23-block', 'bremen23-abfahrt'],
	},
	{
		jahr: 2022,
		monat: 9,
		ort: 'Timmendorfer Strand',
		motto: 'Hallooo ihr da drüüübeeen ✌🏼❤️',
		fotos: [
			foto('2022-timmendorf-vollgas', 'Der Block winkt, vorne das Pappschild „Heute nochmal Vollgas!“'),
			foto('2022-timmendorf-1', 'Fans mit Pappschildern wie „Ball“ auf der Tribüne'),
			foto('2022-timmendorf-2', 'Fans halten Schilder „Out“ und „10“ hoch'),
			foto('2022-timmendorf-3', 'Fans mit Fahne und Schildern auf der Tribüne'),
			foto('2022-timmendorf-leidergeil', 'Pappschilder „Leider geil“ und „Fraktion Bräune“ in der vollen Tribüne'),
		],
	},
	{
		jahr: 2022,
		monat: 8,
		ort: 'München',
		zusatz: 'EM',
		motto: 'Schmeckt ♥',
		fotos: [
			foto('2022-em-schilder', 'Pappschilder „Schmeckt ♥“ und „Fraktion Bräune“ im Block am Königsplatz'),
			foto('2022-em-zelt', 'Die Gruppe oben ohne mit dem Schild „Fraktion Bräune“ vor einem weißen Zelt'),
			foto('2022-em-bodypainting', 'Drei Fans oben ohne mit aufgemalten Buchstaben und Herz'),
			foto('2022-em-selfie', 'Selfie mitten im Block'),
		],
		clips: ['em22-tv', 'em22-court'],
	},
];

export const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** Ort mit Stopp-Nummer, z. B. "Berlin 2" */
export const ortName = (s: Station) => (s.stopp ? `${s.ort} ${s.stopp}` : s.ort);

/** Anker auf der Stationen-Seite */
export function slug(s: Station) {
	return `station-${s.jahr}-${ortName(s)}${s.zusatz ? `-${s.zusatz}` : ''}`
		.toLowerCase()
		.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
