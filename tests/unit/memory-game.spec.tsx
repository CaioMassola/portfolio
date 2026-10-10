import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import MemoryGame from '../../src/components/layout/MemoryGame';
import { createMemoryDeck, memoryTechnologies } from '../../src/lib/memoryGame';

describe('memory game', () => {
  let host: HTMLDivElement;
  let root: Root;
  let frame: FrameRequestCallback;
  const render = (language: 'en' | 'es' | 'pt' = 'en') =>
    act(() => root.render(<MemoryGame language={language} />));
  const click = (selector: string) =>
    act(() => host.querySelector<HTMLButtonElement>(selector)!.click());
  const card = (index: number) => click(`.memory-card:nth-child(${index + 1})`);
  const tick = () => act(() => jasmine.clock().tick(900));
  const key = (key: string) =>
    act(() =>
      host
        .querySelector('aside')!
        .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })),
    );

  beforeEach(() => {
    jasmine.clock().install();
    spyOn(Math, 'random').and.returnValue(0.999);
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
  });

  it('arcade embeds twelve pairs and resets all cards', () => {
    act(() =>
      root.render(
        <MemoryGame
          language="pt"
          arcade
        />,
      ),
    );
    expect(host.querySelectorAll('.memory-card').length).toBe(24);

    for (let i = 0; i < 12; i++) {
      card(i);
      card(i + 12);
    }

    expect(host.querySelector('.memory-score')!.textContent).toContain('12 / 12');
    expect(host.querySelector('.memory-status')!.textContent).toContain('Boa!');
    click('.memory-restart');
    expect(host.querySelectorAll('.is-matched').length).toBe(0);
  });

  it('creates independent shuffled decks with exactly six pairs', () => {
    const deck = createMemoryDeck();

    expect(deck.length).toBe(12);

    for (const technology of memoryTechnologies) {
      expect(deck.filter((item) => item === technology).length).toBe(2);
    }

    (Math.random as jasmine.Spy).and.returnValue(0);
    expect(createMemoryDeck()).not.toEqual(deck);
    expect(createMemoryDeck()).not.toBe(deck);
  });

  it('opens immediately, minimizes and restores keyboard focus', () => {
    render();
    expect(host.querySelector<HTMLElement>('.memory-panel')!.hidden).toBeTrue();
    key('Escape');
    click('.memory-launcher');
    act(() => frame(0));
    expect(document.activeElement).toBe(host.querySelector('.memory-heading button'));
    expect(host.querySelector('aside')!.dataset.interacted).toBe('true');
    key('Enter');
    expect(host.querySelector<HTMLElement>('.memory-panel')!.hidden).toBeFalse();
    key('Escape');
    act(() => frame(0));
    expect(document.activeElement).toBe(host.querySelector('.memory-launcher'));
    click('.memory-launcher');
    click('.memory-heading button');
    act(() => root.unmount());
    act(() => frame(0));
    root = createRoot(host);
  });

  it('hides mismatches after a delay and rejects duplicate and third selections', () => {
    render();
    card(0);
    card(0);
    expect(host.querySelector('.memory-score')!.textContent).toContain('0 attempts');
    card(1);
    card(2);
    expect(host.querySelectorAll('.is-flipped').length).toBe(2);
    expect(host.querySelector('.memory-score')!.textContent).toContain('1 attempts');
    tick();
    expect(host.querySelectorAll('.is-flipped').length).toBe(0);
    expect(host.querySelector('.memory-card')!.getAttribute('aria-label')).toContain(
      'face down',
    );
  });

  it('keeps matches, translates in place and announces completion', () => {
    render('pt');
    card(0);
    card(6);
    card(0);
    expect(host.querySelectorAll('.is-matched').length).toBe(2);
    render('es');
    expect(host.querySelector('.memory-score')!.textContent).toContain('1 / 6 parejas');
    render();

    for (let i = 1; i < 6; i++) {
      card(i);
      card(i + 6);
    }

    expect(host.querySelector('.memory-status')!.textContent).toBe(
      'Nice! You found every pair.',
    );
    expect(host.querySelector('.memory-score')!.textContent).toBe(
      '6 / 6 pairs · 6 attempts',
    );
    expect(host.querySelectorAll('.is-matched').length).toBe(12);
    click('.memory-restart');
    expect(host.querySelectorAll('.is-flipped').length).toBe(0);
    expect(host.querySelector('.memory-score')!.textContent).toContain('0 attempts');
  });

  it('cancels pending flips on restart and unmount', () => {
    render();
    card(0);
    card(1);
    click('.memory-restart');
    card(2);
    tick();
    expect(host.querySelectorAll('.is-flipped').length).toBe(1);
    card(3);
    act(() => root.unmount());
    tick();
    expect(host.childElementCount).toBe(0);
    root = createRoot(host);
  });
});
