import { useSeo } from '../hooks/useSeo';

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy',
    description: 'How QuickTools handles your files and data. Browser-based tools process files locally on your device.',
    path: '/privacy',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <div className="space-y-6 text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Your files</h2>
          <p>
            For every tool currently offered on QuickTools, file processing happens entirely in your browser. Your
            files are read locally by JavaScript running on your device and are never uploaded to our servers or any
            third party.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Accounts</h2>
          <p>QuickTools does not require an account or login to use any tool.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Analytics</h2>
          <p>
            We may collect anonymous, aggregate usage metadata — for example, which tool was opened or whether
            processing succeeded — to understand which tools are useful. We do not collect or transmit the contents
            of any file you process.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Changes to this policy</h2>
          <p>If this policy changes as new tools are added, this page will be updated.</p>
        </section>
      </div>
    </div>
  );
}
