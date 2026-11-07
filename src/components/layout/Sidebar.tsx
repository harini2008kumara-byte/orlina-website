import { PanelLeftClose, PanelLeftOpen, ShieldCheck, X } from 'lucide-react';
import { NAV_ITEMS, viewHref } from '@/config/navigation';
import { cn } from '@/lib/cn';
import { Wordmark } from '@/components/brand/Wordmark';

interface SidebarProps {
  activePath: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onClose: () => void;
}

const ICON_BUTTON_CLASSES =
  'grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-panel hover:text-ink';

export function Sidebar({ activePath, collapsed, mobileOpen, onToggleCollapsed, onClose }: SidebarProps) {
  return (
    <aside
      aria-label="Primary"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface transition-[transform,width] duration-300 ease-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        collapsed ? 'lg:w-20' : 'lg:w-60',
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-5', collapsed && 'lg:justify-center lg:px-0')}>
        <a
          href={viewHref('overview')}
          onClick={onClose}
          className={cn('min-w-0 rounded-lg', collapsed && 'lg:hidden')}
          aria-label="ORLINA overview"
        >
          <Wordmark />
        </a>
        <button type="button" onClick={onClose} aria-label="Close navigation" className={cn(ICON_BUTTON_CLASSES, 'lg:hidden')}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className={cn(ICON_BUTTON_CLASSES, 'hidden lg:grid')}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden="true" /> : <PanelLeftClose className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === activePath;
          const Icon = item.icon;
          return (
            <a
              key={item.path}
              href={viewHref(item.path)}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-panel text-mint shadow-clay' : 'text-muted hover:bg-panel/60 hover:text-ink',
                collapsed && 'lg:justify-center lg:px-0',
              )}
            >
              {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-mint" aria-hidden="true" />}
              <Icon
                className={cn('h-5 w-5 shrink-0 transition-colors duration-200', isActive ? 'text-mint' : 'group-hover:text-mint')}
                aria-hidden="true"
              />
              <span className={cn('truncate', collapsed && 'lg:sr-only')}>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className={cn('mx-3 mb-4 flex items-start gap-3 rounded-xl border border-line bg-canvas/60 p-3', collapsed && 'lg:hidden')}>
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
        <p className="text-xs leading-normal text-muted">Your memory is private and only ever used on your behalf.</p>
      </div>
    </aside>
  );
}
