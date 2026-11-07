import { Button } from '@/components/ui/Button';

interface TurnErrorNoticeProps {
  message: string;
  onRetry: () => void;
}

export function TurnErrorNotice({ message, onRetry }: TurnErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3"
    >
      <p className="text-sm leading-normal text-ink">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
