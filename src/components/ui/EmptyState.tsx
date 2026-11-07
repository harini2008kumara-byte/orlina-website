import type { ReactNode } from 'react';
import { CompanionScene, type CompanionSceneName } from '@/components/illustrations/CompanionScene';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  scene: CompanionSceneName;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ scene, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      <CompanionScene scene={scene} className="w-full max-w-[220px]" />
      <h3 className="mt-5 text-lg text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
