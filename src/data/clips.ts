import { monate } from './stationen';
// Videos in public/videos/<name>.mp4 + .webp (geschnitten von scripts/clips.mjs bzw. scripts/videos.sh).
// titel: unsere eigenen Worte aus der Instagram-Story bzw. dem Reel, wird unter dem Handy angezeigt.
// ton: false = ohne Tonspur

export interface Clip {
	name: string;
	titel?: string;
	/** Nur für Screenreader, wenn kein Titel angezeigt wird */
	beschreibung: string;
	ton: boolean;
	/** Querformat: das Handy wird quer gedreht gezeigt */
	quer?: boolean;
}

const c = (name: string, beschreibung: string, ton: boolean, titel?: string, quer?: boolean): Clip => ({ name, beschreibung, ton, titel, quer });

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
	'berlin26-feuerwerk': c('berlin26-feuerwerk', 'Einlauf mit 5-Jahre-Banner, Fackelwand und Feuerwerk', true, 'Legendärster Einlauf'),
	'berlin26-trommel': c('berlin26-trommel', 'Trommel und Sprechchor für Sven Winter', true),
	'berlin26-fahnen': c('berlin26-fahnen', 'Fahnen wehen über dem Block in Berlin', true, 'die Fahnen wehen wieder 😍'),
	'berlin25-hey': c('berlin25-hey', 'Der Block klatscht und ruft für Eric und King', true),
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
	'hamburg23-tribuene': c('hamburg23-tribuene', 'Die Gruppe oben ohne hüpft Arm in Arm auf der Steintribüne am Rothenbaum', true),
	'hamburg23-sverige': c('hamburg23-sverige', 'Mit schwedischen Fans im Stadion am Rothenbaum', true, 'Fraktion Bräune wurde zur Fraktion Sverige 🇸🇪'),
	'berlin23-zustand': c('berlin23-zustand', 'Zusammenschnitt vom Wochenende in Berlin', true, 'Zustand nach GBT Berlin'),
	'berlin23-richie': c('berlin23-richie', 'Sprechchor, während einer auf dem Court tanzt', true, 'Richie gönnt'),
	'muenchen25-wirauch': c('muenchen25-wirauch', 'Der Block schunkelt Arm in Arm', true, 'Wir auch.'),
	'muenchen25-atmo': c('muenchen25-atmo', 'Fahnen und Jubel im Block in München', true, 'Bisschen atmo'),
	'duesseldorf25-fahnen': c('duesseldorf25-fahnen', 'Fahnenmeer und Jubel in Düsseldorf', true),
	'duesseldorf24-tuecher': c('duesseldorf24-tuecher', 'Shirts kreisen über dem Block', true),
	'paris24-allez': c('paris24-allez', 'Jubel für Ehlers und Wickler bei Olympia', true, 'Die Fraktion hat euren Rücken ❤️ ALLEZ'),
	'muenchen24-nacht': c('muenchen24-nacht', 'Abendkonzert der Tour in München', true, 'München schwer zu toppen.'),
	'muenchen24-feuerwerk': c('muenchen24-feuerwerk', 'Feuerwerk über dem Olympiapark', true),
	'timmendorf23-block': c('timmendorf23-block', 'Selfie-Video mitten im Block, Fahnen wehen, alle schreien', true),
	'timmendorf23-trommel': c('timmendorf23-trommel', 'Trommel und Sprechchor „Er legt“', true, 'musikalisch talentiert sind wir auch 🥁'),
	'timmendorf23-gekommen': c('timmendorf23-gekommen', 'Sprechchor „Er ist gekommen“ im Block', true),
	'hamburg23-support': c('hamburg23-support', 'Anfeuern im Stadion am Rothenbaum', true, 'Natürlich ist der Support am Start!'),
	'timmendorf24-mvp': c('timmendorf24-mvp', 'Rote Fackeln bei Nacht, der Block feiert den MVP', true, 'MVP!!!'),
	'kw21-poniewaz': c('kw21-poniewaz', 'Interview mit den Poniewaz-Brüdern im Livestream, es geht um die Fans hinter dem Feld', true, undefined, true),
	'kw21-story': c('kw21-story', 'Story eines Spielers nach dem Sieg: „Die Gang auf unserer Seite hat ordentlich gepusht“', true),
	'kw21-kommentar': c('kw21-kommentar', 'Die Kamera zeigt unsere Reihe, der Kommentar nennt die Fraktion Bräune', true, undefined, true),
	'muenchen24-ben': c('muenchen24-ben', 'Pinker Rauch im Block, der Hallensprecher fragt nach Ben und bittet um Applaus für die Fraktion Bräune', true, undefined, true),
	'em22-tv': c('em22-tv', 'Unser Block mit dem Schild „Fraktion Bräune“ in der TV-Übertragung der EM', true),
	'em22-court': c('em22-court', 'Blick vom Block auf den Court am Königsplatz, vorne wird ein Schild hochgehalten', true),
	'bremen23-block': c('bremen23-block', 'Der Block feuert Eric Stadie direkt an der Bande an', true),
	'bremen23-abfahrt': c('bremen23-abfahrt', 'Im Zug nach Bremen: Bier und Pappschilder malen', true, 'Auswärtsfahrt'),
	'bremen24-tim': c('bremen24-tim', 'Moderator Tim wärmt sich im Fraktion-Bräune-Shirt auf', true, 'Tim im neuen Fraktions-Shirt'),
	'bremen24-jubel': c('bremen24-jubel', 'Jubel und Fahne auf der roten Tribüne in Bremen', true),
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
	// Weitere Stories aus dem Block (abgenickt am 23.11.2026)
	'dortmund26-1a': c('dortmund26-1a', 'Roter Fackelteppich im Block, Jubel', true, 'Die große Pyro-Choreo'),
	'dortmund26-1b': c('dortmund26-1b', 'Fackeln, Abklatschen mit Eric', true, '@eric.stadie ❤️'),
	'dortmund26-1c': c('dortmund26-1c', 'Block singt „Nele Barber“, Arme hoch', true, 'WAS EIN SPIEL!'),
	'dortmund26-1d': c('dortmund26-1d', 'Gesang nachts, Rauch und Fahnen', true, '3 Tage Ohrwurm'),
	'dortmund26-1e': c('dortmund26-1e', 'Viele Fahnen unter Flutlicht', true, 'Wie viele Fahnen kann ein Mann schwenken?!'),
	'hamburg26-2a': c('hamburg26-2a', 'Matchball-Jubel, Fackeln, Fahne', true, 'Danke für die Show'),
	'hamburg26-2b': c('hamburg26-2b', 'Pyro-Choreo mit „Elite“-Banner', true, 'Hamburg liefert nicht nur sportlich'),
	'hamburg26-2c': c('hamburg26-2c', 'Fahne und Trommeln an der Bande', true, 'Die Fahnen wedeln wieder'),
	'muenchen26-3a': c('muenchen26-3a', 'Fahnen, grüne Fackeln, Jubel', true, 'Fahnen und Fackeln in München'),
	'muenchen26-3b': c('muenchen26-3b', 'Fackeln mit blauem Rauch', true, 'Blauer Rauch im Block'),
	'muenchen26-3c': c('muenchen26-3c', 'Ekstase an der Bande', true, 'MASCHINE @eric.stadie'),
	'muenchen26-3d': c('muenchen26-3d', 'Chor für Robin und Jonas', true, 'uuuuund gleich reinsubben'),
	'muenchen26-3e': c('muenchen26-3e', 'Abendblock singt und klatscht', true, 'Für Eric lernen wir singen'),
	'berlin26-4a': c('berlin26-4a', 'Rote Fackeln, Fahne, Flutlicht', true, 'Fackeln und Fahnen am Abend', true),
	'berlin26-4b': c('berlin26-4b', 'Blauer Rauch, Fahnen, Banner', true, 'Blaue Choreo'),
	'berlin26-4c': c('berlin26-4c', 'Fahnen und Singen oben ohne', true, 'Die Fahnen wehen'),
	'berlin26-4d': c('berlin26-4d', 'Trommeln und Singen, Abendlicht', true, 'Wann international @eric.stadie?'),
	'berlin26-5a': c('berlin26-5a', 'Fackeln und Fahne nachts', true, 'Let’s goooo @philipp.huster'),
	'berlin26-5b': c('berlin26-5b', 'Jubiläums-Choreo mit Pyro und Banner', true, 'Fünf Jahre Fraktion Bräune'),
	'berlin26-5c': c('berlin26-5c', 'Block singt und klatscht', true, 'Schalalala für Eric'),
	'berlin26-5d': c('berlin26-5d', 'Gruppe in Shirts jubelt an der Bande', true, 'Monsteeeeeer… BLOCK'),
	'timmendorf25-6a': c('timmendorf25-6a', 'Rauch, Fahnen und Gesang im Block', true, 'Endlich wieder Choreo'),
	'timmendorf25-6c': c('timmendorf25-6c', 'Choreo aus dem Block, Fackel, Fahne', true, 'pov: Choreo von innen'),
	'timmendorf25-6d': c('timmendorf25-6d', 'Gruppe Arm in Arm an der Bande', true, 'C’mon Jungs!'),
	'berlin25-7a': c('berlin25-7a', 'Gruppe mit Banner an der Bande', true, 'Let’s fucking go'),
	'berlin25-7b': c('berlin25-7b', 'Grüner Rauch, Gesang', true, 'Doppel-Pyro'),
	'berlin25-7c': c('berlin25-7c', 'Jubel mit Fahnen nach Punktgewinn', true, 'Maschinen!!!'),
	'berlin25-7d': c('berlin25-7d', 'Grimassen, Anspannung im Block', true, 'Die Spannung steigt!!!!'),
	'berlin25-7e': c('berlin25-7e', 'Mitsingen im Block', true, 'textsicher sind wir'),
	'berlin25-8a': c('berlin25-8a', 'Fahnen, Fackeln, Rauch im Block', true, 'Wie viel schöner kann’s werden?'),
	'berlin25-8b': c('berlin25-8b', 'Banner hoch im Block', true, 'pov: mitten in der Fraktion'),
	'berlin25-8c': c('berlin25-8c', 'Ausgelassener Jubel im Block', true, 'Was haben wir denn da?'),
	'berlin25-8d': c('berlin25-8d', 'Fahnenschwenken mit Rauch', true, 'Fahnen und gelber Rauch'),
	'berlin25-8e': c('berlin25-8e', 'Fackeln im ganzen Block', true, 'Pyro-Block vom Court'),
	'muenchen25-9a': c('muenchen25-9a', 'Jubel mit Spielern an der Bande', true, 'Starkes Game'),
	'muenchen25-9b': c('muenchen25-9b', 'Spieler an der Bande, Fahne', true, 'Es gibt immer ein erstes Mal'),
	'muenchen25-9c': c('muenchen25-9c', 'Fahnen vor dem Olympiaturm', true, 'München liefert.'),
	'muenchen25-9d': c('muenchen25-9d', 'Anfeuern im Block', true, 'Slay.'),
	'duesseldorf25-10a': c('duesseldorf25-10a', 'Rauchwolke im Stadion, voller Block', true, 'Rauch über dem Center Court'),
	'duesseldorf25-10b': c('duesseldorf25-10b', 'Fahnenschwenker, Jubel, Court im Bild', true, 'Fahnen hoch im Block'),
	'duesseldorf25-10c': c('duesseldorf25-10c', 'Fahnen vor blauem Himmel', true, 'Und die Fahnen wehen wieder'),
	'duesseldorf25-10d': c('duesseldorf25-10d', 'Jubel mit Spielern an der Bande', true, 'Abklatschen an der Bande'),
	'duesseldorf25-10e': c('duesseldorf25-10e', 'Gruppe oberkörperfrei am Court', true, 'Unsere breiten Rücken'),
	'timmendorf24-11a': c('timmendorf24-11a', 'Fahnen, Rauch, Spieler davor', true, 'Fahnen und Rauch im Finale'),
	'timmendorf24-11b': c('timmendorf24-11b', '„Unsere Helden“ mit Rauch, Jubel', true, 'Choreo im Rauch'),
	'timmendorf24-11d': c('timmendorf24-11d', 'Fahne, oranger Rauch, Chor', true, 'Behind the scenes'),
	'timmendorf24-11e': c('timmendorf24-11e', 'Arm in Arm singend', true, 'Die Stimmen gehen wieder'),
	'kuehlungsborn24-12a': c('kuehlungsborn24-12a', 'Rote Fackeln und Fahnen im Block', true, 'Pyro für Lorenz/Stadie'),
	'kuehlungsborn24-12b': c('kuehlungsborn24-12b', 'Große Fahne, Chor im Stadion', true, 'Geht wieder'),
	'kuehlungsborn24-12c': c('kuehlungsborn24-12c', 'Pyro aus Court-Perspektive', true, 'Rauch über dem Court'),
	'kuehlungsborn24-12d': c('kuehlungsborn24-12d', 'Gruppe mit Fahnen an der Bande', true, 'Uuuund wir sind wieder am Start'),
	'kuehlungsborn24-12e': c('kuehlungsborn24-12e', 'Jubel, Fahne, voller Center Court', true, 'Macht schon wieder anders Bock'),
	'muenchen24-14a': c('muenchen24-14a', 'Grüner Rauch und Fahne', true, 'Grüner Rauch am Olympiaturm'),
	'muenchen24-14b': c('muenchen24-14b', 'Gruppe feiert, Olympiaturm', true, 'Peace im Block'),
	'muenchen24-14c': c('muenchen24-14c', 'Gruppe spielt selbst Beach', true, 'Fraktion 1, Gegner 0'),
	'bremen24-15b': c('bremen24-15b', 'Gesang im Block', true, 'Der Speck'),
	'bremen24-15c': c('bremen24-15c', 'Fahne auf leerer Tribüne', true, 'Was ein geiler Tag'),
	'bremen24-15d': c('bremen24-15d', 'Witziger Moment im Block', true, 'Unser eigener Müdi'),
	'duesseldorf24-16a': c('duesseldorf24-16a', 'Fahnenschwenken, volles Stadion', true, 'Fahnen über dem Stadion'),
	'duesseldorf24-16b': c('duesseldorf24-16b', 'Fahne gemalt, dann geschwenkt', true, 'Unsere neue Fraktionsflagge'),
	'duesseldorf24-16c': c('duesseldorf24-16c', 'Gruppe im Block mit Banner', true, 'Der Block in Düsseldorf'),
	'duesseldorf24-16d': c('duesseldorf24-16d', 'Banner an der Bande', true, 'Volle Tribüne mit Banner'),
	'timmendorf23-17a': c('timmendorf23-17a', 'Rauch und Fahnen im Stadion, Finalblock', true, 'Fürs Finale nochmal gezündet'),
	'timmendorf23-17b': c('timmendorf23-17b', 'Voller Block feiert, Spieler an der Bande', true, 'Revanche mit Ehlers/Wickler'),
	'timmendorf23-17c': c('timmendorf23-17c', 'TV-Bild: ganzer Block hüpft hinter dem Banner', true, 'Fraktion Bräune im TV', true),
	'timmendorf23-17d': c('timmendorf23-17d', 'Ganzes Stadion im Harlem Shake', true, 'Harlem Shake im Block'),
	'timmendorf23-17e': c('timmendorf23-17e', 'Fahne und Gesang an der Bande am Nebencourt', true, 'Side Quest auf Court 2'),
	'hamburg23-18a': c('hamburg23-18a', 'Verkleidete Gruppe mit Schild an der Bande', true, 'Heute leider keine Box'),
	'hamburg23-18b': c('hamburg23-18b', 'Ganze Gruppe in einer Reihe auf der Tribüne', true, 'Finde die Frauen im Video'),
	'hamburg23-18c': c('hamburg23-18c', 'Gruppe heizt die Tribüne am Außencourt an', true, 'Court 2 gezeigt, was Stimmung heißt'),
	'hamburg23-18d': c('hamburg23-18d', 'Handtuch schwenken an der Bande', true, 'Jubel in der Halle'),
	'hamburg23-18e': c('hamburg23-18e', 'Jubel mit Handtuch-Schwenken', true, 'So muss das'),
	'berlin23-19a': c('berlin23-19a', 'Block hinter dem Banner, Spieler davor', true, 'Stellenausschreibung: Suchen Capo'),
	'berlin23-19b': c('berlin23-19b', 'Siegjubel mit Spielern an der Bande', true, 'Lukas und Robin gewinnen'),
	'berlin23-19c': c('berlin23-19c', 'Gruppe mit Schildern an der Bande', true, 'Schilder am Court'),
	'hamburg23gbt-20a': c('hamburg23gbt-20a', 'Gruppe jubelt mit Schild', true, 'Jubel am Center Court'),
} satisfies Record<string, Clip>;

