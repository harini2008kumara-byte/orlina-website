import { useEffect } from 'react';
import { viewHref } from '@/config/navigation';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | ORLINA';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <EmptyState
            scene="error"
            title="This page could not be found"
            description="The link may be out of date or the page may have moved. Return to your overview to keep going."
            action={
              <a href={viewHref('overview')} className={buttonClassName('primary', 'md')}>
                Back to overview
              </a>
            }
          />
        </Card>
      </div>
    </div>
  );
}
