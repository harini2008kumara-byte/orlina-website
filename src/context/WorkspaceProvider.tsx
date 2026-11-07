import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { WorkspaceContext, type TurnError, type WorkspaceValue } from '@/context/WorkspaceContext';
import { createId } from '@/lib/id';
import { titleFromText } from '@/lib/text';
import { saveProfile } from '@/lib/profileStorage';
import { requestReply, saveUserMessage } from '@/services/conversationApi';
import { fetchWorkspace } from '@/services/orlinaService';
import type {
  ChatMessage,
  DecisionStatus,
  OrlinaWorkspace,
  ProfilePatch,
} from '@/types/orlina';

const NEW_CONVERSATION_TITLE = 'New conversation';
const FALLBACK_ERROR = 'Something went wrong. Please try again.';

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : FALLBACK_ERROR;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; workspace: OrlinaWorkspace };

type WorkspaceChange = (workspace: OrlinaWorkspace) => OrlinaWorkspace;

function appendMessage(
  workspace: OrlinaWorkspace,
  conversationId: string,
  message: ChatMessage,
): OrlinaWorkspace {
  return {
    ...workspace,
    conversations: workspace.conversations.map((conversation) => {
      if (conversation.id !== conversationId) return conversation;
      const isFirstUserMessage = conversation.messages.length === 0 && message.role === 'user';
      return {
        ...conversation,
        title: isFirstUserMessage ? titleFromText(message.text) : conversation.title,
        updatedAt: message.createdAt,
        messages: [...conversation.messages, message],
      };
    }),
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [replyingConversationIds, setReplyingConversationIds] = useState<string[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [turnError, setTurnError] = useState<TurnError | null>(null);

  const load = useCallback(() => {
    setState({ status: 'loading' });
    fetchWorkspace().then(
      (workspace) => setState({ status: 'ready', workspace }),
      () => setState({ status: 'error' }),
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = useCallback((apply: WorkspaceChange) => {
    setState((prev) =>
      prev.status === 'ready' ? { status: 'ready', workspace: apply(prev.workspace) } : prev,
    );
  }, []);

  const createConversation = useCallback(() => {
    const id = createId();
    const now = new Date().toISOString();
    change((workspace) => ({
      ...workspace,
      conversations: [
        { id, title: NEW_CONVERSATION_TITLE, updatedAt: now, messages: [] },
        ...workspace.conversations,
      ],
    }));
    setActiveConversationId(id);
    return id;
  }, [change]);

  const selectConversation = useCallback((id: string) => setActiveConversationId(id), []);

  const replyTo = useCallback(
    async (conversationId: string) => {
      setReplyingConversationIds((ids) => [...ids, conversationId]);
      try {
        const reply = await requestReply(conversationId);
        change((workspace) => appendMessage(workspace, conversationId, reply));
        setTurnError(null);
      } catch (error) {
        setTurnError({ stage: 'reply', conversationId, message: errorMessage(error) });
      } finally {
        setReplyingConversationIds((ids) => ids.filter((id) => id !== conversationId));
      }
    },
    [change],
  );

  const saveAndReply = useCallback(
    async (conversationId: string, messageId: string, text: string) => {
      try {
        await saveUserMessage(conversationId, messageId, text);
      } catch (error) {
        setTurnError({ stage: 'save', conversationId, messageId, text, message: errorMessage(error) });
        return;
      }
      await replyTo(conversationId);
    },
    [replyTo],
  );

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      const messageId = createId();
      change((workspace) =>
        appendMessage(workspace, conversationId, {
          id: messageId,
          role: 'user',
          text,
          createdAt: new Date().toISOString(),
        }),
      );
      setTurnError(null);
      await saveAndReply(conversationId, messageId, text);
    },
    [change, saveAndReply],
  );

  const retryTurn = useCallback(async () => {
    if (!turnError) return;
    setTurnError(null);
    if (turnError.stage === 'save') {
      await saveAndReply(turnError.conversationId, turnError.messageId, turnError.text);
    } else {
      await replyTo(turnError.conversationId);
    }
  }, [turnError, replyTo, saveAndReply]);

  const setDecisionStatus = useCallback(
    (id: string, status: DecisionStatus) => {
      change((workspace) => ({
        ...workspace,
        decisions: workspace.decisions.map((decision) =>
          decision.id === id ? { ...decision, status } : decision,
        ),
      }));
    },
    [change],
  );

  const addTask = useCallback(
    (title: string, dueAt: string) => {
      change((workspace) => ({
        ...workspace,
        tasks: [{ id: createId(), title, dueAt, completed: false }, ...workspace.tasks],
      }));
    },
    [change],
  );

  const toggleTask = useCallback(
    (id: string) => {
      change((workspace) => ({
        ...workspace,
        tasks: workspace.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      }));
    },
    [change],
  );

  const deleteMemory = useCallback(
    (id: string) => {
      change((workspace) => {
        const remaining = workspace.memories.filter((memory) => memory.id !== id);
        const removed = remaining.length < workspace.memories.length;
        return {
          ...workspace,
          memories: remaining,
          memoryCount: removed ? Math.max(0, workspace.memoryCount - 1) : workspace.memoryCount,
        };
      });
    },
    [change],
  );

  const updateProfile = useCallback(
    (patch: ProfilePatch) => {
      change((workspace) => {
        const profile = { ...workspace.profile, ...patch };
        saveProfile(profile);
        return { ...workspace, profile };
      });
    },
    [change],
  );

  const markNotificationsRead = useCallback(
    (id: string | null) => {
      change((workspace) => ({
        ...workspace,
        notifications: workspace.notifications.map((item) =>
          id === null || item.id === id ? { ...item, read: true } : item,
        ),
      }));
    },
    [change],
  );

  const workspace = state.status === 'ready' ? state.workspace : null;
  const avatar = workspace?.profile.avatar ?? 'neutral';

  const value = useMemo<WorkspaceValue>(
    () => ({
      status: state.status,
      workspace,
      avatar,
      replyingConversationIds,
      activeConversationId,
      turnError,
      retryTurn,
      selectConversation,
      reload: load,
      createConversation,
      sendMessage,
      setDecisionStatus,
      addTask,
      toggleTask,
      deleteMemory,
      updateProfile,
      markNotificationsRead,
    }),
    [
      state.status,
      workspace,
      avatar,
      replyingConversationIds,
      activeConversationId,
      turnError,
      retryTurn,
      selectConversation,
      load,
      createConversation,
      sendMessage,
      setDecisionStatus,
      addTask,
      toggleTask,
      deleteMemory,
      updateProfile,
      markNotificationsRead,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
