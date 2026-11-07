import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { generateReply } from "./claude.ts";
import { HttpError, corsHeaders, json } from "./http.ts";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_CONTEXT_MESSAGES = 40;
const MAX_CONVERSATIONS = 50;
const DAILY_REPLY_LIMIT = 300;
const HOURLY_SEND_LIMIT = 120;
const DEFAULT_TITLE = "New conversation";
const TITLE_LENGTH = 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

function readUuid(value: unknown, label: string): string {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new HttpError(400, `Invalid ${label}.`);
  }
  return value;
}

function readText(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new HttpError(400, "Please write a message first.");
  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new HttpError(400, `Messages can be up to ${MAX_MESSAGE_LENGTH} characters.`);
  }
  return text;
}

function titleFrom(text: string): string {
  const singleLine = text.replace(/\s+/g, " ");
  return singleLine.length > TITLE_LENGTH ? `${singleLine.slice(0, TITLE_LENGTH - 3)}...` : singleLine;
}

async function assertOwnsConversation(conversationId: string, deviceId: string): Promise<void> {
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("device_id", deviceId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, "That conversation could not be found.");
}

async function listConversations(deviceId: string) {
  const { data: conversations, error } = await supabase
    .from("chat_conversations")
    .select("id, title, updated_at")
    .eq("device_id", deviceId)
    .order("updated_at", { ascending: false })
    .limit(MAX_CONVERSATIONS);
  if (error) throw error;
  if (!conversations || conversations.length === 0) return { conversations: [] };

  const { data: messages, error: messageError } = await supabase
    .from("chat_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("device_id", deviceId)
    .in("conversation_id", conversations.map((conversation) => conversation.id))
    .order("created_at", { ascending: true });
  if (messageError) throw messageError;

  const byConversation = new Map<string, { id: string; role: string; text: string; createdAt: string }[]>();
  for (const message of messages ?? []) {
    const list = byConversation.get(message.conversation_id) ?? [];
    list.push({ id: message.id, role: message.role, text: message.content, createdAt: message.created_at });
    byConversation.set(message.conversation_id, list);
  }

  return {
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      updatedAt: conversation.updated_at,
      messages: byConversation.get(conversation.id) ?? [],
    })),
  };
}

async function saveUserMessage(deviceId: string, conversationId: string, messageId: string, text: string) {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: sentCount, error: sentError } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("device_id", deviceId)
    .eq("role", "user")
    .gte("created_at", hourAgo);
  if (sentError) throw sentError;
  if ((sentCount ?? 0) >= HOURLY_SEND_LIMIT) {
    throw new HttpError(429, "You are sending messages quickly. Please wait a few minutes and try again.");
  }

  const { error: conversationError } = await supabase
    .from("chat_conversations")
    .upsert({ id: conversationId, device_id: deviceId }, { onConflict: "id", ignoreDuplicates: true });
  if (conversationError) throw conversationError;

  await assertOwnsConversation(conversationId, deviceId);

  const { error: titleError } = await supabase
    .from("chat_conversations")
    .update({ title: titleFrom(text) })
    .eq("id", conversationId)
    .eq("device_id", deviceId)
    .eq("title", DEFAULT_TITLE);
  if (titleError) throw titleError;

  const createdAt = new Date().toISOString();
  const { error: messageError } = await supabase
    .from("chat_messages")
    .upsert(
      { id: messageId, conversation_id: conversationId, device_id: deviceId, role: "user", content: text, created_at: createdAt },
      { onConflict: "id", ignoreDuplicates: true },
    );
  if (messageError) throw messageError;

  await touchConversation(conversationId, deviceId, createdAt);
  return { id: messageId, role: "user", text, createdAt };
}

async function touchConversation(conversationId: string, deviceId: string, updatedAt: string) {
  const { error } = await supabase
    .from("chat_conversations")
    .update({ updated_at: updatedAt })
    .eq("id", conversationId)
    .eq("device_id", deviceId);
  if (error) throw error;
}

async function replyToConversation(deviceId: string, conversationId: string) {
  await assertOwnsConversation(conversationId, deviceId);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("device_id", deviceId)
    .eq("role", "assistant")
    .gte("created_at", since);
  if (countError) throw countError;
  if ((count ?? 0) >= DAILY_REPLY_LIMIT) {
    throw new HttpError(429, "You have reached today's limit. Please come back tomorrow.");
  }

  const { data: recent, error: historyError } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(MAX_CONTEXT_MESSAGES);
  if (historyError) throw historyError;

  const history = (recent ?? []).reverse().map((message) => ({
    role: message.role as "user" | "assistant",
    content: message.content as string,
  }));
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    throw new HttpError(409, "There is no new message to reply to.");
  }

  const replyText = await generateReply(history);

  const createdAt = new Date().toISOString();
  const replyId = crypto.randomUUID();
  const { error: insertError } = await supabase.from("chat_messages").insert({
    id: replyId,
    conversation_id: conversationId,
    device_id: deviceId,
    role: "assistant",
    content: replyText,
    created_at: createdAt,
  });
  if (insertError) throw insertError;

  await touchConversation(conversationId, deviceId, createdAt);
  return { id: replyId, role: "assistant", text: replyText, createdAt };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") throw new HttpError(405, "Method not allowed.");

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      throw new HttpError(400, "Invalid request.");
    }

    const deviceId = readUuid(body.deviceId, "device");

    switch (body.action) {
      case "list":
        return json(await listConversations(deviceId));
      case "send": {
        const conversationId = readUuid(body.conversationId, "conversation");
        const messageId = readUuid(body.messageId, "message");
        const message = await saveUserMessage(deviceId, conversationId, messageId, readText(body.text));
        return json({ message });
      }
      case "reply": {
        const conversationId = readUuid(body.conversationId, "conversation");
        return json({ message: await replyToConversation(deviceId, conversationId) });
      }
      default:
        throw new HttpError(400, "Unknown request.");
    }
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error("orlina-chat failed", error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
