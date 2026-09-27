import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingProgress from '../components/ProcessingProgress';
import ResultCard from '../components/ResultCard';
import ErrorMessage from '../components/ErrorMessage';
import ToolPageLayout from '../components/ToolPageLayout';
import Icon from '../components/Icon';
import { getToolBySlug } from '../lib/toolsConfig';
import { formatBytes } from '../lib/formatBytes';
import { mergePdfs } from '../lib/tools/pdfMerge';
import { analytics } from '../lib/analytics';
import type { ProcessingStatus } from '../types';

const tool = getToolBySlug('merge-pdf')!;

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Blob | null>(null);

  function handleFilesSelected(newFiles: File[]) {
    const pdfs = newFiles.filter((f) => f.type === 'application/pdf');
    if (pdfs.length !== newFiles.length) {
      setError('Only PDF files are supported — non-PDF files were skipped.');
    } else {
      setError('');
    }
    pdfs.forEach((f) => analytics.fileSelected(tool.slug, f.type, f.size));
    setFiles((prev) => [...prev, ...pdfs]);
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

  async function handleMerge() {
    setStatus('processing');
    setError('');
    analytics.processingStarted(tool.slug);
    try {
      const blob = await mergePdfs(files);
      setResult(blob);
      setStatus('success');
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      analytics.processingCompleted(tool.slug, totalSize, blob.size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while merging these PDFs.';
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

  const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-5">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {status === 'processing' && <ProcessingProgress label="Merging your PDFs…" />}

        {status === 'success' && result && (
          <ResultCard
            originalSize={totalOriginalSize}
            resultSize={result.size}
            fileName="merged.pdf"
            toolSlug={tool.slug}
            blob={result}
            onReset={handleReset}
            showReduction={false}
          />
        )}

        {status !== 'processing' && status !== 'success' && (
          <>
            <FileUploader
              accept="application/pdf"
              multiple
              label="Upload PDFs"
              hint="Select two or more PDF files"
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
                <button
                  type="button"
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {files.length < 2 ? 'Add at least 2 PDFs to merge' : `Merge ${files.length} PDFs`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
