// Konfetti-Kanone über die ganze Seite. Ein Canvas, das sich nach der Salve wieder abschaltet.
const FARBEN = ['#ff2e4d', '#ff7a1a', '#ffd23f', '#2fd47a', '#3a8bff', '#a55bff', '#f8f2e7'];

interface Teil {
	x: number;
	y: number;
	vx: number;
	vy: number;
	w: number;
	h: number;
	r: number;
	vr: number;
	farbe: string;
	leben: number;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let teile: Teil[] = [];
let laeuft = false;

export function ruhigGewuenscht() {
	return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function konfetti(menge = 180) {
	if (ruhigGewuenscht()) return;
	if (!canvas) {
		canvas = document.createElement('canvas');
		canvas.setAttribute('aria-hidden', 'true');
		Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '60' });
		document.body.append(canvas);
		ctx = canvas.getContext('2d');
	}
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	for (let i = 0; i < menge; i++) {
		const links = i % 2 === 0;
		teile.push({
			x: links ? 0 : innerWidth,
			y: innerHeight * 0.85,
			vx: (links ? 1 : -1) * (4 + Math.random() * 9),
			vy: -(10 + Math.random() * 12),
			w: 6 + Math.random() * 6,
			h: 10 + Math.random() * 8,
			r: Math.random() * Math.PI,
			vr: (Math.random() - 0.5) * 0.3,
			farbe: FARBEN[(Math.random() * FARBEN.length) | 0],
			leben: 200 + Math.random() * 80,
		});
	}
	if (!laeuft) {
		laeuft = true;
		requestAnimationFrame(schritt);
	}
}

function schritt() {
	if (!ctx || !canvas) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	teile = teile.filter((t) => t.leben > 0 && t.y < canvas!.height + 40);
	for (const t of teile) {
		t.vy += 0.32;
		t.vx *= 0.985;
		t.vy *= 0.985;
		t.x += t.vx;
		t.y += t.vy;
		t.r += t.vr;
		t.leben--;
		ctx.save();
		ctx.translate(t.x, t.y);
		ctx.rotate(t.r);
		ctx.scale(1, Math.cos(t.r * 2));
		ctx.fillStyle = t.farbe;
		ctx.fillRect(-t.w / 2, -t.h / 2, t.w, t.h);
		ctx.restore();
	}
	if (teile.length) requestAnimationFrame(schritt);
	else {
		laeuft = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}
