import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { ProfileMenu } from '@/components/layout/ProfileMenu';

interface TopBarProps {
  title: string;
  onOpenNavigation: () => void;
}

export function TopBar({ title, onOpenNavigation }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas/90 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={onOpenNavigation} className="shrink-0 lg:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <p className="truncate text-sm font-medium text-ink">{title}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
