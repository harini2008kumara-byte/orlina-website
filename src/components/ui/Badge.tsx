import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'mint' | 'accent' | 'warning' | 'danger';

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-line bg-input text-muted',
  mint: 'border-mint/30 bg-mint/15 text-mint',
  accent: 'border-accent/40 bg-accent/20 text-mist',
  warning: 'border-warning/30 bg-warning/15 text-warning',
  danger: 'border-danger/30 bg-danger/15 text-danger',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
