import { useCallback, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useDismissable } from '@/hooks/useDismissable';
import { useWorkspace } from '@/hooks/useWorkspace';
import { formatRelativeTime } from '@/lib/formatTime';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismissable(containerRef, open, close);
  const { workspace, markNotificationsRead } = useWorkspace();
  const notifications = workspace?.notifications ?? [];

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-mint ring-2 ring-canvas" aria-hidden="true" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-fade-up rounded-2xl border border-line bg-surface p-2 shadow-lift">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="font-medium text-ink">Notifications</p>
            <button
              type="button"
              onClick={() => markNotificationsRead(null)}
              disabled={unreadCount === 0}
              className="rounded-lg px-2 py-1 text-sm font-medium text-mint transition-colors hover:bg-panel hover:text-mist disabled:pointer-events-none disabled:opacity-40"
            >
              Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">You are all caught up.</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {notifications.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => {
                      markNotificationsRead(item.id);
                      close();
                    }}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-panel"
                  >
                    <span
                      className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', item.read ? 'bg-transparent' : 'bg-mint')}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className={cn('block text-sm', item.read ? 'text-muted' : 'font-medium text-ink')}>{item.title}</span>
                      <span className="mt-1 block text-xs text-muted">{formatRelativeTime(item.createdAt)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
