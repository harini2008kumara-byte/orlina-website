import { getDeviceId } from '@/lib/deviceId';
import type { ChatMessage, Conversation } from '@/types/orlina';

const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;
const NOT_CONFIGURED = 'ORLINA is not connected to its database yet. Check the Supabase connection and reload.';
const INVALID_RESPONSE = 'ORLINA returned an unexpected response. Please try again.';

type RequestBody = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function callChatFunction(body: RequestBody): Promise<unknown> {
  if (!SUPABASE_URL || !ANON_KEY) throw new Error(NOT_CONFIGURED);
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/orlina-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ ...body, deviceId: getDeviceId() }),
    });
  } catch {
    throw new Error('We could not reach ORLINA. Check your connection and try again.');
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isRecord(data) && typeof data.error === 'string' ? data.error : `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return data;
}

function parseMessage(value: unknown): ChatMessage {
  if (!isRecord(value)) throw new Error(INVALID_RESPONSE);
  const { id, text, createdAt } = value;
  const role = value.role;
  if (typeof id !== 'string' || typeof text !== 'string' || typeof createdAt !== 'string') throw new Error(INVALID_RESPONSE);
  if (role !== 'user' && role !== 'assistant') throw new Error(INVALID_RESPONSE);
  return { id, role, text, createdAt };
}

function parseConversation(value: unknown): Conversation {
  if (!isRecord(value)) throw new Error(INVALID_RESPONSE);
  const { id, title, updatedAt, messages } = value;
  if (typeof id !== 'string' || typeof title !== 'string' || typeof updatedAt !== 'string' || !Array.isArray(messages)) {
    throw new Error(INVALID_RESPONSE);
  }
  return { id, title, updatedAt, messages: messages.map(parseMessage) };
}

export async function listConversations(): Promise<Conversation[]> {
  const data = await callChatFunction({ action: 'list' });
  if (!isRecord(data) || !Array.isArray(data.conversations)) throw new Error(INVALID_RESPONSE);
  return data.conversations.map(parseConversation);
}

export async function saveUserMessage(conversationId: string, messageId: string, text: string): Promise<void> {
  await callChatFunction({ action: 'send', conversationId, messageId, text });
}

export async function requestReply(conversationId: string): Promise<ChatMessage> {
  const data = await callChatFunction({ action: 'reply', conversationId });
  if (!isRecord(data)) throw new Error(INVALID_RESPONSE);
  return parseMessage(data.message);
}
