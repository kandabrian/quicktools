// Generates public/robots.txt from the shared SITE_URL constant, so the
// sitemap URL in robots.txt can never drift out of sync with the domain
// used everywhere else (site.config.mjs).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { SITE_URL } from '../site.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../public/robots.txt');

const contents = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

writeFileSync(outPath, contents);
console.log(`Wrote ${outPath}`);
