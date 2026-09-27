import { bytesToBlob } from '../toBlob';

export type SplitMode = 'extract' | 'every-page' | 'ranges';

export interface SplitResult {
  blob: Blob;
  fileName: string;
  isZip: boolean;
}

async function loadSourceDoc(file: File) {
  const { PDFDocument } = await import('pdf-lib');
  const bytes = await file.arrayBuffer();
  try {
    return { PDFDocument, srcDoc: await PDFDocument.load(bytes, { ignoreEncryption: true }) };
  } catch {
    throw new Error(`"${file.name}" could not be read. It may be corrupted or password-protected.`);
  }
}

export async function getPdfPageCount(file: File): Promise<number> {
  const { srcDoc } = await loadSourceDoc(file);
  return srcDoc.getPageCount();
}

// Parses a string like "1-3, 5, 8-9" into a deduped, sorted list of 0-based page indices.
export function parsePageRanges(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) throw new Error('Enter at least one page or page range, e.g. "1-3, 5".');

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end > pageCount || start > end) {
        throw new Error(`Range "${part}" is out of bounds for a ${pageCount}-page document.`);
      }
      for (let p = start; p <= end; p++) indices.add(p - 1);
    } else if (singleMatch) {
      const page = parseInt(singleMatch[1], 10);
      if (page < 1 || page > pageCount) {
        throw new Error(`Page ${page} is out of bounds for a ${pageCount}-page document.`);
      }
      indices.add(page - 1);
    } else {
      throw new Error(`"${part}" is not a valid page or range.`);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

async function buildSinglePdf(PDFDocumentCtor: typeof import('pdf-lib').PDFDocument, srcDoc: import('pdf-lib').PDFDocument, pageIndices: number[]) {
  const outDoc = await PDFDocumentCtor.create();
  const copiedPages = await outDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((p) => outDoc.addPage(p));
  return outDoc.save();
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  options: { pageIndices?: number[] } = {},
  onProgress?: (fraction: number) => void,
): Promise<SplitResult> {
  const { PDFDocument, srcDoc } = await loadSourceDoc(file);
  const baseName = file.name.replace(/\.pdf$/i, '');

  if (mode === 'extract') {
    const pageIndices = options.pageIndices ?? [];
    if (pageIndices.length === 0) throw new Error('Select at least one page to extract.');
    const bytes = await buildSinglePdf(PDFDocument, srcDoc, pageIndices);
    onProgress?.(1);
    return { blob: bytesToBlob(bytes, 'application/pdf'), fileName: `${baseName}-extracted.pdf`, isZip: false };
  }

  if (mode === 'ranges') {
    const pageIndices = options.pageIndices ?? [];
    if (pageIndices.length === 0) throw new Error('Enter at least one valid page range.');
    const bytes = await buildSinglePdf(PDFDocument, srcDoc, pageIndices);
    onProgress?.(1);
    return { blob: bytesToBlob(bytes, 'application/pdf'), fileName: `${baseName}-pages.pdf`, isZip: false };
  }

  // mode === 'every-page': one PDF per page, zipped together.
  const { zipSync } = await import('fflate');
  const pageCount = srcDoc.getPageCount();
  const files: Record<string, Uint8Array> = {};

  for (let i = 0; i < pageCount; i++) {
    const bytes = await buildSinglePdf(PDFDocument, srcDoc, [i]);
    files[`${baseName}-page-${i + 1}.pdf`] = bytes;
    onProgress?.((i + 1) / pageCount);
  }

  const zipped = zipSync(files);
  return { blob: bytesToBlob(zipped, 'application/zip'), fileName: `${baseName}-split.zip`, isZip: true };
}
