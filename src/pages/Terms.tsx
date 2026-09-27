import { useSeo } from '../hooks/useSeo';

export default function Terms() {
  useSeo({
    title: 'Terms of Service',
    description: 'Terms of service for using QuickTools free online PDF and image tools.',
    path: '/terms',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Terms of Service</h1>
      <div className="space-y-6 text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Use of the service</h2>
          <p>
            QuickTools is provided free of charge for personal and commercial use. You are responsible for the files
            you process and for having the right to process them.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">No warranty</h2>
          <p>
            QuickTools is provided "as is" without warranties of any kind. While we aim for accurate, reliable
            results, we cannot guarantee the tools will be error-free or uninterrupted, and we are not liable for any
            loss arising from their use.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Acceptable use</h2>
          <p>
            You agree not to use QuickTools to process illegal content or to attempt to disrupt or abuse the
            service.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Changes</h2>
          <p>These terms may be updated as the service evolves. Continued use after changes means you accept them.</p>
        </section>
      </div>
    </div>
  );
}
