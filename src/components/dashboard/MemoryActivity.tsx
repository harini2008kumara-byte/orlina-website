import { viewHref } from '@/config/navigation';
import { formatRelativeTime } from '@/lib/formatTime';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { DashboardSection, sectionLinkClassName } from '@/components/dashboard/DashboardSection';
import type { MemoryItem, MemoryKind } from '@/types/orlina';

const VISIBLE_COUNT = 3;

const KIND_META: Record<MemoryKind, { label: string; tone: BadgeTone }> = {
  fact: { label: 'Fact', tone: 'accent' },
  preference: { label: 'Preference', tone: 'mint' },
  commitment: { label: 'Commitment', tone: 'warning' },
  person: { label: 'Person', tone: 'mint' },
};

interface MemoryActivityProps {
  memories: MemoryItem[];
  totalCount: number;
}

export function MemoryActivity({ memories, totalCount }: MemoryActivityProps) {
  return (
    <DashboardSection
      title="Memory"
      count={totalCount}
      action={
        <a href={viewHref('memory')} className={sectionLinkClassName}>
          Open
        </a>
      }
    >
      {memories.length === 0 ? (
        <p className="py-4 text-sm leading-normal text-muted">Useful details from your conversations will be saved here.</p>
      ) : (
        <ul className="divide-y divide-line">
          {memories.slice(0, VISIBLE_COUNT).map((memory) => {
            const meta = KIND_META[memory.kind];
            return (
              <li key={memory.id} className="py-3.5 first:pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <span className="text-xs text-muted">{formatRelativeTime(memory.savedAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-normal text-ink">{memory.summary}</p>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
}
