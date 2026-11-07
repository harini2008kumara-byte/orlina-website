import { viewHref } from '@/config/navigation';

interface OverviewHeadingProps {
  needsName: boolean;
}

export function OverviewHeading({ needsName }: OverviewHeadingProps) {
  return (
    <header className="space-y-4">
      <h1 className="text-4xl leading-[1.1] text-ink sm:text-5xl">Your thoughts, understood.</h1>
      <p className="max-w-md text-base leading-normal text-muted">A space to think, decide and move forward.</p>
      {needsName && (
        <a
          href={viewHref('settings')}
          className="inline-flex text-sm font-medium text-mint underline-offset-4 transition-colors hover:text-mist hover:underline"
        >
          Add your name and choose an avatar
        </a>
      )}
    </header>
  );
}
