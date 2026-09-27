import { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { analytics } from './lib/analytics';

// Tool pages are lazy-loaded: each one pulls in its own heavy processing
// library (pdf-lib, pdfjs-dist, browser-image-compression) via dynamic
// import inside lib/tools/*, and lazy-loading the page itself means none of
// that code is even requested until the user actually opens the tool.
const CompressPdf = lazy(() => import('./pages/CompressPdf'));
const MergePdf = lazy(() => import('./pages/MergePdf'));
const SplitPdf = lazy(() => import('./pages/SplitPdf'));
const CompressImage = lazy(() => import('./pages/CompressImage'));
const JpgToPdf = lazy(() => import('./pages/JpgToPdf'));

// Vite renames chunk files with a new content hash on every build. If
// someone has this site open in a tab across a deploy, their cached
// index.html still points at the old filenames, and any lazy import()
// after that (e.g. clicking into a tool) 404s with "Failed to fetch
// dynamically imported module." The fix: reload once, which fetches the
// current index.html and its correct asset references. Guarded with
// sessionStorage so a page that's genuinely broken doesn't reload forever.
window.addEventListener('vite:preloadError', () => {
  const key = 'chunk-reload-attempted';
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1');
    window.location.reload();
  }
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Plausible's script auto-tracks the very first pageview on load. This
// component fires a pageview for every *subsequent* client-side navigation
// (e.g. clicking from /compress-pdf to /merge-pdf), which a single-page app
// wouldn't otherwise report since there's no full page load to trigger it.
function PageViewTracker() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    analytics.pageview();
  }, [pathname]);

  return null;
}

function ToolPageFallback() {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-24">
      <span
        className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"
        aria-label="Loading tool"
        role="status"
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <PageViewTracker />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ToolPageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compress-pdf" element={<CompressPdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/compress-image" element={<CompressImage />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}