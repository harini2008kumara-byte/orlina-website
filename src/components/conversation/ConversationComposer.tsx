import { useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const MAX_MESSAGE_LENGTH = 4000;

interface ConversationComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  placeholder: string;
  label: string;
  rows?: number;
  fill?: boolean;
}

function joinText(existing: string, addition: string): string {
  return existing.trim() ? `${existing.trimEnd()} ${addition}` : addition;
}

export function ConversationComposer({ value, onChange, onSend, placeholder, label, rows = 4, fill = false }: ConversationComposerProps) {
  const valueRef = useRef(value);
  valueRef.current = value;
  const textareaId = `composer-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const { supported, listening, interimText, error, start, stop } = useSpeechRecognition((text) => {
    onChange(joinText(valueRef.current, text));
  });
  const canSend = value.trim().length > 0;

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    if (listening) stop();
    onSend(text);
    onChange('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'overflow-hidden rounded-3xl border bg-surface shadow-clay transition-colors duration-200',
        fill && 'flex min-h-[26rem] flex-col',
        listening ? 'border-mint' : 'border-line focus-within:border-accent',
      )}
    >
      <label htmlFor={textareaId} className="sr-only">
        {label}
      </label>

      {listening && (
        <div role="status" className="flex items-center gap-3 border-b border-line bg-canvas/50 px-6 py-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          <span className="shrink-0 text-sm font-medium text-mint">Listening</span>
          <span className="min-w-0 flex-1 truncate text-sm italic text-muted">{interimText || 'Speak naturally. Your words appear here.'}</span>
        </div>
      )}

      <textarea
        id={textareaId}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={handleKeyDown}
        maxLength={MAX_MESSAGE_LENGTH}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          'block w-full bg-transparent px-6 pb-2 pt-6 text-base leading-normal text-ink placeholder:text-muted focus:outline-none sm:text-lg',
          fill ? 'min-h-0 flex-1 resize-none' : 'max-h-[40vh] min-h-[8rem] resize-y',
        )}
      />

      {error && (
        <p role="alert" className="px-6 pb-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 px-4 pb-4 pt-2 sm:px-5">
        <button
          type="button"
          onClick={listening ? stop : start}
          disabled={!supported}
          aria-pressed={listening}
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          title={supported ? undefined : 'Voice input is not supported in this browser'}
          className={cn(
            'relative grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-all duration-200 active:shadow-clay-inset disabled:pointer-events-none disabled:opacity-40',
            listening
              ? 'border-mint bg-mint text-on-accent shadow-clay-primary'
              : 'border-line bg-input text-mint shadow-clay hover:border-accent hover:bg-panel',
          )}
        >
          {listening && <span className="absolute inset-0 animate-mic-ring rounded-full bg-mint/40" aria-hidden="true" />}
          {supported ? <Mic className="relative h-5 w-5" aria-hidden="true" /> : <MicOff className="relative h-5 w-5" aria-hidden="true" />}
        </button>
        <p className="hidden min-w-0 text-xs text-muted md:block">
          {supported ? 'Speak or type. Ctrl or Cmd + Enter sends.' : 'Voice input is not available in this browser.'}
        </p>
        <Button type="submit" variant="primary" disabled={!canSend} className="ml-auto">
          <Send className="h-4 w-4" aria-hidden="true" />
          Send
        </Button>
      </div>
    </form>
  );
}
