import {
  useEffect,
  useRef,
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
} from 'react';
import { Maximize2 } from 'lucide-react';
import { copy, type Language } from '../../content';
import {
  runTerminal,
  terminalCommands,
  terminalCopy,
  type TerminalGame,
  type TerminalResult,
} from '../../lib/terminal';
import { arcadeAudio } from '../../lib/arcadeAudio';
import ArcadeModal from './ArcadeModal';

const HISTORY_LIMIT = 50;

export default function ArcadeTerminal({
  language,
  onPlay,
}: {
  language: Language;
  onPlay: (
    kind: TerminalGame,
    trigger: HTMLButtonElement,
    returnToTerminal: () => void,
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const [lines, setLines] = useState<{ command: string; result: TerminalResult }[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const draft = useRef('');
  const c = terminalCopy[language];

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => field.current?.focus());

    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const command = input.trim();
    if (!command) return;
    const result = runTerminal(command, language, copy[language]);
    const next = [...history, command].slice(-HISTORY_LIMIT);

    setHistory(next);
    setCursor(next.length);
    setInput('');
    draft.current = '';
    setLines((current) =>
      result.clear ? [] : [...current, { command, result }].slice(-HISTORY_LIMIT),
    );
    arcadeAudio.play('select');
    if (result.game) {
      setOpen(false);
      onPlay(result.game, launcher.current!, () => {
        setLines((current) =>
          current.map((line) =>
            line.result === result ? { ...line, result: { text: c.returned } } : line,
          ),
        );
        setOpen(true);
      });
    } else field.current?.focus();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();

      const next = Math.max(
        0,
        Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)),
      );

      setCursor(next);
      setInput(next === history.length ? draft.current : history[next]);
    }

    if (event.key === 'Tab' && !event.shiftKey && input.trim()) {
      const matches = terminalCommands.filter((command) =>
        command.startsWith(input.trim().toLowerCase()),
      );

      if (matches.length === 1) {
        event.preventDefault();
        setInput(matches[0]);
        draft.current = matches[0];
      }
    }
  };

  return (
    <>
      <div className="arcade-terminal">
        <div className="arcade-terminal-heading">
          <span>TERMINAL</span>
          <button
            ref={launcher}
            type="button"
            aria-label={c.open}
            onClick={() => setOpen(true)}
          >
            <Maximize2 size={19} />
          </button>
        </div>
        <div className="arcade-terminal-body">
          <span className="sr-only">console.log("Hello World"); Hello World</span>
          <div aria-hidden="true">
            <code className="arcade-terminal-command">
              console.log(<span>"Hello World"</span>);
            </code>
            <p className="arcade-terminal-output">Hello World</p>
          </div>
        </div>
      </div>
      {open && (
        <ArcadeModal
          language={language}
          title="TERMINAL"
          closeLabel={c.close}
          dialogRef={dialog}
          onClose={close}
        >
          <div className="arcade-console">
            <p>{c.hint}</p>
            <div
              className="arcade-console-log"
              ref={output}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              tabIndex={0}
            >
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="arcade-console-entry"
                >
                  <p className="arcade-console-prompt">&gt; {line.command}</p>
                  <pre>{line.result.text}</pre>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="arcade-console-input">
                &gt;<span className="sr-only">{c.input}</span>
              </label>
              <input
                id="arcade-console-input"
                ref={field}
                value={input}
                maxLength={160}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                onChange={(event) => {
                  setInput(event.target.value);
                  draft.current = event.target.value;
                  setCursor(history.length);
                }}
                onKeyDown={handleKeyDown}
              />
              <button type="submit">{c.send}</button>
            </form>
          </div>
        </ArcadeModal>
      )}
    </>
  );
}
