import type { ToolMeta } from '../types';
import ToolCard from './ToolCard';

export default function RelatedTools({ tools }: { tools: ToolMeta[] }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-4 text-xl font-semibold text-slate-900">
        Related tools
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
