import { useState } from 'react';
import { ConversationComposer } from '@/components/conversation/ConversationComposer';
import { ConversationList } from '@/components/conversation/ConversationList';
import { ConversationStarters } from '@/components/conversation/ConversationStarters';
import { MessageThread } from '@/components/conversation/MessageThread';
import { TurnErrorNotice } from '@/components/conversation/TurnErrorNotice';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWorkspace } from '@/hooks/useWorkspace';

export function ConversationsPage() {
  const {
    status,
    workspace,
    reload,
    createConversation,
    sendMessage,
    replyingConversationIds,
    activeConversationId,
    selectConversation,
    turnError,
    retryTurn,
  } = useWorkspace();
  const [draft, setDraft] = useState('');

  if (status === 'loading') {
    return (
      <div aria-busy="true" className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (status === 'error' || !workspace) {
    return (
      <EmptyState
        scene="error"
        title="We couldn't load your conversations"
        description="Something went wrong on our side. Please try again in a moment."
        action={
          <Button variant="primary" size="sm" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }

  const conversations = workspace.conversations;
  const active = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0] ?? null;
  const replying = active ? replyingConversationIds.includes(active.id) : false;
  const showStarters = !active || active.messages.length === 0;

  const visibleTurnError = turnError && active && turnError.conversationId === active.id ? turnError : null;

  const handleSend = (text: string) => {
    const conversationId = active && !workspace.isSample ? active.id : createConversation();
    void sendMessage(conversationId, text);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <aside className="flex max-h-72 flex-col lg:max-h-[calc(100dvh-9rem)] lg:sticky lg:top-24">
        <ConversationList
          conversations={conversations}
          activeId={active?.id ?? null}
          onSelect={selectConversation}
          onCreate={createConversation}
        />
      </aside>

      <section className="flex min-w-0 flex-col gap-5">
        <header className="min-w-0">
          <h1 className="truncate text-2xl text-ink sm:text-3xl">{active?.title ?? 'New conversation'}</h1>
          <p className="mt-2 text-sm leading-normal text-muted">Ask a question, think out loud, or speak your thoughts.</p>
        </header>

        <div className="flex min-h-[18rem] flex-1 flex-col gap-6 md:min-h-[24rem]">
          <div className="min-h-[16rem] flex-1 md:min-h-[20rem]">
            <MessageThread messages={active?.messages ?? []} replying={replying} />
          </div>
          {showStarters && <ConversationStarters onPick={setDraft} />}
        </div>

        {visibleTurnError && <TurnErrorNotice message={visibleTurnError.message} onRetry={() => void retryTurn()} />}

        <ConversationComposer
          label="Your message to ORLINA"
          placeholder="Describe the situation, the choice in front of you, or what has been on your mind..."
          value={draft}
          onChange={setDraft}
          onSend={handleSend}
          rows={3}
        />
      </section>
    </div>
  );
}
