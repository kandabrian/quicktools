import Icon from './Icon';

export default function ErrorMessage({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <Icon name="error" className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss error" className="text-red-500 hover:text-red-700">
          ✕
        </button>
      )}
    </div>
  );
}
