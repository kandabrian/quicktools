import Icon from './Icon';
import DownloadButton from './DownloadButton';
import { formatBytes, percentReduction } from '../lib/formatBytes';

interface ResultCardProps {
  originalSize: number;
  resultSize: number;
  fileName: string;
  toolSlug: string;
  blob: Blob;
  onReset: () => void;
  showReduction?: boolean; // false for tools where "smaller" isn't the point (e.g. merge)
}

export default function ResultCard({ originalSize, resultSize, fileName, toolSlug, blob, onReset, showReduction = true }: ResultCardProps) {
  const reduction = percentReduction(originalSize, resultSize);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-slate-900">Done!</p>
          <p className="text-sm text-slate-500">Your file is ready to download.</p>
        </div>
      </div>

      {showReduction && (
        <div className="mb-5 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Original</p>
            <p className="font-semibold text-slate-800">{formatBytes(originalSize)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">New size</p>
            <p className="font-semibold text-slate-800">{formatBytes(resultSize)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Reduced by</p>
            <p className={`font-semibold ${reduction > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {reduction > 0 ? `${reduction}%` : 'No change'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <DownloadButton blob={blob} fileName={fileName} toolSlug={toolSlug} />
        <button type="button" onClick={onReset} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Process another file
        </button>
      </div>
    </div>
  );
}
