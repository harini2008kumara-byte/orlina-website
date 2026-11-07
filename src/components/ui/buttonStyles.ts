import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'icon';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-mint text-on-accent shadow-clay-primary hover:bg-mist active:shadow-clay-inset',
  secondary: 'border border-line bg-input text-ink shadow-clay hover:border-accent hover:bg-panel active:shadow-clay-inset',
  ghost: 'text-muted hover:bg-panel hover:text-ink',
  danger: 'text-danger hover:bg-danger/10',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  icon: 'h-10 w-10',
};

export function buttonClassName(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', extra?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], extra);
}
