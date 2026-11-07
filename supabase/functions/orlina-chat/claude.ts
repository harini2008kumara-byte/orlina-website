import { HttpError } from "./http.ts";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const CLAUDE_MODEL = "claude-sonnet-4-6";
const MAX_REPLY_TOKENS = 1024;

const SYSTEM_PROMPT = `You are ORLINA, a calm personal intelligence workspace that helps the user think clearly, weigh decisions and move forward.
Reply in warm, plain language. Keep answers focused and reasonably short.
When the situation is unclear, ask one useful question rather than several.
Only rely on what the user has told you in this conversation. Do not invent facts about their life.`;

export interface ReplyTurn {
  role: "user" | "assistant";
  content: string;
}

function toAlternatingTurns(turns: ReplyTurn[]): ReplyTurn[] {
  const merged: ReplyTurn[] = [];
  for (const turn of turns) {
    const last = merged[merged.length - 1];
    if (last && last.role === turn.role) {
      last.content = `${last.content}\n\n${turn.content}`;
    } else {
      merged.push({ ...turn });
    }
  }
  while (merged.length > 0 && merged[0].role !== "user") merged.shift();
  return merged;
}

export async function generateReply(history: ReplyTurn[]): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new HttpError(503, "ORLINA is not configured yet.");

  const messages = toAlternatingTurns(history);
  if (messages.length === 0) throw new HttpError(409, "There is no message to reply to.");

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_REPLY_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
  } catch (error) {
    console.error("Claude request could not be sent", error);
    throw new HttpError(502, "ORLINA could not reply just now. Please try again.");
  }

  if (!response.ok) {
    console.error("Claude request rejected", response.status);
    throw new HttpError(502, "ORLINA could not reply just now. Please try again.");
  }

  const data = (await response.json()) as { content?: { type?: string; text?: unknown }[] };
  const text = (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text as string)
    .join("")
    .trim();

  if (!text) throw new HttpError(502, "ORLINA could not reply just now. Please try again.");
  return text;
}
