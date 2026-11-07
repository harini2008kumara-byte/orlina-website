import { WorkspaceGate } from '@/components/layout/WorkspaceGate';
import { MemoryList } from '@/components/memory/MemoryList';
import { useWorkspace } from '@/hooks/useWorkspace';

export function MemoryPage() {
  const { deleteMemory } = useWorkspace();

  return (
    <div className="space-y-12">
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Memory</p>
        <h1 className="text-4xl text-ink sm:text-5xl">What ORLINA remembers</h1>
        <p className="text-base leading-normal text-muted">
          Details gathered from your conversations. Review them, and forget anything you no longer want kept.
        </p>
      </header>

      <WorkspaceGate>
        {(workspace) => <MemoryList memories={workspace.memories} onDelete={deleteMemory} />}
      </WorkspaceGate>
    </div>
  );
}
