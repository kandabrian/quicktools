// Central type definitions shared across the app.

export type ToolCategory = 'pdf' | 'image';

export interface ToolMeta {
  slug: string; // route path, e.g. "compress-pdf"
  name: string; // display name, e.g. "PDF Compressor"
  shortDescription: string; // used on cards + meta description
  longDescription: string; // used as intro paragraph on the tool page
  category: ToolCategory;
  icon: string; // key into the Icon component
  keywords: string[]; // for search matching
  popular?: boolean;
  faqs: { question: string; answer: string }[];
  status: 'live' | 'coming-soon';
}

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

export interface ProcessedFileResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  resultSize: number;
}

// Analytics event names we conceptually track (see lib/analytics.ts).
export type AnalyticsEvent =
  | 'tool_opened'
  | 'file_selected'
  | 'processing_started'
  | 'processing_completed'
  | 'processing_failed'
  | 'download_clicked';
