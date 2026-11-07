import { useEffect } from 'react';
import { viewHref } from '@/config/navigation';
import type { LegalDocument } from '@/config/legal';

interface LegalPageProps {
  document: LegalDocument;
}

export function LegalPage({ document: legal }: LegalPageProps) {
  useEffect(() => {
    document.title = `${legal.title} | ORLINA`;
  }, [legal.title]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <a href={viewHref('overview')} className="font-display text-xl text-ink">
            ORLINA
          </a>
          <a href={viewHref('overview')} className="text-sm text-muted transition-colors hover:text-ink">
            Back to ORLINA
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl text-ink sm:text-4xl">{legal.title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {legal.updated}</p>
        <p className="mt-6 text-base leading-normal text-muted">{legal.description}</p>

        <div className="mt-10 space-y-10">
          {legal.sections.map((section) => (
            <section key={section.heading} aria-labelledby={`legal-${section.heading.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2
                id={`legal-${section.heading.replace(/\s+/g, '-').toLowerCase()}`}
                className="text-xl text-ink"
              >
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-normal text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
