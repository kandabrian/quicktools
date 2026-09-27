import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq({ items, title = 'Frequently asked questions' }: { items: FaqItem[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question}>
              <dt>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-slate-800"
                >
                  {item.question}
                  <span aria-hidden="true" className={`shrink-0 text-slate-400 transition ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
              </dt>
              {isOpen && (
                <dd className="px-5 pb-4 text-sm leading-relaxed text-slate-500">{item.answer}</dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
