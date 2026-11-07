// ORLINA backend - integration hub (Member 4)
// Flow for every chat message: Memory agent (recall) -> Conversation agent (Claude)
//   -> Memory agent (retain) -> Decision agent (if a decision is detected).
// Every external service has a fallback, so the demo never crashes.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ---------- tiny persistent store (data.json) ----------
const FILE = "data.json";
let DB = { memories: [], conversations: [], decisions: [], tasks: [], boards: [], deletedTexts: [] };
try { DB = { ...DB, ...JSON.parse(fs.readFileSync(FILE, "utf8")) }; } catch {}
const save = () => { try { fs.writeFileSync(FILE, JSON.stringify(DB, null, 2)); } catch {} };
const id = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const now = () => new Date().toISOString();

// ---------- Claude (Member 2 can replace/extend this) ----------
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.search(/[\[{]/);
  return JSON.parse(start > 0 ? clean.slice(start) : clean);
}
async function askOpenAICompatible({ system, user, json, fallback }) {
  // Used when there is no Anthropic key but Member 1's provider settings (AI_BASE_URL / AI_MODEL / AI_API_KEY) are set.
  try {
    const base = process.env.AI_BASE_URL.replace(/\/+$/, "");
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", ...(process.env.AI_API_KEY ? { Authorization: `Bearer ${process.env.AI_API_KEY}` } : {}) },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          { role: "system", content: json ? system + "\nReturn ONLY valid JSON. No markdown, no preamble." : system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!r.ok) throw new Error(`AI provider HTTP ${r.status}`);
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content?.trim() || "";
    return { data: json ? parseJSON(text) : text, mode: "provider" };
  } catch (e) {
    console.error("AI provider error:", e.message);
    return { data: fallback, mode: "stub", error: e.message };
  }
}

async function ask({ system, user, json = false, fallback, max = 1200 }) {
  if (!process.env.GEMINI_API_KEY) {
    return { data: fallback, mode: "stub" };
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }]
          },
          contents: [{
            role: "user",
            parts: [{ text: user }]
          }],
          generationConfig: {
            maxOutputTokens: max,
            ...(json ? { responseMimeType: "application/json" } : {})
          }
        })
      }
    );

    if (!r.ok) {
      const errorBody = await r.text();
      throw new Error(`Gemini HTTP ${r.status}: ${errorBody}`);
    }

    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n");

    if (!text) throw new Error("Gemini returned an empty response");

    return {
      data: json ? parseJSON(text) : text,
      mode: "gemini"
    };

  } catch (e) {
    console.error("Gemini error:", e.message);
    return { data: fallback, mode: "stub", error: e.message };
  }
}


// ---------- Hindsight (Member 3 can replace/extend this) ----------
let hs = null;
try {
  if (process.env.HINDSIGHT_API_URL) {
    const { HindsightClient } = require("@vectorize-io/hindsight-client");
    hs = new HindsightClient({
      baseUrl: process.env.HINDSIGHT_API_URL,
      ...(process.env.HINDSIGHT_API_KEY ? { apiKey: process.env.HINDSIGHT_API_KEY } : {}),
    });
  }
} catch (e) { console.error("Hindsight client not available:", e.message); }
// If HINDSIGHT_BANK_ID is set, every user shares that existing bank (users are separated by tags on new memories).
const bank = (userId) => process.env.HINDSIGHT_BANK_ID || `orlina-${userId}`;

