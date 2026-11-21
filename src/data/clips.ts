// Videos in public/videos/<name>.mp4 + .webp (geschnitten von scripts/clips.mjs bzw. scripts/videos.sh).
// titel: unsere eigenen Worte aus der Instagram-Story bzw. dem Reel, wird unter dem Handy angezeigt.
// ton: false = ohne Tonspur

export interface Clip {
	name: string;
	titel?: string;
	/** Nur für Screenreader, wenn kein Titel angezeigt wird */
	beschreibung: string;
	ton: boolean;
}

const c = (name: string, beschreibung: string, ton: boolean, titel?: string): Clip => ({ name, beschreibung, ton, titel });

export const clips = {
	// Aus dem Block (Stories)
	'dortmund26-brennt': c('dortmund26-brennt', 'Fackeln vor dem Banner „Jetzt brennt der Pott“', true, 'Jetzt brennt der Pott 🔥'),
	'dortmund26-nele': c('dortmund26-nele', 'Der Block singt für Nele Barber und Melli', true, 'Nele & Melli, OLE!'),
	'dortmund26-angezuendet': c('dortmund26-angezuendet', 'Fackeln und Rauch im Block', true, 'Uff, Dortmund ist angezündet 😮‍💨'),
	'hamburg26-pyro': c('hamburg26-pyro', 'Pyro hinter der Bande beim Einlauf in Hamburg', true, 'Pyro by Fraktion Bräune'),
	'hamburg26-legends': c('hamburg26-legends', 'Mol und Sørum laufen durch den Rauch der Choreo „Living Legends“', true, '„Living Legends“ 🇳🇴'),
	'muenchen26-rudern': c('muenchen26-rudern', 'Die ganze Tribüne rudert im Sonnenuntergang', true, 'how it started … how it ended'),
	'muenchen26-chenoa': c('muenchen26-chenoa', 'Der Block feuert Chenoa Christ an', true, 'Macherinnen 😍'),
	'muenchen26-goated': c('muenchen26-goated', 'Rote Fackelwand bei Nacht in München', true, 'München jetzt schon GOATED'),
	'berlin26-pyrobts': c('berlin26-pyrobts', 'Fackeln vor dem Regenbogen-Banner', true, 'pyro bts'),
	'berlin26-fackelreihe': c('berlin26-fackelreihe', 'Fackeln an der Bande in Berlin', true, 'Let’s goooooo 🔥'),
	'berlin25-licht': c('berlin25-licht', 'Fackeln im Dunkeln', true, 'Wir sind euer Licht im Dunkeln 😍'),
	'berlin25-robinjonas': c('berlin25-robinjonas', 'Der Block singt für Robin und Jonas', true, 'Robin & Jonas machen zuuuuu ❌'),
	'berlin25-btspyro': c('berlin25-btspyro', 'Pyro hinter dem Banner der Hauptstadt Beacher', true, 'BTS Pyro 🥵'),
	'berlin25-pyro': c('berlin25-pyro', 'Fackeln vor dem Banner „Wir brenn’ für euch“', true),
	'duesseldorf25-paulies': c('duesseldorf25-paulies', 'Der Block singt „Let’s go Paulies“', true, 'Wir haben euren Rücken 😘'),
	'timmendorf24-ericmomme': c('timmendorf24-ericmomme', 'Fahnen und Jubel für Eric und Momme', true, 'ERIC & MOMME AUF DIE 1!!!'),
	'kuehlungsborn24-mvp': c('kuehlungsborn24-mvp', 'Der Block singt „MVP“ für Eric Stadie', true, 'MVP oder MVP?'),
	'kuehlungsborn24-freak': c('kuehlungsborn24-freak', 'Sprechchor für Daniel Kirchner und Lui Wüst', true, 'Let’s goooooo 😍'),
	'duesseldorf24-huette': c('duesseldorf24-huette', 'Bunter Rauch über dem Block in Düsseldorf', true, 'Brennt die Hütte ab 🔥'),
	'bremen24-schalala': c('bremen24-schalala', 'Der Block schwenkt Shirts und singt Schalala', true, '🥵🥵🥵'),
	'hamburg23gbt-fanclub': c('hamburg23gbt-fanclub', 'Fahnen und Jubel im Block in Hamburg', true, 'Fanclub ist am Start 🙌'),
	'hamburg23gbt-achtelfinale': c('hamburg23gbt-achtelfinale', 'Clip der German Beach Tour: mit den Fans ins Achtelfinale', true, 'Mit starkem Support der Fans ins vorletzte Achtelfinale'),
	'hamburg23gbt-sieg': c('hamburg23gbt-sieg', 'Matchball und Jubel im Block', true, 'Sieg für Eric & King'),
	'hamburg23-sverige': c('hamburg23-sverige', 'Mit schwedischen Fans im Stadion am Rothenbaum', true, 'Fraktion Bräune wurde zur Fraktion Sverige 🇸🇪'),
	'berlin23-zustand': c('berlin23-zustand', 'Zusammenschnitt vom Wochenende in Berlin', true, 'Zustand nach GBT Berlin'),
	'berlin23-richie': c('berlin23-richie', 'Sprechchor, während einer auf dem Court tanzt', true, 'Richie gönnt'),
	'paris24-olympia': c('paris24-olympia', 'Jubel im Olympiastadion am Eiffelturm', true, 'Nett hier, wann GBT in Paris?'),
	'timmendorf25-fackel': c('timmendorf25-fackel', 'Fackel im Block in Timmendorf', true),
	'timmendorf25-fahne': c('timmendorf25-fahne', 'Fahne über dem Block in Timmendorf', true),

	// Choreos
	'timmendorf25-makingof': c('timmendorf25-makingof', 'Die Choreo „33 Jahre“ wird gemalt', true, 'Making-of'),
	'timmendorf25-gruen': c('timmendorf25-gruen', 'Grüner Rauch über der Choreo', true, 'Jetzt das Nächste'),
	'timmendorf25-abfahrt': c('timmendorf25-abfahrt', 'Fackeln vor dem Banner „Auf geht’s, kämpfen und siegen“', true, 'Abfahrt 🔥'),
	'reel-choreo-bts': c('reel-choreo-bts', 'Hinter den Kulissen der Choreo zum fünfjährigen Jubiläum', true, 'Behind the scenes'),
	'reel-dortmund-pov': c('reel-dortmund-pov', 'Mitten in der Choreo in Dortmund, mit Stimmen aus dem Block', true, 'POV: du bist bei der größten Beachvolleyball-Choreo dabei'),

	// Wer wir sind, Award
	'reel-crew': c('reel-crew', 'Die Crew stellt sich vor, mit Namen und Aufgaben', true, 'Meet the Crew'),
	'reel-award-training': c('reel-award-training', 'Morgens Tanz üben, abends auf der Award-Bühne', true, 'Hartes Training zahlt sich aus'),
	'award25-interview': c('award25-interview', 'Interview auf der Bühne der GBT Awards 2025', true, 'Auf der Bühne'),
} satisfies Record<string, Clip>;

