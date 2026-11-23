// Wohin ein Foto-Credit verlinkt: Instagram-Handle → Profil, Fotografen mit eigener Website → Website,
// German Beach Tour → deren Seite. Klein gehalten, weil auch die Lightbox im Browser es braucht.

export const GBT_URL = 'https://gbt.world/';

/** Credits, die keine Instagram-Handles sind, sondern eine eigene Seite haben */
const webseiten: Record<string, string> = {
	'tombloch.de': 'https://www.tombloch.de/',
	'German Beach Tour': GBT_URL,
};

/** Anzeige: Handles mit @, Websites und Namen ohne */
export function creditText(c: string) {
	return c in webseiten || c.includes(' ') ? c : '@' + c;
}

/** Link zum Credit, oder null (z. B. „Freund:innen“) */
export function creditLink(c: string) {
	if (c in webseiten) return webseiten[c];
	return c.includes(' ') ? null : `https://www.instagram.com/${c}/`;
}
