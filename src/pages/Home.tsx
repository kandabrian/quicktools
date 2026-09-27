import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import Faq from '../components/Faq';
import Icon from '../components/Icon';
import { TOOLS, searchTools } from '../lib/toolsConfig';
import { useSeo } from '../hooks/useSeo';

const HOME_FAQS = [
  {
    question: 'Do I need to create an account?',
    answer: 'No. Every tool works instantly without signing up or logging in.',
  },
  {
    question: 'Are my files uploaded to a server?',
    answer:
      'For every tool listed here, processing happens directly in your browser using JavaScript. Your files are never uploaded anywhere.',
  },
  {
    question: 'Is QuickTools really free?',
    answer: 'Yes, all current tools are completely free to use with no limits on how many files you process.',
  },
];

export default function Home() {
  useSeo({
    title: 'Free Online PDF & Image Tools',
    description:
      'Compress, merge, split PDFs and compress images for free, right in your browser. No account needed, no file uploads to a server.',
    path: '/',
  });

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const results = useMemo(() => searchTools(query), [query]);
  const isSearching = query.trim().length > 0;
  const popularTools = TOOLS.filter((t) => t.popular);
  const pdfTools = TOOLS.filter((t) => t.category === 'pdf');
  const imageTools = TOOLS.filter((t) => t.category === 'image');

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Free tools that just work.</h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-500">
            Compress, convert, merge and manage your files without complicated software.
          </p>

          <div className="relative mx-auto max-w-xl">
            <label htmlFor="hero-search" className="sr-only">
              Search tools
            </label>
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a tool… e.g. compress pdf"
              className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm shadow-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="h-4 w-4 text-indigo-500" />
              Files processed on your device
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" className="h-4 w-4 text-indigo-500" />
              No account required
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {isSearching ? (
          <section aria-labelledby="search-results-heading">
            <h2 id="search-results-heading" className="mb-6 text-xl font-semibold text-slate-900">
              {results.length > 0 ? `Results for "${query}"` : `No tools found for "${query}"`}
            </h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Try a different search term, or browse all tools below.</p>
            )}
          </section>
        ) : (
          <>
            <section aria-labelledby="popular-heading">
              <h2 id="popular-heading" className="mb-6 text-xl font-semibold text-slate-900">
                Popular Tools
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {popularTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>

            <section aria-labelledby="pdf-heading">
              <h2 id="pdf-heading" className="mb-6 text-xl font-semibold text-slate-900">
                PDF Tools
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pdfTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>

            <section aria-labelledby="image-heading">
              <h2 id="image-heading" className="mb-6 text-xl font-semibold text-slate-900">
                Image Tools
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {imageTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Why QuickTools */}
        <section aria-labelledby="why-heading" className="rounded-3xl bg-slate-50 p-8 sm:p-10">
          <h2 id="why-heading" className="mb-8 text-xl font-semibold text-slate-900">
            Why QuickTools?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon name="bolt" className="h-5 w-5" />
              </span>
              <h3 className="mb-1 font-semibold text-slate-900">Fast</h3>
              <p className="text-sm text-slate-500">No uploads or waiting on a server — most tools finish in seconds.</p>
            </div>
            <div>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <h3 className="mb-1 font-semibold text-slate-900">Private</h3>
              <p className="text-sm text-slate-500">Your files are processed on your own device whenever possible.</p>
            </div>
            <div>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <h3 className="mb-1 font-semibold text-slate-900">Free</h3>
              <p className="text-sm text-slate-500">No account, no subscription, no limits on how many files you process.</p>
            </div>
          </div>
        </section>

        {/* Privacy message */}
        <section aria-labelledby="privacy-heading" className="text-center">
          <h2 id="privacy-heading" className="mb-2 text-xl font-semibold text-slate-900">
            Your files are yours.
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500">
            For browser-based tools, files are processed directly on your device whenever possible. We don't require an
            account to use the tools.
          </p>
        </section>

        <Faq items={HOME_FAQS} />
      </div>
    </div>
  );
}
