import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingProgress from '../components/ProcessingProgress';
import ErrorMessage from '../components/ErrorMessage';
import ToolPageLayout from '../components/ToolPageLayout';
import DownloadButton from '../components/DownloadButton';
import Icon from '../components/Icon';
import { getToolBySlug } from '../lib/toolsConfig';
import { formatBytes } from '../lib/formatBytes';
import { imagesToPdf, type PageOrientation } from '../lib/tools/jpgToPdf';
import { analytics } from '../lib/analytics';
import type { ProcessingStatus } from '../types';

const tool = getToolBySlug('jpg-to-pdf')!;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<PageOrientation>('auto');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Blob | null>(null);

  function handleFilesSelected(newFiles: File[]) {
    const images = newFiles.filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
    if (images.length !== newFiles.length) {
      setError('Only JPG, PNG, and WebP images are supported — other files were skipped.');
    } else {
      setError('');
    }
    images.forEach((f) => analytics.fileSelected(tool.slug, f.type, f.size));
    setFiles((prev) => [...prev, ...images]);
    setResult(null);
    setStatus('idle');
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConvert() {
    setStatus('processing');
    setError('');
    analytics.processingStarted(tool.slug);
    try {
      const blob = await imagesToPdf(files, orientation);
      setResult(blob);
      setStatus('success');
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      analytics.processingCompleted(tool.slug, totalSize, blob.size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while converting these images.';
      setError(message);
      setStatus('error');
      analytics.processingFailed(tool.slug, message);
    }
  }

  function handleReset() {
    setFiles([]);
    setResult(null);
    setStatus('idle');
    setError('');
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-5">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {status === 'processing' && <ProcessingProgress label="Converting your images…" />}

        {status === 'success' && result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Done!</p>
                <p className="text-sm text-slate-500">Your PDF is ready to download.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DownloadButton blob={result} fileName="converted.pdf" toolSlug={tool.slug} />
              <button type="button" onClick={handleReset} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Convert more images
              </button>
            </div>
          </div>
        )}

        {status !== 'processing' && status !== 'success' && (
          <>
            <FileUploader
              accept={ACCEPTED_TYPES}
              multiple
              label="Upload images"
              hint="JPG, PNG, or WebP — select one or more"
              onFilesSelected={handleFilesSelected}
            />

            {files.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <ul className="mb-4 divide-y divide-slate-100">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center gap-3 py-2.5">
                      <span className="w-5 shrink-0 text-center text-xs font-medium text-slate-400">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{f.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => moveFile(i, -1)}
                          aria-label={`Move ${f.name} up`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={i === files.length - 1}
                          onClick={() => moveFile(i, 1)}
                          aria-label={`Move ${f.name} down`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          aria-label={`Remove ${f.name}`}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <fieldset className="mb-4">
                  <legend className="mb-2 text-sm font-medium text-slate-700">Page orientation</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'auto', label: 'Auto' },
                        { id: 'portrait', label: 'Portrait' },
                        { id: 'landscape', label: 'Landscape' },
                      ] as { id: PageOrientation; label: string }[]
                    ).map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setOrientation(o.id)}
                        aria-pressed={orientation === o.id}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          orientation === o.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="button"
                  onClick={handleConvert}
                  className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Convert to PDF
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
