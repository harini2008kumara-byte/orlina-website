import { ProfileSettings } from '@/components/settings/ProfileForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Skeleton } from '@/components/ui/Skeleton';

export function SettingsPage() {
  const { status, reload } = useWorkspace();

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Your name and avatar. These appear across ORLINA on this device." />
      {status === 'loading' ? (
        <div aria-busy="true" className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : status === 'error' ? (
        <button type="button" onClick={reload} className="text-sm font-medium text-mint hover:text-mist">
          Could not load your settings. Try again.
        </button>
      ) : (
        <ProfileSettings />
      )}
    </div>
  );
}
