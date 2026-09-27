import { Link } from 'react-router-dom';
import type { ToolMeta } from '../types';
import Icon from './Icon';

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      to={`/${tool.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
        <Icon name={tool.icon} className="h-5 w-5" />
      </span>
      <h3 className="mb-1 font-semibold text-slate-900">{tool.name}</h3>
      <p className="mb-4 flex-1 text-sm text-slate-500">{tool.shortDescription}</p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
        Use tool
        <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
