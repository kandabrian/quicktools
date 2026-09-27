import type { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';
import Faq from './Faq';
import RelatedTools from './RelatedTools';
import type { ToolMeta } from '../types';
import { getRelatedTools } from '../lib/toolsConfig';
import { useSeo } from '../hooks/useSeo';

export default function ToolPageLayout({ tool, children }: { tool: ToolMeta; children: ReactNode }) {
  useSeo({
    title: tool.name,
    description: tool.shortDescription,
    path: `/${tool.slug}`,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: tool.name }]} />

      <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">{tool.name}</h1>
      <p className="mb-8 text-slate-500">{tool.longDescription}</p>

      <div className="mb-12">{children}</div>

      <div className="mb-12">
        <Faq items={tool.faqs} />
      </div>

      <RelatedTools tools={getRelatedTools(tool.slug)} />
    </div>
  );
}
