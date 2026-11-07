import { useContext } from 'react';
import { WorkspaceContext, type WorkspaceValue } from '@/context/WorkspaceContext';
import type { OrlinaWorkspace } from '@/types/orlina';

export function useWorkspace(): WorkspaceValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return value;
}

export function useReadyWorkspace(): WorkspaceValue & { workspace: OrlinaWorkspace } {
  const value = useWorkspace();
  if (!value.workspace) throw new Error('Workspace is not loaded yet');
  return { ...value, workspace: value.workspace };
}
