import ArcadeBoardPlayer from './ArcadeBoardPlayer';
import { useRef, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import type { Language } from '../../content';
import type { ArcadeGame } from '../../lib/arcade';
import { sectionIds } from '../../lib/sections';
import { Capybara, GameArt } from './Artwork';
import ArcadePlayer from './ArcadePlayer';
import { arcadeCopy } from './copy';

export default function Arcade({ language }: { language: Language }) {
  const t = arcadeCopy[language];
  const [active, setActive] = useState<ArcadeGame | 'tic' | 'memory' | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  return (
    <section
      className="arcade-home"
      id={sectionIds[language][0]}
    >
      <div className="arcade-hero">
        <div className="arcade-intro">
          <span className="arcade-eyebrow">
            <Gamepad2 size={18} /> {t.mode}
          </span>
          <h1>{t.headline}</h1>
          <p>Caio Massola · {t.role}</p>
          <code>
            console.log(<span>"Hello World"</span>);
          </code>
          <div className="arcade-intro-actions">
            <a href={`#${sectionIds[language][3]}`}>{t.projects}</a>
          </div>
        </div>
        <div
          className="arcade-hero-art"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 500 330"
            shapeRendering="crispEdges"
          >
            <path
              d="M90 58h190v30h30v110h-55v-40H115v40H60V88h30z"
              fill="#ffeb00"
              stroke="#111"
              strokeWidth="10"
            />
            <path
              d="M115 89h22v22h22v22h-22v22h-22v-22H93v-22h22z"
              fill="#111"
            />
            <path
              d="M225 93h20v20h-20z"
              fill="#8100ef"
              stroke="#111"
              strokeWidth="4"
            />
            <path
              d="M251 120h20v20h-20z"
              fill="#72f52c"
              stroke="#111"
              strokeWidth="4"
            />
            <path
              d="M225 147h20v20h-20z"
              fill="#0055ff"
              stroke="#111"
              strokeWidth="4"
            />
            <path
              d="M345 70v60h65v85h-45"
              fill="none"
              stroke="#111"
              strokeWidth="31"
            />
            <path
              d="M345 70v60h65v85h-45"
              fill="none"
              stroke="#72f52c"
              strokeWidth="22"
            />
            <path
              d="M354 193h30v36h-30z"
              fill="#72f52c"
              stroke="#111"
              strokeWidth="5"
            />
            <g transform="translate(96 204) scale(1.65)">
              <Capybara />
            </g>
            <path
              d="M284 248h30v30h30v30h-60z"
              fill="#8100ef"
              stroke="#111"
              strokeWidth="5"
            />
            <path
              d="M440 33h18v18h-18zM40 238h15v15H40z"
              fill="#ffeb00"
            />
          </svg>
        </div>
      </div>
      <div className="arcade-checkers" />
      <div className="arcade-library">
        <div className="arcade-library-heading">
          <h2>{t.choose}</h2>
          <span>5 GAMES / FREE PLAY</span>
        </div>
        <div className="arcade-cards">
          {(['runner', 'snake', 'blocks', 'tic', 'memory'] as const).map((kind, i) => (
            <article
              key={kind}
              className={`arcade-card card-${kind}`}
            >
              <GameArt kind={kind} />
              <div className="arcade-card-copy">
                <h3>{t[kind]}</h3>
                <p>{t[`${kind}Desc`]}</p>
                <div>
                  <button
                    className="arcade-button"
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      setActive(kind);
                    }}
                    aria-label={`${t.play}: ${t[kind]}`}
                  >
                    {t.play}
                  </button>
                  <span>0{i + 1}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {active &&
        (active === 'tic' || active === 'memory' ? (
          <ArcadeBoardPlayer
            key={active}
            kind={active}
            language={language}
            onClose={() => {
              setActive(null);
              requestAnimationFrame(() =>
                trigger.current?.focus({ preventScroll: true }),
              );
            }}
          />
        ) : (
          <ArcadePlayer
            key={active}
            kind={active}
            language={language}
            onClose={() => {
              setActive(null);
              requestAnimationFrame(() =>
                trigger.current?.focus({ preventScroll: true }),
              );
            }}
          />
        ))}
    </section>
  );
}
