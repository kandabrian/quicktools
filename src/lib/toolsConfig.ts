import type { ToolMeta } from '../types';
import { TOOLS as TOOLS_DATA } from './tools.data.mjs';

// Data itself lives in tools.data.mjs (plain JS) so Node build scripts
// (generate-sitemap.mjs, prerender.mjs) can import the exact same list
// without a TypeScript build step. This file just adds the TS type on top
// and keeps the existing helper API unchanged.
export const TOOLS: ToolMeta[] = TOOLS_DATA as ToolMeta[];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getRelatedTools(currentSlug: string, limit = 3): ToolMeta[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return TOOLS.slice(0, limit);
  return TOOLS.filter((t) => t.slug !== currentSlug && t.category === current.category).slice(0, limit);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
