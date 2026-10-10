import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import Arcade from '../../src/components/arcade/Arcade';
import ArcadePlayer from '../../src/components/arcade/ArcadePlayer';
import { GameBoard } from '../../src/components/arcade/Artwork';
import { createGame } from '../../src/lib/arcade';
import type { ArcadeGame } from '../../src/lib/arcade';

describe('arcade interaction', () => {
  let host: HTMLDivElement;
  let root: Root;
  let frame: FrameRequestCallback;
  const click = (selector: string) =>
    act(() => host.querySelector<HTMLButtonElement>(selector)!.click());
  const key = (key: string) =>
    act(() =>
      host
        .querySelector('dialog')!
        .dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
        ),
    );
  const tick = (ms: number) => act(() => jasmine.clock().tick(ms));

  beforeEach(() => {
    jasmine.clock().install();
    spyOn(Math, 'random').and.returnValue(0);
    spyOn(window, 'requestAnimationFrame').and.callFake((callback) => {
      frame = callback;

      return 1;
    });
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    jasmine.clock().uninstall();
    localStorage.clear();
  });
  it('opens the library games, restores focus and dispatches existing games', () => {
    act(() => root.render(<Arcade language="pt" />));

    expect(host.querySelector('.arcade-intro-actions button')).toBeNull();

    for (const selector of [
      '.card-runner button',
      '.card-snake button',
      '.card-blocks button',
      '.card-tic button',
      '.card-memory button',
    ]) {
      click(selector);
      expect(host.querySelector('dialog')?.open).toBeTrue();

      if (selector === '.card-tic button' || selector === '.card-memory button') {
        click('.arcade-game-overlay button');
        expect(host.querySelector('.arcade-embedded')).not.toBeNull();
      }

      if (selector === '.card-tic button') {
        click('.game-board-mini button');
        tick(450);
        expect(host.querySelectorAll('.game-mark').length).toBe(2);
      }

      click('.arcade-player-heading button');
      act(() => frame(0));
      expect(host.querySelector('dialog')).toBeNull();
      expect(document.activeElement).toBe(host.querySelector(selector));
    }
  });

  for (const kind of ['runner', 'snake', 'blocks'] as ArcadeGame[]) {
    it(`${kind} supports pause, controls, restart and close`, () => {
      const close = jasmine.createSpy('close');

      act(() =>
        root.render(
          <ArcadePlayer
            kind={kind}
            language="en"
            onClose={close}
          />,
        ),
      );
      key('ArrowUp');
      key('q');
      act(() => document.dispatchEvent(new Event('visibilitychange')));
      click('.arcade-game-overlay button');

      const controls = host.querySelectorAll<HTMLButtonElement>(
        '.arcade-controls button',
      );

      act(() => controls.forEach((b) => b.click()));
      key('ArrowUp');
      key('ArrowDown');
      key('ArrowRight');
      key('ArrowLeft');
      key(' ');
      tick(200);
      key('p');
      expect(host.querySelector('[role="status"]')?.textContent).toBe('Game paused');
      click('.arcade-game-overlay button');
      act(() => window.dispatchEvent(new Event('blur')));
      expect(host.querySelector('[role="status"]')?.textContent).toBe('Game paused');
      click('.arcade-player-actions button');
      click('.arcade-player-actions button');
      click('.arcade-game-overlay button');
      click('.arcade-player-actions button:last-child');
      expect(host.querySelector('[role="status"]')?.textContent).toBe('Ready?');
      key('p');
      key('p');
      act(() =>
        host
          .querySelector('dialog')!
          .dispatchEvent(new Event('cancel', { cancelable: true })),
      );
      expect(close).toHaveBeenCalled();
      click('.arcade-player-heading button');
      expect(close).toHaveBeenCalledTimes(2);
    });
  }

  it('saves the record at game over, blocks input, and restarts a finished game', () => {
    act(() =>
      root.render(
        <ArcadePlayer
          kind="runner"
          language="es"
          onClose={() => {}}
        />,
      ),
    );
    click('.arcade-game-overlay button');
    tick(4000);
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Fin del juego');
    expect(Number(localStorage.getItem('cm-arcade-runner'))).toBeGreaterThan(0);
    key('p');
    key('ArrowUp');
    click('.arcade-game-overlay button');
    expect(host.querySelector('[role="status"]')).toBeNull();
  });
  it('renders occupied cells and distinct pieces in the blocks board', () => {
    const state = createGame('blocks');

    state.grid[17][0] = 1;
    act(() => root.render(<GameBoard state={state} />));
    expect(host.querySelectorAll('rect').length).toBe(185);
  });
});
