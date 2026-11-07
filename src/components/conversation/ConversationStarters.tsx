import { cn } from '@/lib/cn';

const CONVERSATION_STARTERS = [
  'Help me make a decision',
  'Understand a difficult situation',
  'Organise my thoughts',
  'Plan my next quarter',
];

interface ConversationStartersProps {
  onPick: (text: string) => void;
  className?: string;
}

export function ConversationStarters({ onPick, className }: ConversationStartersProps) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Conversation starters">
      {CONVERSATION_STARTERS.map((starter) => (
        <li key={starter}>
          <button
            type="button"
            onClick={() => onPick(starter)}
            className="rounded-full border border-line bg-canvas/40 px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent hover:bg-panel hover:text-ink active:scale-[0.98]"
          >
            {starter}
          </button>
        </li>
      ))}
    </ul>
  );
}
