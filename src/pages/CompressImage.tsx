import { useEffect, useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingProgress from '../components/ProcessingProgress';
import ResultCard from '../components/ResultCard';
import ErrorMessage from '../components/ErrorMessage';
import ToolPageLayout from '../components/ToolPageLayout';
import Icon from '../components/Icon';
import { getToolBySlug } from '../lib/toolsConfig';
import { formatBytes } from '../lib/formatBytes';
import { compressImage, getImageDimensions, type ImageDimensions } from '../lib/tools/imageCompress';
import { analytics } from '../lib/analytics';
import type { ProcessingStatus } from '../types';

const tool = getToolBySlug('compress-image')!;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleFileSelected(files: File[]) {
    const f = files[0];
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    try {
      const dims = await getImageDimensions(f);
      setDimensions(dims);
      setFile(f);
      setError('');
      setResult(null);
      setStatus('idle');
      analytics.fileSelected(tool.slug, f.type, f.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read this image.');
    }
  }

  async function handleCompress() {
    if (!file) return;
    setStatus('processing');
    setError('');
    analytics.processingStarted(tool.slug);
    try {
      const blob = await compressImage(file, quality);
      setResult(blob);
      setStatus('success');
      analytics.processingCompleted(tool.slug, file.size, blob.size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while compressing this image.';
      setError(message);
      setStatus('error');
      analytics.processingFailed(tool.slug, message);
    }
  }

  function handleReset() {
    setFile(null);
    setDimensions(null);
    setResult(null);
    setStatus('idle');
    setError('');
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-5">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {status === 'processing' && <ProcessingProgress label="Compressing your image…" />}

        {status === 'success' && result && file && (
          <ResultCard
            originalSize={file.size}
            resultSize={result.size}
            fileName={file.name.replace(/\.\w+$/, (ext) => `-compressed${ext}`)}
            toolSlug={tool.slug}
            blob={result}
            onReset={handleReset}
          />
        )}

        {status !== 'processing' && status !== 'success' && (
          <>
            {!file ? (
              <FileUploader accept={ACCEPTED_TYPES} label="Upload an image" hint="JPG, PNG, or WebP" onFilesSelected={handleFileSelected} />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center gap-4">
                  {previewUrl && (
                    <img src={previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatBytes(file.size)}
                      {dimensions && ` · ${dimensions.width}×${dimensions.height}px`}
                    </p>
                  </div>
                  <button type="button" onClick={handleReset} aria-label="Remove file" className="shrink-0 text-slate-400 hover:text-red-500">
                    <Icon name="trash" className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-5">
                  <label htmlFor="quality" className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Quality</span>
                    <span className="text-slate-500">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    id="quality"
                    type="range"
                    min={0.1}
                    max={0.95}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>Smaller file</span>
                    <span>Higher quality</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompress}
                  className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Compress image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