async function retain(userId, item) {
  // item: { text, type, confidence }  confidence = confirmed | inferred | uncertain
  const rec = { id: id("mem"), userId, createdAt: now(), hindsight: false, ...item };
  if (hs) {
    try {
      await hs.retain(bank(userId), rec.text, {
        context: rec.type,
        tags: [`user:${userId}`, `type:${rec.type}`, `confidence:${rec.confidence}`],
      });
      rec.hindsight = true;
    } catch (e) { console.error("Hindsight retain failed:", e.message); }
  }
  DB.memories.push(rec); save();
  return rec;
}
function localRecall(userId, query, k = 5) {
  const words = new Set(query.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  return DB.memories
    .filter((m) => m.userId === userId)
    .map((m) => ({ m, s: m.text.toLowerCase().split(/\W+/).filter((w) => words.has(w)).length }))
    .sort((a, b) => b.s - a.s || (b.m.createdAt > a.m.createdAt ? 1 : -1))
    .slice(0, k).map((x) => x.m.text);
}
async function recall(userId, query) {
  if (hs) {
    try {
      const r = await hs.recall(bank(userId), query);
      const texts = (r.results || []).map((x) => x.text).filter((t) => !DB.deletedTexts.includes(t));
      if (texts.length) return { texts: texts.slice(0, 6), source: "hindsight" };
    } catch (e) { console.error("Hindsight recall failed:", e.message); }
  }
  return { texts: localRecall(userId, query), source: "local" };
}
async function reflect(userId, query, fallbackTexts = []) {
  if (hs) {
    try { const r = await hs.reflect(bank(userId), query); if (r?.text) return { text: r.text, source: "hindsight" }; }
    catch (e) { console.error("Hindsight reflect failed:", e.message); }
  }
  return { text: fallbackTexts.join(" | "), source: "local" };
}

// ---------- the four agents (BAND agents can call these over HTTP) ----------
const STYLE = {
  simple: "Use very simple words and short sentences.",
  detailed: "Give a detailed, thorough explanation.",
  short: "Keep it very short (2-3 sentences).",
  example: "Explain with a relatable everyday-life example.",
  steps: "Explain step by step.",
  analogy: "Explain mainly through relatable analogies and real-life examples.",
  concise: "Keep it very short (2-3 sentences).",
};
const agents = {
  async memory({ userId, query }) { return recall(userId, query); },

  async conversation({ userId, message, memories, style, language, history }) {
    const system =
      `You are Orlina, a warm assistant that helps people talk, think, decide, act and remember. ` +
      `Support decisions, never make important personal decisions for the user. ` +
      `Do not assume how the user feels; ask when unclear. ` +
      `${STYLE[style] || "Adapt your explanation to how the user writes."} ` +
      `${language ? `Reply in ${language}.` : "Reply in the language the user writes in."}\n` +
      `Relevant memories (may be incomplete):\n${memories.map((m) => "- " + m).join("\n") || "(none)"}\n` +
      `Return JSON: {"reply": string, "summary": string, "decisionDetected": boolean, "decisionTitle": string|null, ` +
      `"items": [{"text": string, "type": "idea|problem|decision|task|preference", "confidence": "confirmed|inferred|uncertain"}]}. ` +
      `Only include items worth remembering long-term. Use "confirmed" only for things the user said directly.`;
    const user = `${history ? "Recent conversation:\n" + history + "\n\n" : ""}User says: ${message}`;
    const fallback = {
      reply: `(stub mode) I heard: "${message}". ${memories.length ? "I also remember: " + memories[0] : ""}`,
      summary: message.slice(0, 120),
      decisionDetected: /should i|decide|choose|option|whether/i.test(message),
      decisionTitle: message.slice(0, 60),
      items: [{ text: message, type: "idea", confidence: "confirmed" }],
    };
    return ask({ system, user, json: true, fallback });
  },

  async decision({ userId, situation, memories = [] }) {
    const system =
      "You help people think through a decision. Do NOT choose for them. Return JSON: " +
      '{"title": string, "options": [{"name": string, "pros": [string], "cons": [string]}], "questionsToConsider": [string], "comparison": string}. ' +
      "Use relevant memories if given.";
    const fallback = {
      title: situation.slice(0, 60),
      options: [
        { name: "Option A", pros: ["(stub) pro"], cons: ["(stub) con"] },
        { name: "Option B", pros: ["(stub) pro"], cons: ["(stub) con"] },
      ],
      questionsToConsider: ["What matters most to you here?"],
      comparison: "(stub) Add an Anthropic API key for real analysis.",
    };
    return ask({ system, user: `Situation: ${situation}\nMemories: ${memories.join("; ")}`, json: true, fallback });
  },

  async action({ decision }) {
    const system =
      'Turn this approved decision into 2-5 concrete tasks. Return JSON: [{"title": string, "priority": "high|medium|low", "dueInDays": number}]';
    const fallback = [{ title: `Start: ${decision.title}`, priority: "high", dueInDays: 2 }];
    return ask({ system, user: `Decision: ${decision.title}\nChosen: ${decision.chosen}\nReason: ${decision.reason || ""}`, json: true, fallback });
  },
};

// ---------- helpers ----------
const canSeeTask = (t, userId) => {
  if (!t.boardId) return t.ownerId === userId;
  const b = DB.boards.find((x) => x.id === t.boardId);
  return !!b && (b.ownerId === userId || b.members.includes(userId));
};

// ---------- health & agents ----------
app.get("/health", (req, res) =>
  res.json({ ok: true, claude: !!process.env.ANTHROPIC_API_KEY, hindsight: !!hs, model: MODEL }));
app.get("/health/hindsight", async (req, res) => { // quick live check of the Hindsight connection
  if (!hs) return res.json({ connected: false, reason: "HINDSIGHT_API_URL not set or client not installed" });
  try {
    const r = await hs.recall(bank("check"), req.query.q || "anything");
    res.json({ connected: true, bank: bank("check"), sampleMemories: (r.results || []).slice(0, 3).map((x) => x.text) });
  } catch (e) { res.json({ connected: false, bank: bank("check"), error: e.message }); }
});
app.get("/agents", (req, res) => res.json(Object.keys(agents)));
app.post("/agents/:name", async (req, res) => { // lets BAND agents call a single agent
  const a = agents[req.params.name];
  if (!a) return res.status(404).json({ error: "unknown agent" });
  try { res.json(await a(req.body)); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---------- CHAT (the core flow) ----------
app.post("/chat", async (req, res) => {
  const { userId = "u1", message, conversationId, style, language } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });
  const trace = [];
  try {
    let convo = DB.conversations.find((c) => c.id === conversationId);
    if (!convo) { convo = { id: id("conv"), userId, title: message.slice(0, 50), messages: [], summary: "", createdAt: now() }; DB.conversations.push(convo); }

    const mem = await agents.memory({ userId, query: message });
    trace.push({ agent: "memory", step: "recall", source: mem.source, found: mem.texts.length });

    const history = convo.messages.slice(-6).map((m) => `${m.role}: ${m.text}`).join("\n");
    const conv = await agents.conversation({ userId, message, memories: mem.texts, style, language, history });
    trace.push({ agent: "conversation", step: "reply", mode: conv.mode });
    const out = conv.data;

    const saved = [];
    for (const it of out.items || []) saved.push(await retain(userId, it));
    trace.push({ agent: "memory", step: "retain", saved: saved.length });

    let decision = null;
    if (out.decisionDetected) {
      const d = await agents.decision({ userId, situation: out.decisionTitle || message, memories: mem.texts });
      decision = { id: id("dec"), userId, conversationId: convo.id, status: "proposed", createdAt: now(), analysis: d.data, title: d.data.title, chosen: null, reason: null, history: [] };
      DB.decisions.push(decision);
      trace.push({ agent: "decision", step: "analysis", mode: d.mode });
    }

    convo.messages.push({ role: "user", text: message, at: now() }, { role: "orlina", text: out.reply, at: now() });
    convo.summary = out.summary || convo.summary;
    save();
    res.json({
      conversationId: convo.id, reply: out.reply, summary: out.summary,
      memoriesUsed: mem.texts, memoriesSaved: saved, decision, trace,
    });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Sorry, something went wrong on my side. Please try again.", error: e.message, trace });
  }
});

// ---------- conversations / timeline / continue / share ----------
app.get("/conversations", (req, res) => {
  const { userId = "u1", q } = req.query;
  let list = DB.conversations.filter((c) => c.userId === userId);
  if (q) list = list.filter((c) => (c.title + c.summary + c.messages.map((m) => m.text).join(" ")).toLowerCase().includes(String(q).toLowerCase()));
  res.json(list.map(({ messages, ...c }) => ({ ...c, messageCount: messages.length })).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
});
app.get("/conversations/:id", (req, res) => {
  const c = DB.conversations.find((x) => x.id === req.params.id);
  c ? res.json(c) : res.status(404).json({ error: "not found" });
});
app.post("/conversations/:id/summarize", async (req, res) => {
  const c = DB.conversations.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "not found" });
  const r = await ask({
    system: 'Summarize this conversation. Return JSON: {"summary": string, "keyPoints": [string], "decisions": [string], "actionItems": [string], "topics": [string]}',
    user: c.messages.map((m) => `${m.role}: ${m.text}`).join("\n"), json: true,
    fallback: { summary: c.summary, keyPoints: [], decisions: [], actionItems: [], topics: [] },
  });
  c.summary = r.data.summary || c.summary; save();
  res.json({ ...r.data, mode: r.mode });
});
app.post("/share", async (req, res) => { // shares ONLY a summary, never the full private chat
  const c = DB.conversations.find((x) => x.id === req.body.conversationId);
  if (!c) return res.status(404).json({ error: "not found" });
  res.json({ title: c.title, summary: c.summary, note: "Only this summary is shared, not the full conversation." });
});

// ---------- memories (view / correct / delete) ----------
app.get("/memories", (req, res) => {
  const { userId = "u1", confidence } = req.query;
  res.json(DB.memories.filter((m) => m.userId === userId && (!confidence || m.confidence === confidence)));
});
app.patch("/memories/:id", (req, res) => {
  const m = DB.memories.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "not found" });
  if (req.body.text && req.body.text !== m.text) DB.deletedTexts.push(m.text);
  Object.assign(m, req.body, { updatedAt: now() }); save(); res.json(m);
});
app.delete("/memories/:id", (req, res) => {
  const m = DB.memories.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "not found" });
  DB.deletedTexts.push(m.text);
  DB.memories = DB.memories.filter((x) => x.id !== m.id); save();
  res.json({ deleted: true });
});
app.get("/memories/ask", async (req, res) => { // natural-language memory search
  const { userId = "u1", q = "" } = req.query;
  const mem = await recall(userId, String(q));
  const r = await reflect(userId, String(q), mem.texts);
  res.json({ answer: r.text, source: r.source, memories: mem.texts });
});
app.get("/memory-map", (req, res) => { // connected memory map
  const { userId = "u1" } = req.query;
  const nodes = [], edges = [];
  DB.memories.filter((m) => m.userId === userId).forEach((m) => nodes.push({ id: m.id, kind: "memory", label: m.text, type: m.type, confidence: m.confidence }));
  DB.decisions.filter((d) => d.userId === userId).forEach((d) => {
    nodes.push({ id: d.id, kind: "decision", label: d.title, status: d.status });
    if (d.conversationId) edges.push({ from: d.id, to: d.conversationId, rel: "from conversation" });
  });
  DB.tasks.filter((t) => canSeeTask(t, userId)).forEach((t) => {
    nodes.push({ id: t.id, kind: "task", label: t.title, status: t.status });
    if (t.decisionId) edges.push({ from: t.id, to: t.decisionId, rel: "from decision" });
  });
  DB.conversations.filter((c) => c.userId === userId).forEach((c) => nodes.push({ id: c.id, kind: "conversation", label: c.title }));
  res.json({ nodes, edges });
});