export type ClipName = keyof typeof clips;

/** Fernsehen: Mitschnitte aus dem Livestream der German Beach Tour und aus Fernsehbeiträgen */
export interface Sender {
	name: string;
	titel: string;
	jahr: number;
	/** Monat (1–12) */
	monat: number;
	/** Ort wie bei den Stationen, mit Stopp-Nummer, z. B. „Berlin 2“ */
	ort: string;
	/** Fremder Sender (nicht German Beach Tour), bekommt im Programm ein kleines Siegel, z. B. „BR24“ */
	anbieter?: string;
	/** Hochkant-Video: im Fernseher mit schwarzen Rändern statt beschnitten */
	hoch?: boolean;
}

/** Klartext für Screenreader, z. B. „Juni 2023, Hamburg, Twitch-Stream“ */
export const wannText = (s: Sender) => `${monate[s.monat - 1]} ${s.jahr}, ${s.ort}${s.anbieter ? `, ${s.anbieter}` : ''}`;

// Neueste zuerst, wie die Stationen
export const sender: Sender[] = [
	{ name: 'hamburg26-elitesieg', titel: 'Elite-Sieg', jahr: 2026, monat: 8, ort: 'Hamburg' },
	{ name: 'hamburg26-respekt', titel: 'Respekt fürs Banner', jahr: 2026, monat: 8, ort: 'Hamburg' },
	{ name: 'hamburg26-bilder', titel: 'Diese Bilder!', jahr: 2026, monat: 8, ort: 'Hamburg' },
	{ name: 'wdr4-dortmund', titel: 'Live bei WDR 4', jahr: 2026, monat: 8, ort: 'Dortmund', anbieter: 'WDR 4', hoch: true },
	{ name: 'twitch-aura', titel: 'Aura-Moment', jahr: 2026, monat: 6, ort: 'Berlin', hoch: true },
	{ name: 'gbt-allstars', titel: 'Fraktion vs. Allstars', jahr: 2025, monat: 8, ort: 'Berlin 2', hoch: true },
	{ name: 'berlin25-chenoa', titel: 'Chenoa vs. Fraktion', jahr: 2025, monat: 8, ort: 'Berlin 1' },
	{ name: 'br24-ultras', titel: 'Beachvolleyball-Ultras', jahr: 2025, monat: 7, ort: 'München', anbieter: 'BR24', hoch: true },
	{ name: 'gbt-eltern', titel: 'Fraktion oder Eltern?', jahr: 2025, monat: 7, ort: 'München', hoch: true },
	{ name: 'gbt-geheim', titel: 'Choreo? Geheim!', jahr: 2025, monat: 7, ort: 'München', hoch: true },
	{ name: 'gbt-ericdani', titel: 'Eric & Dani fordern', jahr: 2025, monat: 5, ort: 'Düsseldorf', hoch: true },
	{ name: 'muenchen24-traum', titel: 'Riesenbanner', jahr: 2024, monat: 7, ort: 'München' },
	{ name: 'muenchen24-ben', titel: 'Wer ist denn jetzt Ben?', jahr: 2024, monat: 7, ort: 'München' },
	{ name: 'duesseldorf24-zuendeln', titel: 'Schon wieder am Zündeln', jahr: 2024, monat: 5, ort: 'Düsseldorf' },
	{ name: 'duesseldorf24-shirts', titel: 'Fan-Shirts', jahr: 2024, monat: 5, ort: 'Düsseldorf' },
	{ name: 'taube', titel: 'Die Taube', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'dancecam', titel: 'Dance Cam', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'harlemshake', titel: 'Harlem Shake', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'aufmpferd', titel: 'Aufm Pferd', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'biertaufe', titel: 'Biertaufe', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'friesenjung', titel: 'Friesenjung', jahr: 2023, monat: 9, ort: 'Timmendorf' },
	{ name: 'hamburg23gbt-mvp', titel: 'Einfach MVP', jahr: 2023, monat: 6, ort: 'Hamburg' },
	{ name: 'hamburg23gbt-platz', titel: 'Der Platz passt zu denen', jahr: 2023, monat: 6, ort: 'Hamburg' },
	{ name: 'hamburg23gbt-sehen', titel: 'Die muss man doch sehen', jahr: 2023, monat: 6, ort: 'Hamburg' },
	{ name: 'hamburg23gbt-dancecam', titel: 'Shake that ass', jahr: 2023, monat: 6, ort: 'Hamburg' },
	{ name: 'timmendorf22-clipit', titel: 'Clip it!', jahr: 2022, monat: 9, ort: 'Timmendorf' },
	{ name: 'kw21-kommentar', titel: 'Die Fraktion Bräune', jahr: 2021, monat: 7, ort: 'Königs Wusterhausen' },
];

