import { useEffect, useState, type ReactNode } from 'react';
import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/cn';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

const SIDEBAR_STORAGE_KEY = 'orlina.sidebarCollapsed';

interface AppShellProps {
  activeItem: NavItem;
  children: ReactNode;
}

export function AppShell({ activeItem, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const closeNavigation = () => setMobileOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <Sidebar
        activePath={activeItem.path}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onClose={closeNavigation}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeNavigation}
          className="fixed inset-0 z-30 animate-fade-up bg-canvas/70 lg:hidden"
        />
      )}

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-accent">
        Skip to main content
      </a>

      <div className={cn('flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-out', collapsed ? 'lg:pl-20' : 'lg:pl-60')}>
        <TopBar title={activeItem.label} onOpenNavigation={() => setMobileOpen(true)} />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-5xl min-w-0">{children}</div>
        </main>
        <footer className="border-t border-line px-4 py-6 text-xs text-muted sm:px-6 lg:px-10">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy" className="transition-colors hover:text-ink">Privacy Policy</a>
            <a href="/terms" className="transition-colors hover:text-ink">Terms of Use</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