// ---------- decisions ----------
app.get("/decisions", (req, res) => res.json(DB.decisions.filter((d) => d.userId === (req.query.userId || "u1"))));
app.post("/decisions", async (req, res) => {
  const { userId = "u1", situation } = req.body;
  const mem = await recall(userId, situation);
  const d = await agents.decision({ userId, situation, memories: mem.texts });
  const dec = { id: id("dec"), userId, status: "proposed", createdAt: now(), analysis: d.data, title: d.data.title, chosen: null, reason: null, history: [] };
  DB.decisions.push(dec); save(); res.json(dec);
});
app.post("/decisions/:id/approve", async (req, res) => { // chosen + reason -> tasks
  const dec = DB.decisions.find((x) => x.id === req.params.id);
  if (!dec) return res.status(404).json({ error: "not found" });
  const { chosen, reason, expectedOutcome, boardId = null, assignee = null } = req.body;
  if (dec.chosen && dec.chosen !== chosen) dec.history.push({ chosen: dec.chosen, reason: dec.reason, changedAt: now() });
  Object.assign(dec, { chosen, reason, expectedOutcome, status: "approved", approvedAt: now() });
  await retain(dec.userId, { text: `Decision: ${dec.title}. Chosen: ${chosen}. Reason: ${reason || "not given"}. Expected: ${expectedOutcome || "not given"}`, type: "decision", confidence: "confirmed" });
  const t = await agents.action({ decision: dec });
  const tasks = (t.data || []).map((x) => ({
    id: id("task"), ownerId: dec.userId, boardId, assignee, decisionId: dec.id, conversationId: dec.conversationId || null,
    title: x.title, priority: x.priority, due: new Date(Date.now() + (x.dueInDays || 3) * 864e5).toISOString().slice(0, 10),
    status: "todo", updatedAt: now(),
  }));
  DB.tasks.push(...tasks); save();
  res.json({ decision: dec, tasks });
});
app.post("/decisions/:id/change", async (req, res) => { // changed-decision history
  const dec = DB.decisions.find((x) => x.id === req.params.id);
  if (!dec) return res.status(404).json({ error: "not found" });
  dec.history.push({ chosen: dec.chosen, reason: dec.reason, changedAt: now() });
  dec.chosen = req.body.chosen; dec.reason = req.body.reason; dec.status = "changed";
  await retain(dec.userId, { text: `Decision changed: ${dec.title}. Now: ${dec.chosen}. Why: ${dec.reason}`, type: "decision", confidence: "confirmed" });
  save(); res.json(dec);
});
app.post("/decisions/:id/outcome", async (req, res) => { // outcome learning
  const dec = DB.decisions.find((x) => x.id === req.params.id);
  if (!dec) return res.status(404).json({ error: "not found" });
  dec.actualOutcome = req.body.actual; dec.status = "reviewed";
  await retain(dec.userId, { text: `Outcome of "${dec.title}": expected "${dec.expectedOutcome || "?"}", actually "${req.body.actual}"`, type: "outcome", confidence: "confirmed" });
  const r = await ask({
    system: "Compare expected and actual outcome in 2-3 sentences. State what seemed to work or not. Be tentative, do not over-claim. Plain text.",
    user: `Decision: ${dec.title}\nExpected: ${dec.expectedOutcome}\nActual: ${req.body.actual}`,
    fallback: "(stub) Compare expected vs actual here.",
  });
  dec.lesson = r.data; save();
  res.json({ decision: dec, lesson: r.data });
});

