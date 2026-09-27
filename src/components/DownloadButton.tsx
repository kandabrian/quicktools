import { useEffect, useRef } from 'react';
import Icon from './Icon';
import { analytics } from '../lib/analytics';

interface DownloadButtonProps {
  blob: Blob;
  fileName: string;
  toolSlug: string;
}

export default function DownloadButton({ blob, fileName, toolSlug }: DownloadButtonProps) {
  const urlRef = useRef<string>('');

  useEffect(() => {
    urlRef.current = URL.createObjectURL(blob);
    return () => URL.revokeObjectURL(urlRef.current);
  }, [blob]);

  function handleClick() {
    analytics.downloadClicked(toolSlug);
    const a = document.createElement('a');
    a.href = urlRef.current;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <Icon name="download" className="h-4 w-4" />
      Download {fileName}
    </button>
  );
}
