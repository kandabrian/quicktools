import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    path: '/404',
  });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="mb-2 text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mb-3 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mb-8 text-slate-500">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
        Back to home
      </Link>
    </div>
  );
}
