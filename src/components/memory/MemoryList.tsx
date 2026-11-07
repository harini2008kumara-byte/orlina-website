import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/formatTime';
import type { MemoryItem, MemoryKind } from '@/types/orlina';

const KIND_LABELS: Record<MemoryKind, string> = {
  fact: 'Facts',
  preference: 'Preferences',
  commitment: 'Commitments',
  person: 'People',
};

const KIND_SINGULAR: Record<MemoryKind, string> = {
  fact: 'Fact',
  preference: 'Preference',
  commitment: 'Commitment',
  person: 'Person',
};

const FILTERS: ('all' | MemoryKind)[] = ['all', 'fact', 'preference', 'commitment', 'person'];

interface MemoryListProps {
  memories: MemoryItem[];
  onDelete: (id: string) => void;
}

export function MemoryList({ memories, onDelete }: MemoryListProps) {
  const [filter, setFilter] = useState<'all' | MemoryKind>('all');
  const visible = filter === 'all' ? memories : memories.filter((memory) => memory.kind === filter);

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filter memories" className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200',
                active ? 'border-mint bg-mint text-on-accent' : 'border-line text-muted hover:border-accent hover:text-ink',
              )}
            >
              {option === 'all' ? 'All' : KIND_LABELS[option]}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-8 text-sm leading-normal text-muted">
          {memories.length === 0
            ? 'Useful details from your conversations will be saved here for you to review.'
            : 'Nothing saved in this group yet.'}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {visible.map((memory) => (
            <li key={memory.id} className="group flex items-start gap-5 py-6 first:pt-0">
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
                  {KIND_SINGULAR[memory.kind]} · {formatRelativeTime(memory.savedAt)}
                </p>
                <p className="mt-2 font-display text-xl leading-snug text-ink">{memory.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(memory.id)}
                aria-label={`Forget: ${memory.summary}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted opacity-100 transition-colors duration-200 hover:bg-panel hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
