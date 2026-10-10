import { useEffect, useRef, useState } from 'react';
import { Gamepad2, Minus, RotateCcw } from 'lucide-react';
import type { Language } from '../../content';
import { botMove, winner, type Mark } from '../../lib/ticTacToe';

const labels = {
  pt: {
    title: 'Uma partida?',
    game: 'Jogo da velha',
    open: 'Abrir jogo da velha',
    close: 'Minimizar jogo',
    restart: 'Recomeçar',
    turn: 'Sua vez. Você é X.',
    thinking: 'Minha vez…',
    win: 'Você ganhou!',
    lose: 'Ganhei essa! Mais uma?',
    draw: 'Deu velha! Mais uma?',
    cell: 'Casa',
    empty: 'vazia',
  },
  en: {
    title: 'Quick game?',
    game: 'Tic tac toe',
    open: 'Open tic tac toe',
    close: 'Minimize game',
    restart: 'Play again',
    turn: 'Your turn. You are X.',
    thinking: 'My turn…',
    win: 'You won!',
    lose: 'I won! Another round?',
    draw: 'A draw! Another round?',
    cell: 'Cell',
    empty: 'empty',
  },
  es: {
    title: '¿Una partida?',
    game: 'Tres en raya',
    open: 'Abrir tres en raya',
    close: 'Minimizar juego',
    restart: 'Volver a jugar',
    turn: 'Tu turno. Eres X.',
    thinking: 'Mi turno…',
    win: '¡Ganaste!',
    lose: '¡Gané! ¿Otra partida?',
    draw: '¡Empate! ¿Otra partida?',
    cell: 'Casilla',
    empty: 'vacía',
  },
};

export default function MiniGame({
  language,
  arcade = false,
}: {
  language: Language;
  arcade?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const launcher = useRef<HTMLButtonElement>(null);
  const minimize = useRef<HTMLButtonElement>(null);
  const text = labels[language];
  const line = winner(board);
  const thinking =
    !line && board.includes(null) && board.filter(Boolean).length % 2 === 1;
  const status = line
    ? board[line[0]] === 'X'
      ? text.win
      : text.lose
    : !board.includes(null)
      ? text.draw
      : thinking
        ? text.thinking
        : text.turn;

  useEffect(() => {
    if (!thinking) return;

    const timer = setTimeout(() => {
      setBoard((current) => {
        const next = [...current];

        next[botMove(current)] = 'O';

        return next;
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [thinking]);

  const toggle = (expanded: boolean) => {
    setInteracted(true);
    setOpen(expanded);
    requestAnimationFrame(() => (expanded ? minimize : launcher).current?.focus());
  };

  const content = (
    <>
      <p
        className="game-status"
        role="status"
      >
        {status}
      </p>
      <div
        className="game-board-mini"
        role="group"
        aria-label={text.game}
      >
        <svg
          className="game-grid"
          viewBox="0 0 240 240"
          aria-hidden="true"
        >
          <path
            d={
              arcade
                ? 'M80 0v240M160 0v240M0 80h240M0 160h240'
                : 'M79 5 Q76 120 81 235 M159 5 Q164 120 159 235 M5 80 Q120 75 235 81 M5 159 Q120 164 235 159'
            }
          />
        </svg>
        {board.map((mark, index) => (
          <button
            key={index}
            className={line?.includes(index) ? 'is-winner' : ''}
            aria-label={`${text.cell} ${index + 1}: ${mark || text.empty}`}
            aria-disabled={Boolean(mark || line || thinking || !board.includes(null))}
            onClick={() => {
              if (mark || line || thinking) return;

              setBoard((current) =>
                current.map((value, cell) => (cell === index ? 'X' : value)),
              );
            }}
          >
            {mark && (
              <svg
                viewBox="0 0 80 80"
                className={`game-mark mark-${mark}`}
                aria-hidden="true"
              >
                {mark === 'X' ? (
                  <path
                    pathLength="1"
                    d={
                      arcade
                        ? 'M20 20 60 60M60 20 20 60'
                        : 'M20 17 Q40 42 61 63 M62 18 Q41 38 19 62'
                    }
                  />
                ) : (
                  <path
                    pathLength="1"
                    d={
                      arcade
                        ? 'M40 15a25 25 0 1 0 0 50a25 25 0 1 0 0-50'
                        : 'M40 15 C7 12 7 65 40 65 C73 65 72 12 40 15'
                    }
                  />
                )}
              </svg>
            )}
          </button>
        ))}
      </div>
      <button
        className="game-restart"
        onClick={() => setBoard(Array(9).fill(null))}
      >
        <RotateCcw
          size={14}
          aria-hidden="true"
        />
        {text.restart}
      </button>
    </>
  );
  if (arcade)
    return <div className="arcade-embedded arcade-embedded-game">{content}</div>;

  return (
    <aside
      className="mini-game"
      data-interacted={interacted}
      aria-label={text.game}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          toggle(false);
        }
      }}
    >
      <button
        ref={launcher}
        className="game-launcher"
        hidden={open}
        aria-label={text.open}
        aria-expanded={open}
        aria-controls="mini-game-panel"
        onClick={() => toggle(true)}
      >
        <Gamepad2
          size={22}
          aria-hidden="true"
        />
      </button>
      <div
        id="mini-game-panel"
        className="game-panel"
        hidden={!open}
      >
        <div className="game-heading">
          <span>{text.title}</span>
          <button
            ref={minimize}
            aria-label={text.close}
            onClick={() => toggle(false)}
          >
            <Minus
              size={18}
              aria-hidden="true"
            />
          </button>
        </div>
        {content}
      </div>
    </aside>
  );
}
