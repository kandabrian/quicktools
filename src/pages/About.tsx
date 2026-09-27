import { useSeo } from '../hooks/useSeo';

export default function About() {
  useSeo({
    title: 'About',
    description: 'QuickTools is a free, privacy-first toolbox for everyday PDF and image tasks — no account required.',
    path: '/about',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">About QuickTools</h1>
      <div className="space-y-4 text-slate-600">
        <p>
          QuickTools is a small toolbox of free, no-nonsense utilities for the everyday file tasks people run into
          constantly — compressing a PDF before emailing it, merging a few documents together, or shrinking an image
          before uploading it somewhere.
        </p>
        <p>
          Wherever technically possible, everything runs directly in your browser. That means no waiting on uploads,
          no account to create, and your files never have to leave your device to get the job done.
        </p>
        <p>We keep the tool list focused and the interface simple — fast, free, and out of your way.</p>
      </div>
    </div>
  );
}
