// Ein ganz normaler Player für alle Videos der Seite (Fernseher und Handys), gleich bedient:
//   ▶ oder Tipp aufs Bild: abspielen bzw. anhalten (mit Ton, an der aktuellen Stelle)
//   🔊/🔇: nur Ton an/aus, ändert nie, ob das Video läuft
//   ⛶: Vollbild
// Kein Autoplay, kein Vorladen: geladen wird erst beim Abspielen, das Vorschaubild erst kurz vor dem Sichtbarwerden.
// Es läuft immer nur ein Video; scrollt ein laufendes Video aus dem Bild, hält es an.

const alle: HTMLVideoElement[] = [];
const vid = (s: HTMLElement) => s.querySelector('video')!;

/** Alle Videos anhalten (außer einem) */
export function alleAnhalten(ausser?: HTMLVideoElement) {
	for (const v of alle) if (v !== ausser && !v.paused) v.pause();
}

/** Vorschaubild erst laden, wenn das Video in die Nähe kommt */
const vorlader = new IntersectionObserver(
	(eintraege, beob) => {
		for (const e of eintraege) {
			if (!e.isIntersecting) continue;
			const v = e.target as HTMLVideoElement;
			if (v.dataset.poster) v.poster = v.dataset.poster;
			beob.unobserve(v);
		}
	},
	{ rootMargin: '800px 0px' },
);

/** Läuft ein Video und ist kaum noch zu sehen, hält es an */
const sichtbar = new IntersectionObserver(
	(eintraege) => {
		for (const e of eintraege) if (!e.isIntersecting && document.fullscreenElement !== e.target) (e.target as HTMLVideoElement).pause();
	},
	{ threshold: 0.2 },
);

/** Ein Abspielgerät verdrahten: Element mit <video>, .schirm, optional .abspielen, .ton und .gross */
export function spieler(s: HTMLElement) {
	const v = vid(s);
	if (alle.includes(v)) return;
	alle.push(v);
	vorlader.observe(v);
	sichtbar.observe(v);

	const ton = s.querySelector<HTMLButtonElement>('.ton');
	const zeigen = () => {
		s.classList.toggle('laeuft', !v.paused);
		if (!ton) return;
		ton.textContent = v.muted ? '🔇' : '🔊';
		ton.setAttribute('aria-pressed', String(!v.muted));
		ton.setAttribute('aria-label', v.muted ? 'Ton an' : 'Ton aus');
	};
	for (const ereignis of ['play', 'pause', 'ended', 'volumechange', 'emptied']) v.addEventListener(ereignis, zeigen);
	v.addEventListener('play', () => alleAnhalten(v));
	zeigen();

	const abspielen = () => v.play().catch(() => {});
	s.querySelector('.schirm')!.addEventListener('click', () => {
		// Im Vollbild schaltet die Steuerung des Browsers selbst Pause/Weiter; nicht zusätzlich umschalten,
		// sonst heben sich beide Klicks auf
		if (document.fullscreenElement === v) return;
		if (v.paused) abspielen();
		else v.pause();
	});
	s.querySelector('.abspielen')?.addEventListener('click', (e) => {
		e.stopPropagation();
		abspielen();
	});
	ton?.addEventListener('click', (e) => {
		e.stopPropagation();
		v.muted = !v.muted;
	});
	s.querySelector('.gross')?.addEventListener('click', (e) => {
		e.stopPropagation();
		merken();
		abspielen();
		const ios = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
		if (v.requestFullscreen) v.requestFullscreen().catch(() => ios.webkitEnterFullscreen?.());
		else ios.webkitEnterFullscreen?.();
	});
	// Im Vollbild die Bedienelemente des Browsers zeigen, danach wieder unsere
	v.addEventListener('fullscreenchange', () => {
		v.controls = document.fullscreenElement === v;
		if (!document.fullscreenElement) zurueck();
	});
	v.addEventListener('webkitendfullscreen', () => {
		v.controls = false;
		zurueck();
	});
}

// Android (Chrome) verliert beim Vollbild oft die Scrollposition: Das Handy dreht sich, die Seite baut sich
// dahinter neu auf und steht danach oben. Deshalb die Position vorher merken und nach dem Schließen wiederherstellen,
// einmal sofort und noch einmal, wenn sich das Layout nach dem Zurückdrehen gesetzt hat.
let gemerkt: number | null = null;
function merken() {
	gemerkt = scrollY;
}
function zurueck() {
	if (gemerkt === null) return;
	const y = gemerkt;
	gemerkt = null;
	const hin = () => {
		if (Math.abs(scrollY - y) > 50) scrollTo({ top: y, behavior: 'instant' });
	};
	requestAnimationFrame(hin);
	setTimeout(hin, 350);
	setTimeout(hin, 800);
}
