export function ruhigGewuenscht() {
	return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
