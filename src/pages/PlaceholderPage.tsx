import { viewHref, type NavItem } from '@/config/navigation';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

interface PlaceholderPageProps {
  item: NavItem;
}

export function PlaceholderPage({ item }: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl text-ink sm:text-4xl">{item.label}</h1>
        <p className="mt-3 max-w-2xl text-base leading-normal text-muted">{item.description}</p>
      </header>
      <Card>
        <EmptyState
          scene="memory"
          title={`${item.label} is coming soon`}
          description="This space is being built next. Your overview is ready in the meantime."
          action={
            <a href={viewHref('overview')} className={buttonClassName('secondary', 'md')}>
              Back to overview
            </a>
          }
        />
      </Card>
    </div>
  );
}
