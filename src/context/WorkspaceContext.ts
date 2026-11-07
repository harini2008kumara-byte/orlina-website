import { createContext } from 'react';
import type {
  AvatarId,
  DecisionStatus,
  OrlinaWorkspace,
  ProfilePatch,
} from '@/types/orlina';

export type TurnError = {
  conversationId: string;
  message: string;
} & (
  | { stage: 'save'; messageId: string; text: string }
  | { stage: 'reply' }
);

export interface WorkspaceValue {
  status: 'loading' | 'error' | 'ready';
  workspace: OrlinaWorkspace | null;
  replyingConversationIds: string[];
  activeConversationId: string | null;
  turnError: TurnError | null;
  retryTurn: () => Promise<void>;
  selectConversation: (id: string) => void;
  reload: () => void;
  createConversation: () => string;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  setDecisionStatus: (id: string, status: DecisionStatus) => void;
  addTask: (title: string, dueAt: string) => void;
  toggleTask: (id: string) => void;
  deleteMemory: (id: string) => void;
  updateProfile: (patch: ProfilePatch) => void;
  markNotificationsRead: (id: string | null) => void;
  avatar: AvatarId;
}

export const WorkspaceContext = createContext<WorkspaceValue | null>(null);
