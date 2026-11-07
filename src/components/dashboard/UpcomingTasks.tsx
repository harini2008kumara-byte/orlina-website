import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDueLabel } from '@/lib/formatTime';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import type { Task } from '@/types/orlina';

const VISIBLE_COUNT = 5;

function compareTasks(a: Task, b: Task): number {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
}

interface UpcomingTasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function UpcomingTasks({ tasks, onToggle }: UpcomingTasksProps) {
  const sorted = [...tasks].sort(compareTasks).slice(0, VISIBLE_COUNT);
  const openCount = tasks.filter((task) => !task.completed).length;

  return (
    <DashboardSection title="Tasks" count={openCount}>
      {sorted.length === 0 ? (
        <p className="py-4 text-sm leading-normal text-muted">Tasks you agree to in conversation will show up here.</p>
      ) : (
        <ul className="divide-y divide-line">
          {sorted.map((task) => (
            <li key={task.id} className="flex items-start gap-3 py-3.5 first:pt-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={task.completed}
                aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
                onClick={() => onToggle(task.id)}
                className={cn(
                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-200',
                  task.completed ? 'border-accent bg-accent text-on-accent' : 'border-line bg-input hover:border-accent',
                )}
              >
                {task.completed && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium', task.completed ? 'text-muted line-through' : 'text-ink')}>{task.title}</p>
                <p className="mt-1 text-xs text-muted">{formatDueLabel(task.dueAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
