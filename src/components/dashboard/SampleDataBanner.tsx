import { Info } from 'lucide-react';

export function SampleDataBanner() {
  return (
    <div role="note" className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-sm leading-normal text-ink">
        <span className="font-medium text-warning">Demo mode.</span> The conversations, decisions, tasks and memories shown
        here are sample data. Your own changes stay on this device.
      </p>
    </div>
  );
}
