// Generates public/sitemap.xml from the shared tools data + a small static
// list of non-tool routes. Tool routes are derived from tools.data.mjs, so
// adding a tool there is enough for it to appear here too — nothing to keep
// in sync by hand anymore.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { SITE_URL } from '../site.config.mjs';
import { TOOLS } from '../src/lib/tools.data.mjs';

const STATIC_ROUTES = ['/', '/about', '/privacy', '/terms', '/contact'];
const ROUTES = [...STATIC_ROUTES, ...TOOLS.filter((t) => t.status === 'live').map((t) => `/${t.slug}`)];

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../public/sitemap.xml');

const urls = ROUTES.map(
  (route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`,
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(outPath, xml);
console.log(`Wrote ${ROUTES.length} URLs to ${outPath}`);
