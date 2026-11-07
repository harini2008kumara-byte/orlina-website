import { formatDueLabel } from '@/lib/formatTime';
import { Button } from '@/components/ui/Button';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import type { Decision, DecisionStatus } from '@/types/orlina';

interface PendingDecisionsProps {
  decisions: Decision[];
  onChangeStatus: (id: string, status: DecisionStatus) => void;
}

export function PendingDecisions({ decisions, onChangeStatus }: PendingDecisionsProps) {
  const pending = decisions.filter((decision) => decision.status === 'pending');

  return (
    <DashboardSection title="Decisions" count={pending.length}>
      {pending.length === 0 ? (
        <p className="py-4 text-sm leading-normal text-muted">No decisions are waiting on you.</p>
      ) : (
        <ul className="divide-y divide-line">
          {pending.map((decision) => (
            <li key={decision.id} className="py-4 first:pt-2">
              <p className="text-sm font-medium text-ink">{decision.title}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-normal text-muted">{decision.context}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium text-warning">
                  {decision.dueAt ? `Decide by ${formatDueLabel(decision.dueAt)}` : 'No deadline set'}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onChangeStatus(decision.id, 'deferred')}>
                    Defer
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onChangeStatus(decision.id, 'decided')}>
                    Mark decided
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
