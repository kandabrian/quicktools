import { bytesToBlob } from '../toBlob';

export async function mergePdfs(files: File[], onProgress?: (fraction: number) => void): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Add at least two PDF files to merge.');
  }

  const { PDFDocument } = await import('pdf-lib');
  const outDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    let srcDoc;
    try {
      srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch {
      throw new Error(`"${files[i].name}" could not be read. It may be corrupted or password-protected.`);
    }
    const copiedPages = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((p) => outDoc.addPage(p));
    onProgress?.((i + 1) / files.length);
  }

  const outBytes = await outDoc.save();
  return bytesToBlob(outBytes, 'application/pdf');
}
