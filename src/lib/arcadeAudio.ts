import { readPreference, savePreference } from './storage';

export type ArcadeSound = 'select' | 'start' | 'move' | 'score' | 'miss' | 'win' | 'over';

const notes: Record<ArcadeSound, number[]> = {
  select: [440],
  start: [330, 440, 660],
  move: [220, 330],
  score: [660, 880],
  miss: [180, 140],
  win: [523, 659, 784, 1047],
  over: [330, 220, 110],
};

export class ArcadeAudio {
  private context: AudioContext | undefined;
  private voices = new Set<OscillatorNode>();
  private listeners = new Set<() => void>();
  private active = false;
  private enabled = readPreference('cm-arcade-sound') !== 'off';
  private lastPlayed = -Infinity;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };
  getEnabled = () => this.enabled;
  setActive(active: boolean) {
    this.active = active;
    if (!active) this.stop();
  }
  toggle = () => {
    this.enabled = !this.enabled;
    savePreference('cm-arcade-sound', this.enabled ? 'on' : 'off');
    if (!this.enabled) this.stop();
    this.listeners.forEach((listener) => listener());
    this.unlock();
  };
  unlock = () => {
    if (!this.active || !this.enabled) return;

    try {
      this.context ??= new AudioContext();
      if (this.context.state === 'suspended') void this.context.resume().catch(() => {});
    } catch {
      /* Audio is optional when unavailable or blocked. */
    }
  };
  stop = () => {
    this.voices.forEach((voice) => {
      voice.stop();
      voice.disconnect();
    });
    this.voices.clear();
    this.lastPlayed = -Infinity;
  };
  play(sound: ArcadeSound) {
    const context = this.context;
    if (
      !this.active ||
      !this.enabled ||
      !context ||
      context.state !== 'running' ||
      document.hidden
    )
      return;
    const now = context.currentTime;
    if (now - this.lastPlayed < 0.06) return;
    this.lastPlayed = now;
    notes[sound].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.085;

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.025, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
      oscillator.connect(gain);
      gain.connect(context.destination);
      this.voices.add(oscillator);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        this.voices.delete(oscillator);
      };

      oscillator.start(start);
      oscillator.stop(start + 0.09);
    });
  }
}

export const arcadeAudio = new ArcadeAudio();
