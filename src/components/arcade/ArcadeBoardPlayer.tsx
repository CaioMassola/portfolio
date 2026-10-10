import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { Language } from '../../content';
import MiniGame from '../layout/MiniGame';
import MemoryGame from '../layout/MemoryGame';
import ArcadeModal from './ArcadeModal';
import { GameArt } from './Artwork';
import { arcadeCopy } from './copy';

export default function ArcadeBoardPlayer({
  kind,
  language,
  onClose,
}: {
  kind: 'tic' | 'memory';
  language: Language;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [started, setStarted] = useState(false);
  const t = arcadeCopy[language];

  return (
    <ArcadeModal
      title={t[kind]}
      closeLabel={t.close}
      onClose={onClose}
      dialogRef={dialog}
    >
      <div className={`arcade-tabletop stage-${kind}`}>
        {started ? (
          kind === 'tic' ? (
            <MiniGame
              language={language}
              arcade
            />
          ) : (
            <MemoryGame
              language={language}
              arcade
            />
          )
        ) : (
          <div className="arcade-tabletop-preview">
            <GameArt kind={kind} />
            <div className="arcade-game-overlay">
              <h3>{t.ready}</h3>
              <button
                className="arcade-button"
                onClick={() => {
                  setStarted(true);
                  dialog.current?.focus();
                }}
              >
                <Play size={18} />
                {t.start}
              </button>
            </div>
          </div>
        )}
      </div>
    </ArcadeModal>
  );
}
