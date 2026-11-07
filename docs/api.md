# Orlina API (all endpoints take `userId`, default `u1`)

| Method | Path | Purpose |
|---|---|---|
| GET | /health | Shows whether Claude and Hindsight are live or in fallback mode |
| POST | /chat `{userId, message, conversationId?, style?, language?}` | Full flow: recall, Claude, retain, decision. `style`: simple, detailed, short, example, steps |
| GET | /conversations?q= | Timeline and search |
| GET | /conversations/:id | Open a conversation to continue it |
| POST | /conversations/:id/summarize | Summary, key points, decisions, action items |
| POST | /share `{conversationId}` | Share a summary only |
| GET | /memories | List (filter by `confidence`) |
| PATCH / DELETE | /memories/:id | Correct or delete |
| GET | /memories/ask?q= | Natural-language memory search (Hindsight Reflect) |
| GET | /memory-map | Nodes and edges linking memories, decisions, tasks, conversations |
| GET / POST | /decisions | List or analyse a situation |
| POST | /decisions/:id/approve `{chosen, reason, expectedOutcome, boardId?}` | Approve and create tasks |
| POST | /decisions/:id/change `{chosen, reason}` | Changed-decision history |
| POST | /decisions/:id/outcome `{actual}` | Outcome learning |
| GET / POST / PATCH | /tasks, /tasks/:id | Task board (private unless on a shared board) |
| GET / POST | /boards, POST /boards/:id/invite | Shared boards |
| POST | /simulate `{question, optionA, optionB}` | Life Journey Simulator |
| POST | /perspectives `{topic, opinions:[{person,text,consent}]}` | Neutral multi-person summary (consent required) |
| GET | /followups | Pending decisions, stale tasks, unresolved problems |
| POST | /patterns `{consent:true}` | Pattern recognition (permission required) |
| POST | /explain `{text, style}` | Re-explain differently |
| POST | /cleanup `{transcript}` | Voice transcript cleanup |
| GET | /privacy | What is stored and what controls exist |
| GET / POST | /agents, /agents/:name | Call one agent directly (for BAND) |
