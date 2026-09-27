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

// TODO: replace with your real production domain before deploying.
export const SITE_URL = 'https://quicktools-peach.vercel.app';

export const SITE_NAME = 'QuickTools';

// 1200x630 recommended. Drop a real file at public/og-image.png (or change
// this path) — without it, social share cards will show no image.
export const OG_IMAGE_PATH = '/og-image.png';
