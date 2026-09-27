import { useEffect } from 'react';
import { SITE_URL, SITE_NAME, OG_IMAGE_PATH } from '../../site.config.mjs';

interface SeoOptions {
  title: string;
  description: string;
  path: string; // e.g. "/compress-pdf" - used to build canonical + OG url
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// This still updates tags client-side on route change (needed for SPA
// navigation, e.g. clicking between tool pages without a full reload).
// The *initial* HTML for each route now also ships pre-rendered, real
// <head> tags — see scripts/prerender.mjs, which runs after `vite build`
// and writes a static dist/<route>/index.html per page. That's what search
// engines and social-media crawlers see on first load; this hook just keeps
// things in sync afterwards and needs no changes for that to work.
export function useSeo({ title, description, path }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const image = `${SITE_URL}${OG_IMAGE_PATH}`;

    document.title = fullTitle;
    setMetaTag('name', 'description', description);
    setCanonical(url);

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', image);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [title, description, path]);
}
