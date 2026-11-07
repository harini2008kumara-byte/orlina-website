import { useState } from 'react';
import { viewHref } from '@/config/navigation';
import { Button } from '@/components/ui/Button';

const NOTICE_STORAGE_KEY = 'orlina.cookieNotice';

export function CookieNotice() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(NOTICE_STORAGE_KEY) === 'acknowledged');

  if (dismissed) return null;

  const acknowledge = () => {
    localStorage.setItem(NOTICE_STORAGE_KEY, 'acknowledged');
    setDismissed(true);
  };

  return (
    <section
      aria-label="Cookie and storage notice"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-2xl rounded-2xl border border-line bg-panel p-5 shadow-lift sm:p-6"
    >
      <h2 className="text-base font-semibold text-ink">Your privacy, in plain terms</h2>
      <p className="mt-2 text-sm leading-normal text-muted">
        ORLINA stores only what it needs to work: your sidebar preference, this notice choice, and a device identifier that
        keeps your conversations with your browser. ORLINA does not use advertising or analytics cookies.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        <a href={viewHref('privacy')} className="mr-auto text-sm text-mint underline-offset-4 hover:underline">
          Read the privacy policy
        </a>
        <Button variant="primary" size="sm" onClick={acknowledge}>
          Got it
        </Button>
      </div>
    </section>
  );
}
