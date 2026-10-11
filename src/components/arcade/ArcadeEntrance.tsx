import { useEffect, useState } from 'react';
import type { Language } from '../../content';

const messages = {
  pt: 'PREPARANDO A PARTIDA...',
  en: 'GETTING READY TO PLAY...',
  es: 'PREPARANDO LA PARTIDA...',
};

export default function ArcadeEntrance({ language }: { language: Language }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setTimeout(() => setVisible(false), motion.matches ? 100 : 1800);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="arcade-entrance"
      aria-hidden="true"
    >
      <div className="arcade-entrance-player">
        <svg
          viewBox="0 0 160 100"
          shapeRendering="crispEdges"
        >
          <path
            d="M30 10h100v10h10v10h10v50h-30V60H40v20H10V30h10V20h10z"
            fill="#ffeb00"
            stroke="#111"
            strokeWidth="8"
          />
          <path
            d="M40 25h12v12h12v12H52v12H40V49H28V37h12z"
            fill="#111"
          />
          <path
            d="M108 26h12v12h-12zM124 42h12v12h-12z"
            fill="#8100ef"
          />
        </svg>
        <span>PLAYER 1</span>
        <strong>CAIO MASSOLA</strong>
      </div>
      <div className="arcade-entrance-loading">
        <p>{messages[language]}</p>
        <div className="arcade-entrance-track">
          <span />
        </div>
      </div>
    </div>
  );
}
