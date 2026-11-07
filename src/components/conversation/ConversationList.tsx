import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/formatTime';
import { Button } from '@/components/ui/Button';
import type { Conversation } from '@/types/orlina';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function ConversationList({ conversations, activeId, onSelect, onCreate }: ConversationListProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <Button variant="secondary" onClick={onCreate} className="w-full justify-start">
        <Plus className="h-4 w-4" aria-hidden="true" />
        New conversation
      </Button>

      {conversations.length === 0 ? (
        <p className="px-1 text-sm leading-normal text-muted">Your conversations will be listed here.</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Conversation history">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeId;
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative w-full rounded-xl px-3 py-2.5 text-left transition-colors duration-200',
                    isActive ? 'bg-panel text-ink' : 'text-muted hover:bg-panel/60 hover:text-ink',
                  )}
                >
                  {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-mint" aria-hidden="true" />}
                  <span className="block truncate text-sm font-medium">{conversation.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">{formatRelativeTime(conversation.updatedAt)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
