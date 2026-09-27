interface ProcessingProgressProps {
  label?: string;
  onCancel?: () => void;
}

export default function ProcessingProgress({ label = 'Processing…', onCancel }: ProcessingProgressProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
      <span className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      <p className="mb-1 font-medium text-slate-800">{label}</p>
      <p className="mb-4 text-sm text-slate-500">This runs locally in your browser — larger files may take a bit longer.</p>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
