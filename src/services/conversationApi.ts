import type { ChatMessage, Conversation } from '@/types/orlina';

const API_BASE_URL = (
  import.meta.env.VITE_ORLINA_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const USER_ID = 'u1';
const pendingMessages = new Map<string, string>();

async function apiRequest(path: string, options: RequestInit = {}): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach ORLINA backend. Check that the backend is running.');
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? String(data.error)
        : `Request failed (${response.status}).`;
    throw new Error(message);
  }

  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const data = await apiRequest(`/api/conversations?userId=${USER_ID}`);

  if (!Array.isArray(data)) {
    throw new Error('ORLINA returned an unexpected conversation list.');
  }

  return data.map((item) => {
    const conversation = item as Record<string, unknown>;

    return {
      id: String(conversation.id),
      title: String(conversation.title || 'New conversation'),
      updatedAt: String(conversation.created_at || new Date().toISOString()),
      messages: [],
    };
  });
}

export async function saveUserMessage(
  conversationId: string,
  _messageId: string,
  text: string,
): Promise<void> {
  pendingMessages.set(conversationId, text);
}

export async function requestReply(conversationId: string): Promise<ChatMessage> {
  const message = pendingMessages.get(conversationId);

  if (!message) {
    throw new Error('Message not found. Please send it again.');
  }

  const data = await apiRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      userId: USER_ID,
      conversationId,
      message,
    }),
  });

  if (typeof data !== 'object' || data === null || !('reply' in data)) {
    throw new Error('ORLINA returned an unexpected reply.');
  }

  pendingMessages.delete(conversationId);

  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    text: String(data.reply),
    createdAt: new Date().toISOString(),
  };
}
