// Runs after `vite build`. The app is a client-rendered SPA (useSeo sets
// <head> tags via useEffect), which works fine for Google but NOT for
// crawlers that don't execute JS — Twitter/Facebook/LinkedIn/Slack link
// previews, mainly. This script fixes that without a full SSR framework:
// for every known route it clones dist/index.html, swaps in the real
// title/description/canonical/OG/Twitter tags plus JSON-LD structured
// data, and writes it to dist/<route>/index.html. The app's own JS still
// loads and hydrates normally — this only changes what's in the initial
// HTML response, which is what bots see.
//
// Vercel (see vercel.json) serves a matching static file before falling
// back to its SPA rewrite, so /compress-pdf resolves to
// dist/compress-pdf/index.html automatically. Any route not listed here
// (e.g. a 404) still falls through to the client-rendered index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { SITE_URL, SITE_NAME, OG_IMAGE_PATH } from '../site.config.mjs';
import { TOOLS } from '../src/lib/tools.data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

// Plausible (https://plausible.io) — cookie-free analytics, proxied
// through this site's own domain (see vercel.json rewrites for
// /js/script.js and /api/event) rather than loaded straight from
// plausible.io. This is Plausible's own documented fix for ad blockers:
// many filter lists block the plausible.io domain by name, but a same-
// origin request is invisible to them. Only injected into the production
// prerendered build, so local dev never sends events (analytics.ts no-ops
// in dev for the same reason).
//
// If you ever change the proxy path in vercel.json, update it here too.
const analyticsScript = `    <script async src="/js/script.js"></script>
    <script>
      window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
      plausible.init()
    </script>`;

// Static (non-tool) pages — keep these in sync with each page's useSeo()
// call in src/pages/*.tsx.
const STATIC_PAGES = [
  {
    path: '/',
    title: 'Free Online PDF & Image Tools',
    description:
      'Compress, merge, split PDFs and compress images for free, right in your browser. No account needed, no file uploads to a server.',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'QuickTools is a free, privacy-first toolbox for everyday PDF and image tasks — no account required.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'How QuickTools handles your files and data. Browser-based tools process files locally on your device.',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description: 'Terms of service for using QuickTools free online PDF and image tools.',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch with the QuickTools team with questions, feedback, or bug reports.',
  },
];

const TOOL_PAGES = TOOLS.filter((t) => t.status === 'live').map((t) => ({
  path: `/${t.slug}`,
  title: t.name,
  description: t.shortDescription,
  tool: t,
}));

const PAGES = [...STATIC_PAGES, ...TOOL_PAGES];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJsonLd(page) {
  const blocks = [];

  if (page.tool) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: page.tool.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (runs in browser)',
      description: page.tool.longDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: `${SITE_URL}${page.path}`,
    });

    if (page.tool.faqs?.length) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }
  }

  return blocks
    .map((block) => `    <script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n');
}

function renderPage(page) {
  const fullTitle = page.path === '/' ? `${SITE_NAME} — Simple tools. Done in seconds.` : `${page.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${page.path}`;
  const image = `${SITE_URL}${OG_IMAGE_PATH}`;
  const description = escapeHtml(page.description);

  const headTags = `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />

    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:image" content="${image}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
${buildJsonLd(page)}
${analyticsScript}
  </head>`;

  let html = template
    // Drop the generic tags baked into the built index.html (title +
    // description) so they aren't duplicated alongside the real ones above.
    .replace(/\s*<title>.*?<\/title>/s, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/s, '')
    .replace('</head>', headTags);

  return html;
}

for (const page of PAGES) {
  const html = renderPage(page);
  const outDir = page.path === '/' ? distDir : resolve(distDir, page.path.replace(/^\//, ''));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
}

console.log(`Pre-rendered ${PAGES.length} routes with static <head> tags + JSON-LD.`);