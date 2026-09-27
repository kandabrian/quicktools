// Single source of truth for site-wide constants.
//
// Used by:
//   - src/hooks/useSeo.ts        (client-side <head> updates on route change)
//   - scripts/generate-sitemap.mjs
//   - scripts/generate-robots.mjs
//   - scripts/prerender.mjs      (static <head> + JSON-LD injected at build time)
//
// Plain .mjs (not .ts) so Node scripts can import it directly with zero
// build step, and Vite/TS can import it from the browser bundle unchanged.

export const SITE_URL = 'https://quicktools-peach.vercel.app';

export const SITE_NAME = 'QuickTools';

// 1200x630 recommended. Drop a real file at public/og-image.png (or change
// this path) — without it, social share cards will show no image.
export const OG_IMAGE_PATH = '/og-image.png';

// Plausible's snippet (Site Settings → General → Site Installation) now
// ties site identity to this unique per-site script URL rather than a
// data-domain attribute — copy it exactly from your dashboard.
export const PLAUSIBLE_SCRIPT_URL = 'https://plausible.io/js/pa-g1yvaUGuXwFe0G2aQ6bj9.js';