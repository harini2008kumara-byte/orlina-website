import { Orbit } from 'lucide-react';
import { cn } from '@/lib/cn';

interface WordmarkProps {
  className?: string;
  showText?: boolean;
}

export function Wordmark({ className, showText = true }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-on-accent">
        <Orbit className="h-5 w-5" aria-hidden="true" />
      </span>
      {showText && (
        <span className="font-display text-base font-semibold tracking-[0.3em] text-ink">ORLINA</span>
      )}
    </span>
  );
}
