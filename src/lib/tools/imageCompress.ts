export interface ImageDimensions {
  width: number;
  height: number;
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this image. It may be corrupted or in an unsupported format.'));
    };
    img.src = url;
  });
}

/**
 * Compresses an image client-side. `quality` is 0–1, mapped to the
 * underlying library's target-size/quality controls.
 */
export async function compressImage(file: File, quality: number, onProgress?: (fraction: number) => void): Promise<Blob> {
  const { default: imageCompression } = await import('browser-image-compression');

  const options = {
    initialQuality: quality,
    maxSizeMB: 20,
    useWebWorker: true,
    onProgress: (p: number) => onProgress?.(p / 100),
    // Preserve the original format rather than forcing everything to JPEG.
    fileType: file.type || undefined,
  };

  try {
    return await imageCompression(file, options);
  } catch {
    throw new Error('This image could not be compressed. It may be corrupted or an unsupported format.');
  }
}
