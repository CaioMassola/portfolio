import { useEffect, useRef, useState } from 'react';
import { Code2, Layers, Minus, RotateCcw } from 'lucide-react';
import type { Language } from '../../content';
import { createMemoryDeck } from '../../lib/memoryGame';

const labels = {
  pt: {
    title: 'Jogo da memória',
    open: 'Abrir jogo da memória',
    close: 'Minimizar jogo da memória',
    intro: 'Encontre os pares',
    win: 'Boa! Você encontrou todos os pares.',
    pairs: 'pares',
    attempts: 'tentativas',
    restart: 'Recomeçar',
    card: 'Carta',
    hidden: 'virada para baixo',
    matched: 'par encontrado',
  },
  en: {
    title: 'Memory game',
    open: 'Open memory game',
    close: 'Minimize memory game',
    intro: 'Find the pairs',
    win: 'Nice! You found every pair.',
    pairs: 'pairs',
    attempts: 'attempts',
    restart: 'Play again',
    card: 'Card',
    hidden: 'face down',
    matched: 'pair found',
  },
  es: {
    title: 'Juego de memoria',
    open: 'Abrir juego de memoria',
    close: 'Minimizar juego de memoria',
    intro: 'Encuentra las parejas',
    win: '¡Bien! Encontraste todas las parejas.',
    pairs: 'parejas',
    attempts: 'intentos',
    restart: 'Volver a jugar',
    card: 'Carta',
    hidden: 'boca abajo',
    matched: 'pareja encontrada',
  },
};
const names = {
  react: 'React',
  typescript: 'TypeScript',
  angular: 'Angular',
  java: 'Java',
  docker: 'Docker',
  git: 'Git',
  nextjs: 'Next.js',
  nodejs: 'Node.js',
  mysql: 'MySQL',
  jest: 'Jest',
  storybook: 'Storybook',
  amazonwebservices: 'AWS',
};

export default function MemoryGame({
  language,
  arcade = false,
}: {
  language: Language;
  arcade?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [deck, setDeck] = useState(() => createMemoryDeck(arcade));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const launcher = useRef<HTMLButtonElement>(null);
  const minimize = useRef<HTMLButtonElement>(null);
  const text = labels[language];

  useEffect(() => {
    if (flipped.length !== 2) return;

    const timer = setTimeout(() => setFlipped([]), 900);

    return () => clearTimeout(timer);
  }, [flipped]);

  const toggle = (expanded: boolean) => {
    setInteracted(true);
    setOpen(expanded);
    requestAnimationFrame(() => (expanded ? minimize : launcher).current?.focus());
  };

  const flip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index))
      return;

    if (flipped.length === 0) {
      setFlipped([index]);

      return;
    }

    setAttempts((value) => value + 1);

    if (deck[flipped[0]] === deck[index]) {
      setMatched((current) => [...current, flipped[0], index]);
      setFlipped([]);
    } else {
      setFlipped([flipped[0], index]);
    }
  };

  const content = (
    <>
      <p
        className="memory-status"
        role="status"
      >
        {matched.length === deck.length ? text.win : text.intro}
      </p>
      <div
        className="memory-board"
        role="group"
        aria-label={text.title}
      >
        {deck.map((technology, index) => {
          const found = matched.includes(index);
          const visible = found || flipped.includes(index);

          return (
            <button
              key={index}
              className={`memory-card${visible ? ' is-flipped' : ''}${found ? ' is-matched' : ''}`}
              aria-label={`${text.card} ${index + 1}: ${visible ? names[technology] : text.hidden}${found ? `, ${text.matched}` : ''}`}
              aria-disabled={found || visible || flipped.length === 2}
              onClick={() => flip(index)}
            >
              <span
                className="memory-card-inner"
                aria-hidden="true"
              >
                <span className="memory-card-back">
                  {arcade ? (
                    <svg
                      viewBox="0 0 64 76"
                      aria-hidden="true"
                    >
                      <path
                        d="M22 24h20v14H32v9m0 7v5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                    </svg>
                  ) : (
                    <Code2 size={24} />
                  )}
                </span>
                <span className="memory-card-face">
                  <img
                    src={`/technology-icons/${technology}.svg`}
                    alt=""
                    width="34"
                    height="34"
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p
        className="memory-score"
        role="status"
      >
        {matched.length / 2} / {deck.length / 2} {text.pairs} · {attempts} {text.attempts}
      </p>
      <button
        className="memory-restart"
        onClick={() => {
          setDeck(createMemoryDeck(arcade));
          setFlipped([]);
          setMatched([]);
          setAttempts(0);
        }}
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
    return <div className="arcade-embedded arcade-embedded-memory">{content}</div>;

  return (
    <aside
      className="memory-game"
      data-interacted={interacted}
      aria-label={text.title}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          toggle(false);
        }
      }}
    >
      <button
        ref={launcher}
        className="memory-launcher"
        hidden={open}
        aria-label={text.open}
        aria-expanded={open}
        aria-controls="memory-panel"
        onClick={() => toggle(true)}
      >
        <Layers
          size={22}
          aria-hidden="true"
        />
      </button>
      <div
        id="memory-panel"
        className="memory-panel"
        hidden={!open}
      >
        <div className="memory-heading">
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
