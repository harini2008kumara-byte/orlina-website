
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { ProfileMenu } from '@/components/layout/ProfileMenu';

interface TopBarProps {
  title: string;
  onOpenNavigation: () => void;
}

export function TopBar({ title, onOpenNavigation }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#090b18]/75 px-4 backdrop-blur-2xl sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          onClick={onOpenNavigation}
          className="shrink-0 text-slate-300 hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />
            <p className="truncate text-sm font-semibold tracking-wide text-white">
              {title}
            </p>
          </div>
          <p className="mt-1 hidden text-[11px] text-slate-500 sm:block">
            Your thoughts, understood.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
