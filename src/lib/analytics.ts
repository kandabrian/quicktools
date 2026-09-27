import type { AnalyticsEvent } from '../types';

// Analytics via Plausible (https://plausible.io) — cookie-free and GDPR
// compliant by default, which fits a "no account, nothing tracked you
// didn't agree to" privacy-first product better than Google Analytics.
//
// The loader script itself is only injected on prerendered production
// pages (see scripts/prerender.mjs), keyed off the same SITE_URL used
// everywhere else. It's intentionally absent in local dev, so `dispatch`
// below no-ops safely whenever `window.plausible` isn't present.
//
// To switch providers later, this is the only function that needs to
// change — every call site below (analytics.toolOpened, etc.) stays the
// same either way.
interface EventPayload {
  tool?: string;
  fileType?: string;
  fileSizeBytes?: number;
  resultSizeBytes?: number;
  errorMessage?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

function dispatch(event: AnalyticsEvent, payload: EventPayload = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload);
    return;
  }

  window.plausible?.(event, { props: payload });
}

export const analytics = {
  toolOpened: (tool: string) => dispatch('tool_opened', { tool }),
  fileSelected: (tool: string, fileType: string, fileSizeBytes: number) =>
    dispatch('file_selected', { tool, fileType, fileSizeBytes }),
  processingStarted: (tool: string) => dispatch('processing_started', { tool }),
  processingCompleted: (tool: string, fileSizeBytes: number, resultSizeBytes: number) =>
    dispatch('processing_completed', { tool, fileSizeBytes, resultSizeBytes }),
  processingFailed: (tool: string, errorMessage: string) =>
    dispatch('processing_failed', { tool, errorMessage }),
  downloadClicked: (tool: string) => dispatch('download_clicked', { tool }),

  // Fired on every client-side route change (see PageViewTracker in
  // App.tsx). The very first pageview per full page load is already
  // counted automatically by Plausible's script, so this only needs to
  // fire on subsequent in-app navigations.
  pageview: () => window.plausible?.('pageview'),
};