import { MemoryMap } from '@/components/memory/MemoryMap';
import { WorkspaceGate } from '@/components/layout/WorkspaceGate';

export function MemoryMapPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Connected Memory Map</p>
        <h1 className="text-4xl text-ink sm:text-5xl">How your life connects</h1>
        <p className="text-base leading-normal text-muted">
          People, topics and decisions linked through your conversations. Hover a node to follow its connections.
        </p>
      </header>

      <WorkspaceGate>
        {(workspace) => (
          <MemoryMap nodes={workspace.memoryMap.nodes} links={workspace.memoryMap.links} />
        )}
      </WorkspaceGate>
    </div>
  );
}
