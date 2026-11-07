import { useState } from 'react';
import { viewHref } from '@/config/navigation';
import { navigateTo } from '@/lib/navigate';
import { Button } from '@/components/ui/Button';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConversationComposer } from '@/components/conversation/ConversationComposer';
import { ConversationStarters } from '@/components/conversation/ConversationStarters';
import { MemoryActivity } from '@/components/dashboard/MemoryActivity';
import { OverviewHeading } from '@/components/dashboard/OverviewHeading';
import { OverviewStats } from '@/components/dashboard/OverviewStats';
import { PendingDecisions } from '@/components/dashboard/PendingDecisions';
import { RecentConversations } from '@/components/dashboard/RecentConversations';
import { SampleDataBanner } from '@/components/dashboard/SampleDataBanner';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getFirstName } from '@/lib/text';

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your dashboard" className="space-y-12">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-5 w-64 max-w-full" />
        </div>
        <Skeleton className="h-[26rem] w-full rounded-3xl" />
      </div>
      <div className="grid gap-12 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { status, workspace, reload, createConversation, sendMessage, setDecisionStatus, toggleTask } = useWorkspace();
  const [draft, setDraft] = useState('');

  const handleStartConversation = (text: string) => {
    const conversationId = createConversation();
    void sendMessage(conversationId, text);
    navigateTo(viewHref('conversations'));
  };

  if (status === 'loading') return <DashboardSkeleton />;

  if (status === 'error' || !workspace) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
        <p className="text-base text-ink">We couldn't load your dashboard.</p>
        <p className="text-sm text-muted">Something went wrong on our side. Please try again in a moment.</p>
        <Button variant="primary" size="sm" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const openDecisions = workspace.decisions.filter((decision) => decision.status === 'pending').length;
  const openTasks = workspace.tasks.filter((task) => !task.completed).length;

  return (
    <RevealGroup className="space-y-14">
      {workspace.isSample && (
        <div data-reveal>
          <SampleDataBanner />
        </div>
      )}

      <div className="grid gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:items-start xl:gap-16">
        <div className="space-y-10 xl:pt-6">
          <div data-reveal>
            <OverviewHeading needsName={!getFirstName(workspace.profile.name)} />
          </div>
          <div data-reveal>
            <OverviewStats decisionCount={openDecisions} taskCount={openTasks} memoryCount={workspace.memoryCount} />
          </div>
        </div>

        <section aria-label="Start a conversation" className="min-w-0 space-y-5" data-reveal>
          <ConversationComposer
            label="Start a conversation"
            placeholder="What would you like to think through? Describe the situation, the choice, or what has been on your mind..."
            value={draft}
            onChange={setDraft}
            onSend={handleStartConversation}
            rows={6}
            fill
          />
          <ConversationStarters onPick={setDraft} />
        </section>
      </div>

      <div className="grid gap-12 border-t border-line pt-12 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-16">
        <div data-reveal className="min-w-0">
          <RecentConversations conversations={workspace.conversations} />
        </div>

        <div className="min-w-0 space-y-12">
          <div data-reveal>
            <PendingDecisions decisions={workspace.decisions} onChangeStatus={setDecisionStatus} />
          </div>
          <div data-reveal>
            <UpcomingTasks tasks={workspace.tasks} onToggle={toggleTask} />
          </div>
          <div data-reveal>
            <MemoryActivity memories={workspace.memories} totalCount={workspace.memoryCount} />
          </div>
        </div>
      </div>
    </RevealGroup>
  );
}
