/*
# Create conversation and message storage

1. New Tables
- `chat_conversations`: one row per conversation. Holds the owning device, the title and timestamps.
- `chat_messages`: one row per message (user or ORLINA reply), linked to its conversation.

2. Access model
- The app has no sign-in. Each browser keeps a random device identifier, and all reads and writes go through a server function.
- The browser never talks to these tables directly. Access is granted to the server role only.

3. Security
- Row level security is enabled on both tables.
- No policies are created for the anonymous or signed-in roles, so direct browser access is denied.
- Only the server role receives privileges, and it bypasses row level security.

4. Important notes
- Rows are ordered by creation time for conversation context.
- Indexes support listing a device's conversations and counting recent replies for daily limits.
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY,
  device_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  device_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_conversations_device_updated_idx ON chat_conversations (device_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_idx ON chat_messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS chat_messages_device_role_created_idx ON chat_messages (device_id, role, created_at);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON chat_conversations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_messages TO service_role;
