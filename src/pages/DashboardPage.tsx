
import { useState } from 'react';
import { ArrowRight, Sparkles, MessageCircle, Brain, CheckCircle2 } from 'lucide-react';
import { viewHref } from '@/config/navigation';
import { navigateTo } from '@/lib/navigate';
import { Button } from '@/components/ui/Button';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConversationComposer } from '@/components/conversation/ConversationComposer';
import { ConversationStarters } from '@/components/conversation/ConversationStarters';
import { MemoryActivity } from '@/components/dashboard/MemoryActivity';
import { OverviewStats } from '@/components/dashboard/OverviewStats';
import { PendingDecisions } from '@/components/dashboard/PendingDecisions';
import { RecentConversations } from '@/components/dashboard/RecentConversations';
import { SampleDataBanner } from '@/components/dashboard/SampleDataBanner';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getFirstName } from '@/lib/text';

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your dashboard" className="space-y-8">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <Skeleton className="h-72 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}

export function DashboardPage() {
  const {
    status,
    workspace,
    reload,
    createConversation,
    sendMessage,
    setDecisionStatus,
    toggleTask,
  } = useWorkspace();

  const [draft, setDraft] = useState('');

  const handleStartConversation = (text: string) => {
    const conversationId = createConversation();
    void sendMessage(conversationId, text);
    navigateTo(viewHref('conversations'));
  };

  if (status === 'loading') return <DashboardSkeleton />;

  if (status === 'error' || !workspace) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <p className="text-base font-semibold text-white">We couldn't load your workspace.</p>
        <p className="mt-2 text-sm text-slate-400">
          Please check your connection and try again.
        </p>
        <Button variant="primary" size="sm" onClick={reload} className="mt-5">
          Try again
        </Button>
      </div>
    );
  }

  const openDecisions = workspace.decisions.filter(
    (decision) => decision.status === 'pending'
  ).length;

  const openTasks = workspace.tasks.filter((task) => !task.completed).length;

  return (
    <RevealGroup className="space-y-10">
      {workspace.isSample && (
        <div data-reveal>
          <SampleDataBanner />
        </div>
      )}

      <section
        data-reveal
        className="relative overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-[#21183e]/90 via-[#15172e]/95 to-[#101a35]/95 p-6 shadow-[0_20px_70px_rgba(60,40,130,0.18)] sm:p-9"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            A space that understands you
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Your thoughts,
            <span className="block bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
              understood.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            A space to think, decide and move forward. Talk through what's on your mind
            and turn meaningful conversations into something you can act on.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-violet-300" />
              Meaningful conversations
            </span>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <span className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-300" />
              Remember what matters
            </span>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Move forward
            </span>
          </div>
        </div>
      </section>

      <section data-reveal className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Your space
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
            {getFirstName(workspace.profile.name)
              ? `Welcome, ${getFirstName(workspace.profile.name)}`
              : 'What would you like to explore today?'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Start wherever your thoughts take you.
          </p>
        </div>

        <div className="glass-panel glow-purple rounded-3xl p-4 sm:p-6">
          <ConversationComposer
            label="Start a conversation"
            placeholder="Tell ORLINA what's on your mind..."
            value={draft}
            onChange={setDraft}
            onSend={handleStartConversation}
            rows={5}
            fill
          />
          <div className="mt-4">
            <ConversationStarters onPick={setDraft} />
          </div>
        </div>
      </section>

      <section data-reveal>
        <OverviewStats
          decisionCount={openDecisions}
          taskCount={openTasks}
          memoryCount={workspace.memoryCount}
        />
      </section>

      <section className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div data-reveal className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <RecentConversations conversations={workspace.conversations} />
        </div>

        <div className="min-w-0 space-y-8">
          <div data-reveal className="glass-panel rounded-3xl p-5 sm:p-6">
            <PendingDecisions
              decisions={workspace.decisions}
              onChangeStatus={setDecisionStatus}
            />
          </div>

          <div data-reveal className="glass-panel rounded-3xl p-5 sm:p-6">
            <UpcomingTasks tasks={workspace.tasks} onToggle={toggleTask} />
          </div>

          <div data-reveal className="glass-panel rounded-3xl p-5 sm:p-6">
            <MemoryActivity
              memories={workspace.memories}
              totalCount={workspace.memoryCount}
            />
          </div>
        </div>
      </section>
    </RevealGroup>
  );
}
