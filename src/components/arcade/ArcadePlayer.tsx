import ArcadeModal from './ArcadeModal';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import type { Language } from '../../content';
import {
  commandGame,
  createGame,
  highScore,
  intervalFor,
  stepGame,
  storeScore,
  type ArcadeGame,
  type Command,
} from '../../lib/arcade';
import { GameBoard } from './Artwork';
import { arcadeCopy } from './copy';

export default function ArcadePlayer({
  kind,
  language,
  onClose,
}: {
  kind: ArcadeGame;
  language: Language;
  onClose: () => void;
}) {
  const t = arcadeCopy[language];
  const [state, setState] = useState(() => createGame(kind));
  const [status, setStatus] = useState<'ready' | 'running' | 'paused'>('ready');
  const [record] = useState(() => highScore(kind));
  const dialog = useRef<HTMLDialogElement>(null);
  const interval = intervalFor(state);
  const running = status === 'running' && !state.over;

  useEffect(() => {
    const pause = () =>
      setStatus((current) => (current === 'running' ? 'paused' : current));

    document.addEventListener('visibilitychange', pause);
    window.addEventListener('blur', pause);

    return () => {
      document.removeEventListener('visibilitychange', pause);
      window.removeEventListener('blur', pause);
    };
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setState(stepGame), interval);

    return () => clearInterval(timer);
  }, [running, interval]);
  useEffect(() => {
    if (state.over) storeScore(kind, state.score);
  }, [kind, state.over, state.score]);

  const command = (value: Command) => {
    setState((current) => commandGame(current, value));
  };

  const togglePause = () =>
    setStatus((current) => (current === 'running' ? 'paused' : 'running'));

  const restart = () => {
    setState(createGame(kind));
    setStatus('ready');
  };

  return (
    <ArcadeModal
      dialogRef={dialog}
      title={t[kind]}
      closeLabel={t.close}
      onClose={onClose}
      onKeyDown={(event) => {
        const commands: Record<string, Command> = {
          ArrowLeft: 'left',
          a: 'left',
          ArrowRight: 'right',
          d: 'right',
          ArrowUp: 'up',
          w: 'up',
          ArrowDown: 'down',
          s: 'down',
          ' ': 'action',
        };

        if (event.key.toLowerCase() === 'p' && !state.over) {
          event.preventDefault();
          togglePause();

          return;
        }

        if (commands[event.key] && running) {
          event.preventDefault();
          command(commands[event.key]);
        }
      }}
    >
      <div className="arcade-score">
        <span>
          {t.score} <b>{String(state.score).padStart(4, '0')}</b>
        </span>
        <span>
          {t.best} <b>{Math.max(record, state.score)}</b>
        </span>
      </div>
      <div className={`arcade-stage stage-${kind}`}>
        <GameBoard state={state} />
        {!running && (
          <div className="arcade-game-overlay">
            <h3 role="status">
              {state.over ? t.over : status === 'ready' ? t.ready : t.paused}
            </h3>
            <button
              className="arcade-button"
              onClick={() => {
                if (state.over) setState(createGame(kind));
                setStatus('running');
                dialog.current?.focus();
              }}
            >
              <Play size={18} />
              {state.over ? t.restart : status === 'ready' ? t.start : t.resume}
            </button>
          </div>
        )}
      </div>
      <p className="arcade-help">
        {t[`${kind}Help`]} <span>{t.pauseHelp}</span>
      </p>
      <div
        className="arcade-controls"
        aria-label={t[kind]}
      >
        {kind === 'runner' ? (
          <button
            onClick={() => command('action')}
            disabled={!running}
          >
            <ArrowUp />
            {t.jump}
          </button>
        ) : (
          <>
            <button
              aria-label={t.left}
              onClick={() => command('left')}
              disabled={!running}
            >
              <ArrowLeft />
            </button>
            <button
              aria-label={kind === 'blocks' ? t.rotate : t.up}
              onClick={() => command('up')}
              disabled={!running}
            >
              <ArrowUp />
            </button>
            <button
              aria-label={t.down}
              onClick={() => command('down')}
              disabled={!running}
            >
              <ArrowDown />
            </button>
            <button
              aria-label={t.right}
              onClick={() => command('right')}
              disabled={!running}
            >
              <ArrowRight />
            </button>
            {kind === 'blocks' && (
              <button
                onClick={() => command('action')}
                disabled={!running}
              >
                {t.drop}
              </button>
            )}
          </>
        )}
      </div>
      <div className="arcade-player-actions">
        <button
          onClick={togglePause}
          disabled={state.over || status === 'ready'}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}{' '}
          {running ? t.pause : t.resume}
        </button>
        <button onClick={restart}>
          <RotateCcw size={16} />
          {t.restart}
        </button>
      </div>
    </ArcadeModal>
  );
}
