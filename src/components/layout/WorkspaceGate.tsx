import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWorkspace } from '@/hooks/useWorkspace';
import type { OrlinaWorkspace } from '@/types/orlina';

interface WorkspaceGateProps {
  children: (workspace: OrlinaWorkspace) => ReactNode;
}

export function WorkspaceGate({ children }: WorkspaceGateProps) {
  const { status, workspace, reload } = useWorkspace();

  if (status === 'loading') {
    return (
      <div aria-busy="true" className="space-y-6">
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (status === 'error' || !workspace) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
        <p className="text-base text-ink">We couldn't load this page.</p>
        <p className="text-sm text-muted">Something went wrong on our side. Please try again in a moment.</p>
        <Button variant="primary" size="sm" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  return <>{children(workspace)}</>;
}
