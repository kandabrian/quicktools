import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingProgress from '../components/ProcessingProgress';
import ResultCard from '../components/ResultCard';
import ErrorMessage from '../components/ErrorMessage';
import ToolPageLayout from '../components/ToolPageLayout';
import Icon from '../components/Icon';
import { getToolBySlug } from '../lib/toolsConfig';
import { formatBytes } from '../lib/formatBytes';
import { compressPdf, type CompressionLevel } from '../lib/tools/pdfCompress';
import { analytics } from '../lib/analytics';
import type { ProcessingStatus } from '../types';

const tool = getToolBySlug('compress-pdf')!;
const LEVELS: { id: CompressionLevel; label: string; description: string }[] = [
  { id: 'low', label: 'Low', description: 'Best quality, smallest reduction' },
  { id: 'medium', label: 'Medium', description: 'Balanced quality and size' },
  { id: 'high', label: 'High', description: 'Smallest file, lower quality' },
];

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Blob | null>(null);

  function handleFileSelected(files: File[]) {
    const f = files[0];
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    setFile(f);
    setError('');
    setStatus('idle');
    setResult(null);
    analytics.fileSelected(tool.slug, f.type, f.size);
  }

  async function handleCompress() {
    if (!file) return;
    setStatus('processing');
    setError('');
    analytics.processingStarted(tool.slug);
    try {
      const blob = await compressPdf(file, level);
      setResult(blob);
      setStatus('success');
      analytics.processingCompleted(tool.slug, file.size, blob.size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while compressing this PDF.';
      setError(message);
      setStatus('error');
      analytics.processingFailed(tool.slug, message);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setStatus('idle');
    setError('');
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-5">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {status === 'processing' && <ProcessingProgress label="Compressing your PDF…" />}

        {status === 'success' && result && file && (
          <ResultCard
            originalSize={file.size}
            resultSize={result.size}
            fileName={file.name.replace(/\.pdf$/i, '-compressed.pdf')}
            toolSlug={tool.slug}
            blob={result}
            onReset={handleReset}
          />
        )}

        {status !== 'processing' && status !== 'success' && (
          <>
            {!file ? (
              <FileUploader accept="application/pdf" label="Upload a PDF" hint="PDF files only" onFilesSelected={handleFileSelected} />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                  <button type="button" onClick={handleReset} aria-label="Remove file" className="shrink-0 text-slate-400 hover:text-red-500">
                    <Icon name="trash" className="h-5 w-5" />
                  </button>
                </div>

                <fieldset className="mb-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">Compression level</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLevel(l.id)}
                        aria-pressed={level === l.id}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          level === l.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-semibold">{l.label}</span>
                        <span className="block text-xs opacity-80">{l.description}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="button"
                  onClick={handleCompress}
                  className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Compress PDF
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
