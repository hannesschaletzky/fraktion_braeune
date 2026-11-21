// Gemeinsame Steuerung für alle Videos der Seite (Fernseher und Handys):
// stumm in der Schleife, solange sichtbar; Tipp aufs Bild hält an; 🔇 spielt einmal mit Ton von vorn
// (immer nur ein Video mit Ton); Vollbild mit Bedienelementen. Vorschaubilder werden erst kurz vorher geladen.
import { ruhigGewuenscht } from './bewegung';

const ruhig = ruhigGewuenscht();
const alle: HTMLElement[] = [];
const sichtbar = new WeakSet<HTMLVideoElement>();
// Von Hand angehaltene Videos laufen nicht von selbst wieder los
const angehalten = new WeakSet<HTMLVideoElement>();

const vid = (s: HTMLElement) => s.querySelector('video')!;

function anzeigen(s: HTMLElement, an: boolean) {
	s.classList.toggle('an', an);
	const b = s.querySelector('.ton');
	if (!b) return;
	b.textContent = an ? '🔊' : '🔇';
	b.setAttribute('aria-pressed', String(an));
}

function weiter(s: HTMLElement) {
	angehalten.delete(vid(s));
	s.classList.remove('pause');
}

/** Alle stumm schalten (außer einem) und zurück in die stumme Schleife */
export function tonAus(ausser?: HTMLElement) {
	for (const s of alle) {
		if (s === ausser) continue;
		const v = vid(s);
		// ended zuerst lesen: mit loop = true meldet der Browser nie "ended"
		const warZuEnde = v.ended;
		v.muted = true;
		v.loop = true;
		v.controls = false;
		if (ruhig || !sichtbar.has(v)) v.pause();
		else if (warZuEnde && !angehalten.has(v)) v.play().catch(() => {});
		anzeigen(s, false);
	}
}

/** Mit Ton einmal von vorn abspielen */
export function mitTon(s: HTMLElement) {
	const v = vid(s);
	weiter(s);
	tonAus(s);
	v.muted = false;
	// Mit Ton nur einmal durch: in der Schleife setzt der Kommentar mitten im Satz neu ein
	v.loop = false;
	anzeigen(s, true);
	v.currentTime = 0;
	v.play().catch(() => {});
}

const beobachter = new IntersectionObserver(
	(eintraege) => {
		for (const e of eintraege) {
			const v = e.target as HTMLVideoElement;
			if (e.isIntersecting) {
				sichtbar.add(v);
				if (!angehalten.has(v) && (!ruhig || !v.muted)) v.play().catch(() => {});
			} else {
				sichtbar.delete(v);
				v.pause();
			}
		}
	},
	{ threshold: 0.4 },
);

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

/** Neue Quelle (Senderwechsel beim Fernseher) */
export function quelle(s: HTMLElement, src: string, poster: string) {
	const v = vid(s);
	weiter(s);
	v.src = src;
	v.poster = poster;
	if (sichtbar.has(v) && !ruhig) v.play().catch(() => {});
}

/** Ein Abspielgerät verdrahten: Element mit <video>, .schirm, optional .ton und .gross */
export function spieler(s: HTMLElement) {
	if (alle.includes(s)) return;
	alle.push(s);
	const v = vid(s);
	beobachter.observe(v);
	vorlader.observe(v);

	s.querySelector('.ton')?.addEventListener('click', (e) => {
		e.stopPropagation();
		if (v.muted) mitTon(s);
		else tonAus();
	});

	s.querySelector('.gross')?.addEventListener('click', (e) => {
		e.stopPropagation();
		if (s.querySelector('.ton')) mitTon(s);
		else {
			weiter(s);
			v.currentTime = 0;
			v.play().catch(() => {});
		}
		v.controls = true;
		const ios = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
		if (v.requestFullscreen) v.requestFullscreen().catch(() => ios.webkitEnterFullscreen?.());
		else ios.webkitEnterFullscreen?.();
	});

	const vollbildEnde = () => {
		if (document.fullscreenElement === v) return;
		v.controls = false;
		if (!v.muted) tonAus();
	};
	v.addEventListener('fullscreenchange', vollbildEnde);
	v.addEventListener('webkitendfullscreen', vollbildEnde);

	// Mit Ton durch: im Vollbild am Ende stehen lassen, sonst stumm in die Schleife zurück
	v.addEventListener('ended', () => {
		if (document.fullscreenElement === v) return;
		tonAus();
	});

	s.querySelector('.schirm')!.addEventListener('click', () => {
		if (v.paused) {
			weiter(s);
			v.play().catch(() => {});
		} else {
			angehalten.add(v);
			s.classList.add('pause');
			v.pause();
		}
	});
}
