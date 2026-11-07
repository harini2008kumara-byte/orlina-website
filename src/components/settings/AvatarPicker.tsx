import { Check } from 'lucide-react';
import { OrlinaCharacter } from '@/components/illustrations/OrlinaCharacter';
import { AVATAR_PALETTES } from '@/components/illustrations/avatarPalettes';
import { AVATAR_OPTIONS } from '@/config/avatars';
import { cn } from '@/lib/cn';
import type { AvatarId } from '@/types/orlina';

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (avatar: AvatarId) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {AVATAR_OPTIONS.map((option) => {
        const selected = option.id === value;
        const palette = AVATAR_PALETTES[option.id];
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-3xl border p-3 text-left transition-all duration-300 ease-out hover:-translate-y-0.5',
              selected
                ? 'border-accent bg-panel shadow-[0_0_0_1px_rgba(138,107,255,0.55),0_20px_44px_-18px_rgba(138,107,255,0.65)]'
                : 'border-line bg-surface hover:border-accent/60 hover:bg-panel/60',
            )}
          >
            <span
              className="relative block aspect-[10/9] w-full overflow-hidden rounded-2xl shadow-clay-inset"
              style={{
                background: `radial-gradient(120% 90% at 50% 8%, ${palette.glow}40 0%, transparent 62%), linear-gradient(180deg, #111420 0%, #06070B 100%)`,
              }}
            >
              <OrlinaCharacter
                avatar={option.id}
                className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 grid h-8 w-8 animate-avatar-pop place-items-center rounded-full bg-accent text-on-accent shadow-clay-primary"
                >
                  <Check className="h-4 w-4" />
                </span>
              )}
            </span>
            <span className="mt-4 block px-1 pb-1">
              <span className={cn('block text-sm font-medium transition-colors duration-200', selected ? 'text-mint' : 'text-ink')}>
                {option.label}
              </span>
              <span className="mt-1 block text-xs leading-normal text-muted">{option.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
