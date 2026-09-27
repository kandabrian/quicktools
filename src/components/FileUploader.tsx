import { useCallback, useId, useRef, useState } from 'react';
import Icon from './Icon';

interface FileUploaderProps {
  accept: string; // e.g. "application/pdf" or "image/jpeg,image/png,image/webp"
  multiple?: boolean;
  label: string;
  hint?: string;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function FileUploader({ accept, multiple = false, label, hint, onFilesSelected, disabled }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFilesSelected(Array.from(fileList));
    },
    [onFilesSelected],
  );

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
            : isDragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
          <Icon name="upload" className="h-6 w-6" />
        </span>
        <p className="mb-1 font-medium text-slate-800">
          <span className="text-indigo-600">Choose a file</span> or drag it here
        </p>
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Allow re-selecting the same file after a reset.
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
