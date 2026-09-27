import { useEffect, useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingProgress from '../components/ProcessingProgress';
import ErrorMessage from '../components/ErrorMessage';
import ToolPageLayout from '../components/ToolPageLayout';
import DownloadButton from '../components/DownloadButton';
import Icon from '../components/Icon';
import { getToolBySlug } from '../lib/toolsConfig';
import { formatBytes } from '../lib/formatBytes';
import { getPdfPageCount, parsePageRanges, splitPdf, type SplitMode, type SplitResult } from '../lib/tools/pdfSplit';
import { analytics } from '../lib/analytics';
import type { ProcessingStatus } from '../types';

const tool = getToolBySlug('split-pdf')!;

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<SplitMode>('extract');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<SplitResult | null>(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    getPdfPageCount(file)
      .then((count) => {
        if (!cancelled) setPageCount(count);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not read this PDF.');
          setFile(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  function handleFileSelected(files: File[]) {
    const f = files[0];
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    setFile(f);
    setPageCount(null);
    setSelectedPages(new Set());
    setRangeInput('');
    setError('');
    setResult(null);
    setStatus('idle');
    analytics.fileSelected(tool.slug, f.type, f.size);
  }

  function togglePage(index: number) {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function handleSplit() {
    if (!file || !pageCount) return;
    setStatus('processing');
    setError('');
    analytics.processingStarted(tool.slug);
    try {
      let options: { pageIndices?: number[] } = {};
      if (mode === 'extract') {
        options = { pageIndices: Array.from(selectedPages).sort((a, b) => a - b) };
      } else if (mode === 'ranges') {
        options = { pageIndices: parsePageRanges(rangeInput, pageCount) };
      }
      const res = await splitPdf(file, mode, options);
      setResult(res);
      setStatus('success');
      analytics.processingCompleted(tool.slug, file.size, res.blob.size);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while splitting this PDF.';
      setError(message);
      setStatus('error');
      analytics.processingFailed(tool.slug, message);
    }
  }

  function handleReset() {
    setFile(null);
    setPageCount(null);
    setSelectedPages(new Set());
    setRangeInput('');
    setResult(null);
    setStatus('idle');
    setError('');
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-5">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {status === 'processing' && <ProcessingProgress label="Splitting your PDF…" />}

        {status === 'success' && result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Done!</p>
                <p className="text-sm text-slate-500">
                  {result.isZip ? 'Your pages are ready as a ZIP file.' : 'Your PDF is ready to download.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DownloadButton blob={result.blob} fileName={result.fileName} toolSlug={tool.slug} />
              <button type="button" onClick={handleReset} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Process another file
              </button>
            </div>
          </div>
        )}

        {status !== 'processing' && status !== 'success' && (
          <>
            {!file ? (
              <FileUploader accept="application/pdf" label="Upload a PDF" hint="PDF files only" onFilesSelected={handleFileSelected} />
            ) : !pageCount ? (
              <ProcessingProgress label="Reading your PDF…" />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatBytes(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                    </p>
                  </div>
                  <button type="button" onClick={handleReset} aria-label="Remove file" className="shrink-0 text-slate-400 hover:text-red-500">
                    <Icon name="trash" className="h-5 w-5" />
                  </button>
                </div>

                <fieldset className="mb-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">Split method</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(
                      [
                        { id: 'extract', label: 'Select pages' },
                        { id: 'ranges', label: 'Page ranges' },
                        { id: 'every-page', label: 'Every page' },
                      ] as { id: SplitMode; label: string }[]
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMode(m.id)}
                        aria-pressed={mode === m.id}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                          mode === m.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {mode === 'extract' && (
                  <div className="mb-5">
                    <p className="mb-2 text-sm font-medium text-slate-700">Choose pages to extract</p>
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                      {Array.from({ length: pageCount }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => togglePage(i)}
                          aria-pressed={selectedPages.has(i)}
                          className={`rounded-lg border py-2 text-sm font-medium ${
                            selectedPages.has(i) ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {mode === 'ranges' && (
                  <div className="mb-5">
                    <label htmlFor="page-ranges" className="mb-2 block text-sm font-medium text-slate-700">
                      Page ranges
                    </label>
                    <input
                      id="page-ranges"
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder={`e.g. 1-3, 5, 8-${pageCount}`}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Document has {pageCount} pages.</p>
                  </div>
                )}

                {mode === 'every-page' && (
                  <p className="mb-5 text-sm text-slate-500">
                    Each of the {pageCount} pages will be saved as its own PDF, delivered as a single ZIP download.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSplit}
                  className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Split PDF
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
