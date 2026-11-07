import { viewHref } from '@/config/navigation';
import { formatRelativeTime } from '@/lib/formatTime';
import { DashboardSection, sectionLinkClassName } from '@/components/dashboard/DashboardSection';
import type { Conversation } from '@/types/orlina';

const VISIBLE_COUNT = 5;

export function RecentConversations({ conversations }: { conversations: Conversation[] }) {
  return (
    <DashboardSection
      title="Recent conversations"
      action={
        <a href={viewHref('conversations')} className={sectionLinkClassName}>
          View all
        </a>
      }
    >
      {conversations.length === 0 ? (
        <p className="py-6 text-sm text-muted">No conversations yet. Start one above and it will appear here.</p>
      ) : (
        <ul className="divide-y divide-line">
          {conversations.slice(0, VISIBLE_COUNT).map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            return (
              <li key={conversation.id}>
                <a
                  href={viewHref('conversations')}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-3.5 transition-colors duration-200"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink transition-colors group-hover:text-mint">{conversation.title}</p>
                    <p className="mt-1 truncate text-sm text-muted">{lastMessage?.text ?? 'No messages yet'}</p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-muted">{formatRelativeTime(conversation.updatedAt)}</p>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
}
