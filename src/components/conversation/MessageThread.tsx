import { useEffect, useRef } from 'react';
import { Orbit } from 'lucide-react';
import { CompanionScene } from '@/components/illustrations/CompanionScene';
import { formatRelativeTime } from '@/lib/formatTime';
import type { ChatMessage } from '@/types/orlina';

interface MessageThreadProps {
  messages: ChatMessage[];
  replying: boolean;
}

function TypingIndicator() {
  return (
    <div role="status" aria-label="ORLINA is replying" className="flex items-center gap-1.5 px-1 py-2">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-mint"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <li className={isUser ? 'flex justify-end' : 'flex items-start gap-3'}>
      {!isUser && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">
          <Orbit className="h-4 w-4" />
        </span>
      )}
      <div className={isUser ? 'max-w-[85%] text-right sm:max-w-[70%]' : 'min-w-0 max-w-[85%] sm:max-w-[75%]'}>
        <p
          className={
            isUser
              ? 'whitespace-pre-wrap rounded-2xl rounded-br-md border border-accent/40 bg-accent/20 px-4 py-3 text-left text-[0.95rem] leading-normal text-ink'
              : 'whitespace-pre-wrap rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[0.95rem] leading-normal text-ink'
          }
        >
          {message.text}
        </p>
        <p className="mt-1.5 px-1 text-xs text-muted">
          {isUser ? 'You' : 'ORLINA'} · {formatRelativeTime(message.createdAt)}
        </p>
      </div>
    </li>
  );
}

export function MessageThread({ messages, replying }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length, replying]);

  if (messages.length === 0 && !replying) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <CompanionScene scene="conversations" className="w-full max-w-[180px]" />
        <p className="mt-4 font-display text-xl text-ink">Start with what is on your mind.</p>
        <p className="mt-2 max-w-sm text-sm leading-normal text-muted">
          Type or speak in the box below. ORLINA keeps the thread and remembers what matters.
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-1 py-2 sm:px-2">
      <ol className="space-y-6">
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
      </ol>
      {replying && (
        <div className="mt-6 flex items-start gap-3">
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">
            <Orbit className="h-4 w-4" />
          </span>
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}