// ---------- tasks & boards ----------
app.get("/tasks", (req, res) => {
  const { userId = "u1", boardId } = req.query;
  res.json(DB.tasks.filter((t) => canSeeTask(t, userId) && (!boardId || t.boardId === boardId)));
});
app.post("/tasks", (req, res) => {
  const t = { id: id("task"), ownerId: req.body.userId || "u1", status: "todo", priority: "medium", boardId: null, updatedAt: now(), ...req.body };
  DB.tasks.push(t); save(); res.json(t);
});
app.patch("/tasks/:id", (req, res) => {
  const t = DB.tasks.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: "not found" });
  Object.assign(t, req.body, { updatedAt: now() }); save(); res.json(t);
});
app.get("/boards", (req, res) => {
  const u = req.query.userId || "u1";
  res.json(DB.boards.filter((b) => b.ownerId === u || b.members.includes(u)));
});
app.post("/boards", (req, res) => {
  const b = { id: id("board"), name: req.body.name, ownerId: req.body.userId || "u1", members: req.body.members || [], createdAt: now() };
  DB.boards.push(b); save(); res.json(b);
});
app.post("/boards/:id/invite", (req, res) => {
  const b = DB.boards.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: "not found" });
  if (!b.members.includes(req.body.memberId)) b.members.push(req.body.memberId);
  save(); res.json(b);
});

