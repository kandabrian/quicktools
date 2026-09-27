import { Link } from 'react-router-dom';
import { TOOLS } from '../lib/toolsConfig';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Icon name="bolt" className="h-4 w-4" />
              </span>
              QuickTools
            </div>
            <p className="text-sm text-slate-500">Simple tools. Done in seconds.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Tools</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link to={`/${tool.slug}`} className="hover:text-indigo-600">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/about" className="hover:text-indigo-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/privacy" className="hover:text-indigo-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} QuickTools. All processing happens in your browser — your files are never uploaded.
        </div>
      </div>
    </footer>
  );
}
