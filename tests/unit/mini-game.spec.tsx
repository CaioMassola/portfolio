import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import MiniGame from '../../src/components/layout/MiniGame';
import { botMove, winner, winningLines, type Mark } from '../../src/lib/ticTacToe';

describe('tic tac toe rules', () => {
  it('recognizes every winning line for both players without mutating the board', () => {
    for (const mark of ['X', 'O'] as const) {
      for (const line of winningLines) {
        const board: Mark[] = Array(9).fill(null);

        line.forEach((index) => {
          board[index] = mark;
        });
        expect(winner(board)).toEqual(line);
      }
    }

    expect(winner(Array(9).fill(null))).toBeUndefined();
    expect(winner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBeUndefined();
  });

  it('prioritizes winning, then blocking, then center and a free cell', () => {
    expect(botMove(['O', 'O', null, 'X', 'X', null, null, null, null])).toBe(2);
    expect(botMove(['X', 'X', null, null, 'O', null, null, null, null])).toBe(2);
    expect(botMove(['X', null, null, null, null, null, null, null, null])).toBe(4);
    spyOn(Math, 'random').and.returnValue(0);

    const board: Mark[] = ['X', null, null, null, 'O', null, null, null, null];
    const original = [...board];

    expect(botMove(board)).toBe(1);
    expect(board).toEqual(original);
  });
});

describe('mini game controls and matches', () => {
  let root: Root;
  let host: HTMLDivElement;
  let wide: boolean;
  let frame: FrameRequestCallback;

  const click = (selector: string) =>
    act(() => host.querySelector<HTMLButtonElement>(selector)!.click());
  const cell = (index: number) =>
    click(`.game-board-mini button:nth-of-type(${index + 1})`);
  const tick = () => act(() => jasmine.clock().tick(450));
  const key = (value: string) =>
    act(() =>
      host
        .querySelector('aside')!
        .dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true })),
    );
  const render = (language: 'pt' | 'en' | 'es' = 'en') =>
    act(() => root.render(<MiniGame language={language} />));

  beforeEach(() => {
    jasmine.clock().install();
    wide = false;
    spyOn(window, 'matchMedia').and.callFake(() => ({ matches: wide }) as MediaQueryList);
    spyOn(window, 'requestAnimationFrame').and.callFake((callback) => {
      frame = callback;

      return 1;
    });
    spyOn(Math, 'random').and.returnValue(0);
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    jasmine.clock().uninstall();
  });

  it('opens immediately, restores focus, minimizes and handles Escape', () => {
    render();
    expect(host.querySelector<HTMLElement>('.game-panel')!.hidden).toBeTrue();
    key('Escape');
    click('.game-launcher');
    act(() => frame(0));
    expect(document.activeElement).toBe(host.querySelector('.game-heading button'));
    expect(host.querySelector('aside')!.dataset.interacted).toBe('true');
    key('Enter');
    expect(host.querySelector<HTMLElement>('.game-panel')!.hidden).toBeFalse();
    key('Escape');
    act(() => frame(0));
    expect(document.activeElement).toBe(host.querySelector('.game-launcher'));
    click('.game-launcher');
    click('.game-heading button');
    expect(host.querySelector<HTMLElement>('.game-panel')!.hidden).toBeTrue();
    act(() => root.unmount());
    act(() => frame(0));
    root = createRoot(host);
  });

  it('starts closed on wide screens and preserves moves on language changes', () => {
    wide = true;
    render('pt');
    expect(host.querySelector<HTMLElement>('.game-panel')!.hidden).toBeTrue();
    click('.game-launcher');
    cell(0);
    cell(0);
    cell(1);
    expect(host.querySelectorAll('.mark-X').length).toBe(1);
    expect(host.querySelector('.game-status')!.textContent).toContain('Minha vez');
    tick();
    expect(host.querySelectorAll('.mark-O').length).toBe(1);
    render('es');
    expect(host.querySelector('.game-status')!.textContent).toBe('Tu turno. Eres X.');
    expect(host.querySelectorAll('.mark-X').length).toBe(1);
  });

  it('cancels a pending bot move when restarting or unmounting', () => {
    render();
    cell(0);
    click('.game-restart');
    tick();
    expect(host.querySelectorAll('.game-mark').length).toBe(0);
    cell(0);
    act(() => root.unmount());
    tick();
    expect(host.childElementCount).toBe(0);
    root = createRoot(host);
  });

  for (const [name, moves, status] of [
    ['loss', [0, 1, 3], 'I won! Another round?'],
    ['win', [0, 5, 7, 6, 8], 'You won!'],
    ['draw', [0, 1, 6, 5, 8], 'A draw! Another round?'],
  ] as const) {
    it(`finishes a ${name} and prevents further moves`, () => {
      render();

      for (const move of moves) {
        cell(move);
        tick();
      }

      expect(host.querySelector('.game-status')!.textContent).toBe(status);
      expect(host.querySelectorAll('.is-winner').length).toBe(name === 'draw' ? 0 : 3);

      const before = host.querySelectorAll('.game-mark').length;

      for (let i = 0; i < 9; i++) cell(i);
      tick();
      expect(host.querySelectorAll('.game-mark').length).toBe(before);
      click('.game-restart');
      expect(host.querySelectorAll('.game-mark').length).toBe(0);
      expect(host.querySelector('.game-status')!.textContent).toBe(
        'Your turn. You are X.',
      );
    });
  }
});
