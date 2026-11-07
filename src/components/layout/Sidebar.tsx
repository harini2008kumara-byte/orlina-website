
import { PanelLeftClose, PanelLeftOpen, ShieldCheck, X, Sparkles } from 'lucide-react';
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
  'grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted transition-all hover:bg-white/10 hover:text-white';

export function Sidebar({
  activePath,
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onClose,
}: SidebarProps) {
  return (
    <aside
      aria-label="Primary"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0c0d19]/95 shadow-[15px_0_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-[transform,width] duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        collapsed ? 'lg:w-20' : 'lg:w-60',
      )}
    >
      <div className={cn(
        'flex h-20 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-5',
        collapsed && 'lg:justify-center lg:px-0'
      )}>
        <a
          href={viewHref('overview')}
          onClick={onClose}
          className={cn('min-w-0 rounded-lg', collapsed && 'lg:hidden')}
          aria-label="ORLINA overview"
        >
          <Wordmark />
        </a>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className={cn(ICON_BUTTON_CLASSES, 'lg:hidden')}
        >
          <X className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className={cn(ICON_BUTTON_CLASSES, 'hidden lg:grid')}
        >
          {collapsed
            ? <PanelLeftOpen className="h-5 w-5" />
            : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn('px-5 pt-7 pb-3', collapsed && 'lg:hidden')}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
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
                'group relative flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-violet-400/25 bg-gradient-to-r from-violet-500/20 via-indigo-500/10 to-transparent text-white shadow-[0_0_25px_rgba(139,92,246,0.12)]'
                  : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
                collapsed && 'lg:justify-center lg:px-0',
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-violet-400 to-blue-400" />
              )}
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-all',
                  isActive ? 'text-violet-300' : 'text-slate-500 group-hover:text-blue-300',
                )}
                aria-hidden="true"
              />
              <span className={cn('truncate', collapsed && 'lg:sr-only')}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className={cn(
        'mx-3 mb-4 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-4',
        collapsed && 'lg:hidden'
      )}>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <span className="text-xs font-semibold text-violet-200">Your ORLINA space</span>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
          <p className="text-xs leading-relaxed text-slate-400">
            Your conversations deserve a thoughtful and private space.
          </p>
        </div>
      </div>
    </aside>
  );
}
