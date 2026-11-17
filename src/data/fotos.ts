import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import credits from '../assets/fotos/credits.json';

const dateien = import.meta.glob<{ default: ImageMetadata }>('../assets/fotos/*.jpg', { eager: true });

export interface Foto {
	bild: ImageMetadata;
	/** Nur für Screenreader, wird nicht angezeigt */
	alt: string;
	credit: string | null;
}

/** Foto aus src/assets/fotos/ (erzeugt von scripts/fotos.mjs) */
export function foto(name: string, alt: string): Foto {
	const datei = dateien[`../assets/fotos/${name}.jpg`];
	if (!datei) throw new Error(`Foto fehlt: ${name} (node scripts/fotos.mjs ausführen)`);
	return { bild: datei.default, alt, credit: (credits as Record<string, string | null>)[name] ?? null };
}

/** URL der großen Fassung für die Lightbox */
export async function grossUrl(f: Foto) {
	return (await getImage({ src: f.bild, width: 1800, format: 'webp' })).src;
}
