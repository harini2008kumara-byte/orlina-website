import { useEffect, useMemo, useRef, useState } from 'react';

interface SpeechAlternative {
  transcript: string;
}

interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechAlternative;
}

interface SpeechResultEvent {
  readonly resultIndex: number;
  readonly results: { readonly length: number; [index: number]: SpeechResult };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(onFinalText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalTextRef = useRef(onFinalText);
  const supported = useMemo(() => getRecognitionConstructor() !== null, []);

  useEffect(() => {
    onFinalTextRef.current = onFinalText;
  }, [onFinalText]);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const start = () => {
    const Constructor = getRecognitionConstructor();
    if (!Constructor) return;

    const recognition = new Constructor();
    recognition.lang = navigator.language || 'en-GB';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript ?? '';
        if (result?.isFinal) final += transcript;
        else interim += transcript;
      }
      if (final.trim()) onFinalTextRef.current(final.trim());
      setInterimText(interim.trim());
    };
    recognition.onerror = () => {
      setError('Voice input could not start. Check microphone permission and try again.');
      setListening(false);
      setInterimText('');
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    recognition.start();
  };

  const stop = () => recognitionRef.current?.stop();

  return { supported, listening, interimText, error, start, stop };
}
