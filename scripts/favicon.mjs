// Favicon „FB“: F hell, B gelb in der Überschriften-Schrift Anton auf dunklem, abgerundetem Quadrat.
// Gerendert im Browser (Playwright), damit Anton als Webfont sicher greift; daraus die Größen mit sharp.
// Aufruf: node scripts/favicon.mjs   (braucht Playwright, z. B. npx playwright, und einen Chromium-Browser)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const playwright = process.env.PLAYWRIGHT ?? 'playwright';
const browser = process.env.BROWSER_PFAD; // z. B. '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
const { chromium } = await import(playwright);

const anton = fs.readFileSync('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2').toString('base64');
const N = 512;
const html = `<!doctype html><style>
@font-face { font-family: Anton; src: url(data:font/woff2;base64,${anton}) format('woff2'); }
html, body { margin: 0; background: transparent; }
.icon { width: ${N}px; height: ${N}px; border-radius: 108px; background: #1a1218; display: flex; align-items: center; justify-content: center;
  font-family: Anton; font-size: 360px; line-height: 1; letter-spacing: -4px; padding-top: 18px; box-sizing: border-box; }
.f { color: #f8f2e7; } .b { color: #ffd23f; }
</style><div class="icon"><span class="f">F</span><span class="b">B</span></div>`;

const b = await chromium.launch(browser ? { executablePath: browser } : {});
const p = await b.newPage({ viewport: { width: N, height: N } });
await p.setContent(html);
await p.evaluate(() => document.fonts.ready);
const png = await p.locator('.icon').screenshot({ omitBackground: true });
await b.close();

const ziel = 'public';
await sharp(png).resize(512, 512).png().toFile(path.join(ziel, 'icon-512.png'));
await sharp(png).resize(192, 192).png().toFile(path.join(ziel, 'icon-192.png'));
await sharp(png).resize(32, 32).png().toFile(path.join(ziel, 'favicon-32.png'));
// Apple-Icon ohne Transparenz (iOS rundet selbst ab)
await sharp(png).resize(180, 180).flatten({ background: '#1a1218' }).png().toFile(path.join(ziel, 'apple-touch-icon.png'));
// favicon.ico: 48-px-PNG in einer ICO-Hülle, für ältere Browser
const ico = await sharp(png).resize(48, 48).png().toBuffer();
const kopf = Buffer.alloc(22);
kopf.writeUInt16LE(0, 0);
kopf.writeUInt16LE(1, 2);
kopf.writeUInt16LE(1, 4);
kopf[6] = 48;
kopf[7] = 48;
kopf.writeUInt16LE(1, 10);
kopf.writeUInt16LE(32, 12);
kopf.writeUInt32LE(ico.length, 14);
kopf.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(ziel, 'favicon.ico'), Buffer.concat([kopf, ico]));
console.log('Favicons in public/ erzeugt');