/** Was im Livestream über uns gesagt wurde (wörtlich, gekürzt), mit Verweis auf den Sender */
export const stimmen = [
	{ text: 'Schöne, schöne Stimmung hier! Und Fraktion Bräune wirklich einfach MVP.', sender: 'hamburg23gbt-mvp' },
	{ text: 'Also ein absoluter Traum an die Fraktion. … Ich liebe, wie das aussieht auf der Tribüne. Mit diesen Riesenbannern.', sender: 'muenchen24-traum' },
	{ text: 'Fraktion Bräune oder Eltern im Publikum? – Boah, das ist ja richtig unfair … Äh, Fraktion Bräune. – Der kam schnell.', sender: 'gbt-eltern' },
	{ text: 'Herzliches Willkommen an die Fraktion Bräune, die hier schon wieder am Zündeln sind. Schön, dass ihr da seid.', sender: 'duesseldorf24-zuendeln' },
	{ text: 'Es gibt Fan-Shirts mit der Fraktion Bräune. … Das ist insane. Viel Liebe für die Fraktion.', sender: 'duesseldorf24-shirts' },
	{ text: 'Nebenan die Fraktion Bräune. Das sind Beachvolleyball-Ultras. Sie kommen aus Berlin und fahren von Turnier zu Turnier.', anbieter: 'BR24', sender: 'br24-ultras' },
	{ text: 'Die sind hier mit einem Elite-Sieg-Banner hergekommen, für Lui und für Nils. … Und wenn sie den durchbringen, dann sag ich auch Respekt.', sender: 'hamburg26-respekt' },
	{ text: 'Ich finde es auch gut, dass die Fraktion Bräune diesen Platz sich wieder gekrallt hat. … Hier ist es mega geil, und der Platz passt auch sehr gut zu denen.', sender: 'hamburg23gbt-platz' },
];
