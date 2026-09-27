import { bytesToBlob } from '../toBlob';

export type CompressionLevel = 'low' | 'medium' | 'high';

const QUALITY_BY_LEVEL: Record<CompressionLevel, number> = {
  low: 0.8,
  medium: 0.6,
  high: 0.35,
};

const SCALE_BY_LEVEL: Record<CompressionLevel, number> = {
  low: 1.5,
  medium: 1.1,
  high: 0.85,
};

/**
 * Compresses a PDF by re-rendering each page to a JPEG at a reduced scale/
 * quality and rebuilding a new PDF from those images. This trades vector/text
 * crispness for file size, which is the standard approach for client-side PDF
 * compression without a native codec. Text-only PDFs with no images may not
 * shrink much, or can even grow slightly, since rasterizing text is not
 * always smaller than the original vector text streams — callers should
 * expect and communicate that.
 */
export async function compressPdf(file: File, level: CompressionLevel, onProgress?: (fraction: number) => void): Promise<Blob> {
  const [{ PDFDocument }, pdfjsLib] = await Promise.all([import('pdf-lib'), import('pdfjs-dist')]);

  // Configure the worker for pdfjs-dist (Vite-friendly worker URL).
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const arrayBuffer = await file.arrayBuffer();
  const sourceDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const outDoc = await PDFDocument.create();

  const quality = QUALITY_BY_LEVEL[level];
  const scale = SCALE_BY_LEVEL[level];

  for (let pageNum = 1; pageNum <= sourceDoc.numPages; pageNum++) {
    const page = await sourceDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create a canvas context for rendering.');

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegBytes = await (await fetch(jpegDataUrl)).arrayBuffer();
    const jpegImage = await outDoc.embedJpg(jpegBytes);

    const outPage = outDoc.addPage([canvas.width, canvas.height]);
    outPage.drawImage(jpegImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });

    onProgress?.(pageNum / sourceDoc.numPages);

    // Free canvas memory promptly on large documents.
    canvas.width = 0;
    canvas.height = 0;
  }

  const outBytes = await outDoc.save();
  return bytesToBlob(outBytes, 'application/pdf');
}
