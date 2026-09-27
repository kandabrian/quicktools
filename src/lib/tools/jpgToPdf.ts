import { bytesToBlob } from '../toBlob';

export type PageOrientation = 'portrait' | 'landscape' | 'auto';

const A4 = { width: 595.28, height: 841.89 }; // points, portrait

// pdf-lib can only embed JPG and PNG directly. WebP is decoded via canvas
// and re-encoded as PNG before embedding.
async function toPngBytes(file: File): Promise<ArrayBuffer> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not decode this image.'));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create a canvas context.');
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    return await (await fetch(dataUrl)).arrayBuffer();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fitInPage(imgW: number, imgH: number, pageW: number, pageH: number) {
  const margin = 24;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const scale = Math.min(maxW / imgW, maxH / imgH, 1);
  const w = imgW * scale;
  const h = imgH * scale;
  return { x: (pageW - w) / 2, y: (pageH - h) / 2, w, h };
}

export async function imagesToPdf(files: File[], orientation: PageOrientation, onProgress?: (fraction: number) => void): Promise<Blob> {
  if (files.length === 0) throw new Error('Add at least one image to convert.');

  const { PDFDocument } = await import('pdf-lib');
  const outDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();

    let embedded;
    try {
      if (/webp/i.test(file.type)) {
        const pngBytes = await toPngBytes(file);
        embedded = await outDoc.embedPng(pngBytes);
      } else if (/png/i.test(file.type)) {
        embedded = await outDoc.embedPng(bytes);
      } else {
        embedded = await outDoc.embedJpg(bytes);
      }
    } catch {
      throw new Error(`"${file.name}" is not a supported image (use JPG, PNG, or WebP).`);
    }

    let pageOrientation: PageOrientation = orientation;
    if (orientation === 'auto') {
      pageOrientation = embedded.width > embedded.height ? 'landscape' : 'portrait';
    }

    const pageW = pageOrientation === 'landscape' ? A4.height : A4.width;
    const pageH = pageOrientation === 'landscape' ? A4.width : A4.height;

    const page = outDoc.addPage([pageW, pageH]);
    const { x, y, w, h } = fitInPage(embedded.width, embedded.height, pageW, pageH);
    page.drawImage(embedded, { x, y, width: w, height: h });

    onProgress?.((i + 1) / files.length);
  }

  const outBytes = await outDoc.save();
  return bytesToBlob(outBytes, 'application/pdf');
}