// ---------- advanced intelligence ----------
app.post("/simulate", async (req, res) => { // life journey simulator
  const { userId = "u1", question, optionA, optionB } = req.body;
  const mem = await recall(userId, question || "");
  const r = await ask({
    system: 'Explore possible outcomes of two paths. Do NOT predict the future; present possibilities and trade-offs. Return JSON: {"pathA": {"name": string, "possibleOutcomes": [string], "tradeoffs": [string]}, "pathB": {...same}, "comparison": string, "disclaimer": string}',
    user: `Question: ${question}\nA: ${optionA}\nB: ${optionB}\nRelevant memories: ${mem.texts.join("; ")}`, json: true,
    fallback: { pathA: { name: optionA, possibleOutcomes: ["(stub)"], tradeoffs: ["(stub)"] }, pathB: { name: optionB, possibleOutcomes: ["(stub)"], tradeoffs: ["(stub)"] }, comparison: "(stub)", disclaimer: "These are possibilities, not predictions." },
  });
  res.json({ ...r.data, mode: r.mode });
});
app.post("/perspectives", async (req, res) => { // multiple perspective intelligence
  const { topic, opinions = [] } = req.body; // opinions: [{person, text, consent}]
  const ok = opinions.filter((o) => o.consent === true);
  const skipped = opinions.length - ok.length;
  const r = await ask({
    system: 'Summarize several people\'s views neutrally without taking sides. Return JSON: {"agreements": [string], "disagreements": [string], "unansweredQuestions": [string], "neutralSummary": string}',
    user: `Topic: ${topic}\n` + ok.map((o) => `${o.person}: ${o.text}`).join("\n"), json: true,
    fallback: { agreements: [], disagreements: [], unansweredQuestions: [], neutralSummary: "(stub)" },
  });
  res.json({ ...r.data, skippedWithoutConsent: skipped, mode: r.mode });
});
app.get("/followups", (req, res) => { // intelligent follow-through
  const { userId = "u1", staleDays = 3 } = req.query;
  const cutoff = Date.now() - Number(staleDays) * 864e5;
  res.json({
    pendingDecisions: DB.decisions.filter((d) => d.userId === userId && d.status === "proposed"),
    staleTasks: DB.tasks.filter((t) => canSeeTask(t, userId) && t.status !== "done" && new Date(t.updatedAt) < cutoff),
    unresolvedProblems: DB.memories.filter((m) => m.userId === userId && m.type === "problem"),
    suggestion: "Ask the user whether circumstances have changed. Let them control reminder frequency.",
  });
});
app.post("/patterns", async (req, res) => { // only with permission
  const { userId = "u1", consent } = req.body;
  if (consent !== true) return res.status(403).json({ error: "User permission required for pattern analysis." });
  const mems = DB.memories.filter((m) => m.userId === userId).map((m) => m.text);
  const r = await ask({
    system: 'Find gentle, useful patterns in these notes. Be tentative and non-intrusive. Return JSON: {"patterns": [string], "suggestions": [string]}',
    user: mems.join("\n"), json: true, fallback: { patterns: ["(stub)"], suggestions: [] },
  });
  res.json({ ...r.data, mode: r.mode });
});
app.post("/explain", async (req, res) => { // re-explain differently
  const { text, style = "simple", language } = req.body;
  const r = await ask({
    system: `Re-explain the text. ${STYLE[style] || ""} ${language ? "Use " + language + "." : ""} Try a different angle than before.`,
    user: text, fallback: `(stub) ${text}`,
  });
  res.json({ explanation: r.data, mode: r.mode });
});
app.post("/cleanup", async (req, res) => { // voice transcript cleanup
  const r = await ask({
    system: "Clean this speech transcript: remove filler words, fix punctuation, apply self-corrections. Keep the meaning. Return only the cleaned text.",
    user: req.body.transcript || "", fallback: req.body.transcript || "",
  });
  res.json({ cleaned: r.data, mode: r.mode });
});

