interface OverviewStatsProps {
  decisionCount: number;
  taskCount: number;
  memoryCount: number;
}

const STAT_LABELS = {
  decisions: ['decision', 'decisions'],
  tasks: ['open task', 'open tasks'],
  memories: ['memory', 'memories'],
} as const;

function StatItem({ value, label }: { value: number; label: readonly [string, string] }) {
  return (
    <div className="space-y-1">
      <p className="font-display text-3xl leading-none text-ink">{value}</p>
      <p className="text-sm text-muted">{value === 1 ? label[0] : label[1]}</p>
    </div>
  );
}

export function OverviewStats({ decisionCount, taskCount, memoryCount }: OverviewStatsProps) {
  return (
    <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6">
      <StatItem value={decisionCount} label={STAT_LABELS.decisions} />
      <StatItem value={taskCount} label={STAT_LABELS.tasks} />
      <StatItem value={memoryCount} label={STAT_LABELS.memories} />
    </dl>
  );
}
