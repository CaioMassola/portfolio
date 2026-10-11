import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { ArcadeAudio, arcadeAudio } from '../../src/lib/arcadeAudio';
import ArcadeSoundButton, {
  ArcadeAudioEvents,
} from '../../src/components/arcade/ArcadeSoundButton';

describe('arcade audio', () => {
  const voices: {
    start: jasmine.Spy;
    stop: jasmine.Spy;
    disconnect: jasmine.Spy;
    onended: (() => void) | null;
  }[] = [];
  let context: {
    state: string;
    currentTime: number;
    resume: jasmine.Spy;
    createOscillator: jasmine.Spy;
    createGain: jasmine.Spy;
    destination: object;
  };

  beforeEach(() => {
    localStorage.clear();
    voices.length = 0;
    context = {
      state: 'running',
      currentTime: 1,
      destination: {},
      resume: jasmine.createSpy().and.resolveTo(),
      createOscillator: jasmine.createSpy().and.callFake(() => {
        const voice = {
          type: '',
          frequency: { setValueAtTime: jasmine.createSpy() },
          connect: jasmine.createSpy(),
          start: jasmine.createSpy(),
          stop: jasmine.createSpy(),
          disconnect: jasmine.createSpy(),
          onended: null,
        };

        voices.push(voice);

        return voice;
      }),
      createGain: jasmine
        .createSpy()
        .and.callFake(() => ({
          gain: {
            setValueAtTime: jasmine.createSpy(),
            linearRampToValueAtTime: jasmine.createSpy(),
            exponentialRampToValueAtTime: jasmine.createSpy(),
          },
          connect: jasmine.createSpy(),
          disconnect: jasmine.createSpy(),
        })),
    };
    spyOn(window, 'AudioContext').and.returnValue(context as unknown as AudioContext);
  });
  afterEach(() => {
    arcadeAudio.setActive(false);
    localStorage.clear();
  });
  it('requires activation, stores mute and stops active voices immediately', () => {
    const engine = new ArcadeAudio();
    const listener = jasmine.createSpy();
    const unsubscribe = engine.subscribe(listener);

    engine.play('select');
    engine.unlock();
    expect(window.AudioContext).not.toHaveBeenCalled();
    engine.setActive(true);
    engine.play('select');
    engine.unlock();
    engine.play('start');
    expect(voices.length).toBe(3);
    engine.play('move');
    expect(voices.length).toBe(3);
    voices[0].onended!();
    engine.toggle();
    expect(listener).toHaveBeenCalled();
    expect(voices[1].stop).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('cm-arcade-sound')).toBe('off');
    engine.play('score');
    expect(new ArcadeAudio().getEnabled()).toBeFalse();
    engine.toggle();
    expect(engine.getEnabled()).toBeTrue();
    context.currentTime = 2;

    for (const cue of ['select', 'move', 'score', 'miss', 'win', 'over'] as const) {
      engine.play(cue);
      context.currentTime++;
    }

    unsubscribe();
    engine.setActive(false);
  });
  it('handles suspended, rejected, unavailable and hidden audio', async () => {
    const engine = new ArcadeAudio();

    engine.setActive(true);
    (window.AudioContext as jasmine.Spy).and.throwError('unavailable');
    engine.unlock();
    (window.AudioContext as jasmine.Spy).and.returnValue(context);
    context.state = 'suspended';
    context.resume.and.rejectWith(new Error('blocked'));
    engine.unlock();
    engine.play('start');
    await Promise.resolve();
    expect(context.createOscillator).not.toHaveBeenCalled();
    context.state = 'running';
    spyOnProperty(document, 'hidden').and.returnValue(true);
    engine.play('start');
    expect(context.createOscillator).not.toHaveBeenCalled();
  });
  it('shares controls, ignores game cells and removes event listeners on exit', () => {
    const host = document.createElement('div');

    document.body.append(host);

    const root = createRoot(host);
    const sound = spyOn(arcadeAudio, 'play');

    act(() =>
      root.render(
        <>
          <ArcadeAudioEvents />
          <ArcadeSoundButton language="pt" />
          <ArcadeSoundButton language="en" />
          <button className="action">select</button>
          <div className="arcade-game-overlay">
            <button>start</button>
          </div>
          <button disabled>disabled</button>
        </>,
      ),
    );
    act(() => document.dispatchEvent(new Event('pointerdown')));
    act(() => host.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    act(() => host.querySelector<HTMLButtonElement>('.action')!.click());
    expect(sound).toHaveBeenCalledWith('select');
    act(() =>
      host.querySelector<HTMLButtonElement>('.arcade-game-overlay button')!.click(),
    );
    expect(sound).toHaveBeenCalledWith('start');
    act(() => host.querySelector<HTMLButtonElement>('.arcade-sound-toggle')!.click());
    expect(host.querySelectorAll('[aria-pressed="false"]').length).toBe(2);
    act(() => host.querySelector<HTMLButtonElement>('.arcade-sound-toggle')!.click());
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => window.dispatchEvent(new Event('blur')));
    act(() => root.unmount());
    sound.calls.reset();
    host.querySelector('button')?.click();
    document.body.click();
    expect(sound).not.toHaveBeenCalled();
    host.remove();
  });
});