export type ClipName = keyof typeof clips;

/** Fernsehen: Mitschnitte aus dem Livestream der German Beach Tour */
export interface Sender {
	name: string;
	titel: string;
	wann: string;
}

export const sender: Sender[] = [
	{ name: 'friesenjung', titel: 'Friesenjung', wann: 'Timmendorf 2023' },
	{ name: 'dancecam', titel: 'Dance Cam', wann: 'Timmendorf 2023' },
	{ name: 'taube', titel: 'Die Taube', wann: 'Timmendorf 2023' },
	{ name: 'biertaufe', titel: 'Biertaufe', wann: 'Timmendorf 2023' },
	{ name: 'harlemshake', titel: 'Harlem Shake', wann: 'Timmendorf 2023' },
	{ name: 'aufmpferd', titel: 'Aufm Pferd', wann: 'Timmendorf 2023' },
	{ name: 'duesseldorf24-zuendeln', titel: 'Schon wieder am Zündeln', wann: 'Düsseldorf 2024' },
	{ name: 'duesseldorf24-shirts', titel: 'Fan-Shirts', wann: 'Düsseldorf 2024' },
	{ name: 'muenchen24-traum', titel: 'Riesenbanner', wann: 'München 2024' },
	{ name: 'hamburg26-bilder', titel: 'Schaut euch diese Bilder an', wann: 'Hamburg 2026' },
	{ name: 'hamburg26-elitesieg', titel: 'Elite-Sieg', wann: 'Hamburg 2026' },
];

/** Was im Livestream über uns gesagt wurde (wörtlich, gekürzt), mit Verweis auf den Sender */
export const stimmen = [
	{ text: 'Das wird viral gehen, ohne Witz. … Timmendorf ist besser.', wann: 'Timmendorf 2023', sender: 'taube' },
	{ text: 'Herzliches Willkommen an die Fraktion Bräune, die hier schon wieder am Zündeln sind. Schön, dass ihr da seid.', wann: 'Düsseldorf 2024', sender: 'duesseldorf24-zuendeln' },
	{ text: 'Es gibt Fan-Shirts mit der Fraktion Bräune. … Das ist insane. Viel Liebe für die Fraktion.', wann: 'Düsseldorf 2024', sender: 'duesseldorf24-shirts' },
	{ text: 'Also ein absoluter Traum an die Fraktion. … Ich liebe, wie das aussieht auf der Tribüne. Mit diesen Riesenbannern.', wann: 'München 2024', sender: 'muenchen24-traum' },
];
