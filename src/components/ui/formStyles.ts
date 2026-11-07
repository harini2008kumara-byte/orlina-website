import { cn } from '@/lib/cn';

export const fieldClassName =
  'w-full rounded-2xl border border-line bg-input px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors duration-200 hover:border-accent focus:border-mint focus:outline-none focus:ring-4 focus:ring-mint/15 disabled:opacity-50';

export const labelClassName = 'mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted';

export function fieldClass(extra?: string) {
  return cn(fieldClassName, extra);
}