// ---------- privacy summary ----------
app.get("/privacy", (req, res) => {
  const u = req.query.userId || "u1";
  res.json({
    stored: { memories: DB.memories.filter((m) => m.userId === u).length, conversations: DB.conversations.filter((c) => c.userId === u).length },
    controls: ["Edit memories: PATCH /memories/:id", "Delete memories: DELETE /memories/:id", "Share summaries only: POST /share"],
    note: "Personal tasks are private; shared boards are visible only to their members.",
  });
});

// ---------- /api adapter: lets Member 1's React client (client/src/App.jsx) talk to this backend ----------
// Client expects: GET/POST /api/conversations, GET /api/conversations/:id/messages,
// DELETE /api/conversations/:id, POST /api/chat {conversationId, message, style} -> {reply}
const api = express.Router();
const U = (req) => req.query.userId || req.body?.userId || "u1";
api.get("/health", (req, res) =>
  res.json({ ok: true, aiConfigured: !!process.env.ANTHROPIC_API_KEY || !!(process.env.AI_BASE_URL && process.env.AI_MODEL), hindsight: !!hs, styles: Object.keys(STYLE) }));
api.get("/conversations", (req, res) =>
  res.json(DB.conversations.filter((c) => c.userId === U(req)).map((c) => ({ id: c.id, title: c.title, created_at: c.createdAt })).reverse()));
