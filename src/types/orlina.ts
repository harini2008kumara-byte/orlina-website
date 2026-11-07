export type DecisionStatus = 'pending' | 'decided' | 'deferred';

export type MemoryKind = 'fact' | 'preference' | 'commitment' | 'person';

export type AvatarId = 'girl' | 'boy' | 'neutral';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  status: DecisionStatus;
  dueAt: string | null;
}

export interface Task {
  id: string;
  title: string;
  dueAt: string;
  completed: boolean;
}

export interface MemoryItem {
  id: string;
  kind: MemoryKind;
  summary: string;
  savedAt: string;
  conversationId: string | null;
}

export type MemoryMapNodeKind = 'person' | 'topic' | 'decision';

export interface MemoryMapNode {
  id: string;
  label: string;
  kind: MemoryMapNodeKind;
  x: number;
  y: number;
}

export interface MemoryMapLink {
  from: string;
  to: string;
}

export interface UserProfile {
  name: string;
  avatar: AvatarId;
}

export type ProfilePatch = Partial<UserProfile>;

export interface AppNotification {
  id: string;
  title: string;
  createdAt: string;
  href: string;
  read: boolean;
}

export interface WorkspaceContent {
  notifications: AppNotification[];
  conversations: Conversation[];
  decisions: Decision[];
  tasks: Task[];
  memories: MemoryItem[];
  memoryCount: number;
  memoryMap: { nodes: MemoryMapNode[]; links: MemoryMapLink[] };
}

export interface OrlinaWorkspace extends WorkspaceContent {
  profile: UserProfile;
  isSample: boolean;
}
