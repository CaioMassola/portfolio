import { useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Language } from '../../content';
import { arcadeAudio } from '../../lib/arcadeAudio';

export function ArcadeAudioEvents() {
  useEffect(() => {
    arcadeAudio.setActive(true);

    const click = (event: MouseEvent) => {
      const target = (event.target as Element).closest('button, a');
      if (
        !target ||
        target.matches(
          '.arcade-sound-toggle, [disabled], [aria-disabled="true"], .game-board-mini button, .memory-card, .arcade-controls button',
        )
      )
        return;
      arcadeAudio.play(target.closest('.arcade-game-overlay') ? 'start' : 'select');
    };

    document.addEventListener('pointerdown', arcadeAudio.unlock);
    document.addEventListener('keydown', arcadeAudio.unlock);
    document.addEventListener('click', click);
    document.addEventListener('visibilitychange', arcadeAudio.stop);
    window.addEventListener('blur', arcadeAudio.stop);

    return () => {
      arcadeAudio.setActive(false);
      document.removeEventListener('pointerdown', arcadeAudio.unlock);
      document.removeEventListener('keydown', arcadeAudio.unlock);
      document.removeEventListener('click', click);
      document.removeEventListener('visibilitychange', arcadeAudio.stop);
      window.removeEventListener('blur', arcadeAudio.stop);
    };
  }, []);

  return null;
}

const labels = {
  pt: ['Ativar som', 'Silenciar som'],
  en: ['Enable sound', 'Mute sound'],
  es: ['Activar sonido', 'Silenciar sonido'],
};

export default function ArcadeSoundButton({ language }: { language: Language }) {
  const enabled = useSyncExternalStore(arcadeAudio.subscribe, arcadeAudio.getEnabled);

  return (
    <button
      type="button"
      className="icon-button arcade-sound-toggle"
      aria-label={labels[language][Number(enabled)]}
      aria-pressed={enabled}
      onClick={arcadeAudio.toggle}
    >
      {enabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
    </button>
  );
}
