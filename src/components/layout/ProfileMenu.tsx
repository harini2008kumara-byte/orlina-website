import { useCallback, useRef, useState } from 'react';
import { ChevronDown, Network, Settings } from 'lucide-react';
import { viewHref } from '@/config/navigation';
import { useDismissable } from '@/hooks/useDismissable';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getFirstName } from '@/lib/text';
import { OrlinaCharacter } from '@/components/illustrations/OrlinaCharacter';

const MENU_LINKS = [
  { href: viewHref('settings'), label: 'Account settings', icon: Settings },
  { href: viewHref('memory-map'), label: 'Connected Memory Map', icon: Network },
];

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismissable(containerRef, open, close);
  const { workspace } = useWorkspace();
  const profile = workspace?.profile;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-panel"
      >
        <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-line bg-panel shadow-clay">
          {profile ? <OrlinaCharacter avatar={profile.avatar} className="h-full w-full" /> : null}
        </span>
        <span className="hidden text-sm font-medium text-ink sm:block">
          {profile ? getFirstName(profile.name) || 'Profile' : ''}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted transition-transform duration-200 sm:block" style={{ transform: open ? 'rotate(180deg)' : undefined }} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] animate-fade-up rounded-2xl border border-line bg-surface p-2 shadow-lift"
        >
          {profile && (
            <div className="px-3 py-2">
              <p className="font-medium text-ink">{profile.name || 'Your profile'}</p>
              <p className="text-sm text-muted">Name and avatar</p>
            </div>
          )}
          <div className="my-1 h-px bg-line" />
          {MENU_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              role="menuitem"
              onClick={close}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-panel"
            >
              <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
