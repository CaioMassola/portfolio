import ArcadeTerminal from './ArcadeTerminal';
import ArcadeEntrance from './ArcadeEntrance';
import ArcadeBoardPlayer from './ArcadeBoardPlayer';
import { useRef, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import type { Language } from '../../content';
import type { ArcadeGame } from '../../lib/arcade';
import { sectionIds } from '../../lib/sections';
import { GameArt } from './Artwork';
import ArcadeHeroArt from './ArcadeHeroArt';
import ArcadePlayer from './ArcadePlayer';
import { arcadeCopy } from './copy';

export default function Arcade({ language }: { language: Language }) {
  const t = arcadeCopy[language];
  const [active, setActive] = useState<ArcadeGame | 'tic' | 'memory' | null>(null);
  const returnToTerminal = useRef<(() => void) | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  const closeGame = () => {
    setActive(null);

    const resumeTerminal = returnToTerminal.current;

    returnToTerminal.current = null;
    if (resumeTerminal) resumeTerminal();
    else requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  };

  return (
    <section
      className="arcade-home"
      id={sectionIds[language][0]}
    >
      <ArcadeEntrance language={language} />
      <div className="arcade-hero">
        <div className="arcade-intro">
          <span className="arcade-eyebrow">
            <Gamepad2 size={18} /> {t.mode}
          </span>
          <h1>{t.headline}</h1>
          <p>{t.role}</p>
          <ArcadeTerminal
            language={language}
            onPlay={(kind, button, resumeTerminal) => {
              returnToTerminal.current = resumeTerminal;
              trigger.current = button;
              setActive(kind);
            }}
          />
          <div className="arcade-intro-actions">
            <a href={`#${sectionIds[language][3]}`}>{t.projects}</a>
          </div>
        </div>
        <ArcadeHeroArt />
      </div>
      <div className="arcade-checkers" />
      <div
        className="arcade-library"
        id="games"
      >
        <div className="arcade-library-heading">
          <h2>{t.choose}</h2>
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
                      returnToTerminal.current = null;
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
            onClose={closeGame}
          />
        ) : (
          <ArcadePlayer
            key={active}
            kind={active}
            language={language}
            onClose={closeGame}
          />
        ))}
    </section>
  );
}
