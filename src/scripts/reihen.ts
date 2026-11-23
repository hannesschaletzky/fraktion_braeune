// Handy: In jeder seitlich scrollenden Fotoreihe soll rechts sichtbar ein Stück vom nächsten Foto hervorschauen,
// damit man merkt, dass es weitergeht. Endet ein Foto zufällig genau am Bildschirmrand, wird die Reihe etwas
// niedriger (und damit schmaler) gemacht, bis rechts mindestens 28px vom nächsten Foto zu sehen sind.
const handy = matchMedia('(max-width: 759px)');
const MIN = 28;

function pruefen(reihe: HTMLElement) {
	reihe.style.removeProperty('--knapp');
	if (!handy.matches || reihe.scrollWidth <= reihe.clientWidth + 4) return;
	const kinder = [...reihe.children] as HTMLElement[];
	for (const faktor of [1, 0.9, 0.82, 0.75]) {
		if (faktor < 1) reihe.style.setProperty('--knapp', String(faktor));
		const rand = reihe.getBoundingClientRect().right;
		// irgendein Foto ragt über den rechten Rand, und davon sind mindestens MIN px zu sehen?
		if (kinder.some((k) => { const r = k.getBoundingClientRect(); return r.left < rand - MIN && r.right > rand + 2; })) return;
	}
}

export function fotoreihenPruefen() {
	const reihen = [...document.querySelectorAll<HTMLElement>('.weitere')].filter((r) => r.querySelector('.foto.klein'));
	const alle = () => reihen.forEach(pruefen);
	alle();
	let wartet = 0;
	addEventListener('resize', () => {
		clearTimeout(wartet);
		wartet = window.setTimeout(alle, 150);
	});
}

/** Überschriften „Jahr | Monat | Ort“: bricht der Ort in die nächste Zeile, den Strich am Zeilenende ausblenden */
export function ortUmbruchPruefen() {
	const koepfe = [...document.querySelectorAll<HTMLElement>('[data-eintrag] .wann')];
	const alle = () => {
		for (const w of koepfe) {
			const datum = w.querySelector<HTMLElement>('.datum');
			const ort = w.querySelector<HTMLElement>('.ort');
			if (!datum || !ort) continue;
			w.classList.remove('umbruch');
			w.classList.toggle('umbruch', ort.offsetTop > datum.offsetTop + 4);
		}
	};
	alle();
	document.fonts?.ready.then(alle);
	let wartet = 0;
	addEventListener('resize', () => {
		clearTimeout(wartet);
		wartet = window.setTimeout(alle, 150);
	});
}
