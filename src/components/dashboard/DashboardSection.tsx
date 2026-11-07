import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface DashboardSectionProps {
  title: string;
  count?: number;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashboardSection({ title, count, action, className, children }: DashboardSectionProps) {
  return (
    <section className={cn('min-w-0', className)}>
      <header className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <h2 className="truncate text-xl text-ink">{title}</h2>
          {count !== undefined && <span className="shrink-0 text-sm text-muted">{count}</span>}
        </div>
        {action}
      </header>
      <div className="pt-1">{children}</div>
    </section>
  );
}

export const sectionLinkClassName =
  'shrink-0 text-sm font-medium text-mint transition-colors duration-200 hover:text-mist';