api.post("/conversations", (req, res) => {
  const c = { id: id("conv"), userId: U(req), title: "New conversation", messages: [], summary: "", createdAt: now() };
  DB.conversations.push(c); save();
  res.json({ id: c.id, title: c.title, created_at: c.createdAt });
});
api.get("/conversations/:id/messages", (req, res) => {
  const c = DB.conversations.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "Conversation not found" });
  res.json(c.messages.map((m, i) => ({ id: i, role: m.role === "user" ? "user" : "assistant", content: m.text })));
});
api.delete("/conversations/:id", (req, res) => {
  DB.conversations = DB.conversations.filter((c) => c.id !== req.params.id); save();
  res.json({ ok: true });
});
api.post("/chat", async (req, res) => {
  const { conversationId, message, style } = req.body || {};
  if (!conversationId || !message || !String(message).trim()) return res.status(400).json({ error: "conversationId and message are required" });
  const c = DB.conversations.find((x) => x.id === conversationId);
  if (!c) return res.status(404).json({ error: "Conversation not found" });
  if (c.title === "New conversation") c.title = String(message).slice(0, 40);
  // Reuse the main /chat flow (recall -> Claude -> retain -> decision) by calling it internally.
  const r = await fetch(`http://127.0.0.1:${PORT}/chat`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ userId: c.userId, message, conversationId, style }),
  }).then((x) => x.json());
  if (r.error && !r.reply) return res.status(500).json({ error: r.error });
  res.json({ reply: r.reply, decision: r.decision || null, trace: r.trace });
});
app.use("/api", api);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Orlina backend on :${PORT}  (Claude: ${!!process.env.ANTHROPIC_API_KEY ? "on" : "stub"}, Hindsight: ${hs ? "on" : "local fallback"})`));
