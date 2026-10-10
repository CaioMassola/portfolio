import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { pickPrank, prankEffects } from '../../src/lib/pranks';
import PrankButton from '../../src/components/layout/PrankButton';

describe('temporary mirrored text prank', () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    jasmine.clock().install();
    spyOn(Math, 'random').and.returnValue(0);
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    act(() => root.render(<PrankButton language="pt" />));
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    jasmine.clock().uninstall();
  });

  it('mirrors for ten seconds, restores the page and allows another round', () => {
    const button = host.querySelector('button')!;

    expect(document.body.classList.contains('prank-chaos')).toBeFalse();
    act(() => button.click());
    expect(document.body.classList.contains('prank-chaos')).toBeTrue();
    expect(document.querySelector('.prank-message')!.textContent).toBe('Eu avisei 😅');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    act(() => jasmine.clock().tick(9999));
    expect(document.body.classList.contains('prank-chaos')).toBeTrue();
    act(() => jasmine.clock().tick(1));
    expect(document.body.classList.contains('prank-chaos')).toBeFalse();
    expect(document.querySelector('.prank-message')!.textContent).toBe('');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    act(() => button.click());
    expect(document.body.classList.contains('prank-scribbles')).toBeTrue();
  });

  it('translates without restarting the timer and cleans up on unmount', () => {
    act(() => host.querySelector('button')!.click());
    act(() => jasmine.clock().tick(5000));
    act(() => root.render(<PrankButton language="en" />));
    expect(document.querySelector('.prank-message')!.textContent).toBe('I warned you 😅');
    act(() => root.render(<PrankButton language="es" />));
    expect(document.querySelector('.prank-message')!.textContent).toBe(
      'Te lo advertí 😅',
    );
    act(() => jasmine.clock().tick(5000));
    expect(document.body.classList.contains('prank-chaos')).toBeFalse();
    act(() => host.querySelector('button')!.click());
    act(() => root.unmount());
    expect(document.body.classList.contains('prank-chaos')).toBeFalse();
    expect(document.querySelector('.prank-message')).toBeNull();
    act(() => jasmine.clock().tick(10000));
    root = createRoot(host);
  });
});

describe('prank selection', () => {
  it('can pick both effects and excludes the last effect', () => {
    const random = spyOn(Math, 'random');

    prankEffects.forEach((effect, index) => {
      random.and.returnValue((index + 0.1) / 2);
      expect(pickPrank(null)).toBe(effect);
      expect(pickPrank(effect)).not.toBe(effect);
    });
  });
});

describe('prank overlays and escape', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    jasmine.clock().install();
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    jasmine.clock().uninstall();
  });

  for (const [index, effect] of prankEffects.entries()) {
    it(`restores ${effect} with Escape and automatic timeout`, () => {
      spyOn(Math, 'random').and.returnValue((index + 0.1) / 2);
      act(() => root.render(<PrankButton language="pt" />));

      const button = host.querySelector('button')!;

      act(() => button.click());

      expect(document.body.classList.contains(`prank-${effect}`)).toBeTrue();
      act(() =>
        document.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        ),
      );
      expect(document.body.classList.contains(`prank-${effect}`)).toBeTrue();

      if (effect === 'scribbles') {
        expect(document.querySelectorAll('.prank-scribble-overlay path').length).toBe(42);
        act(() => document.querySelector<HTMLButtonElement>('.prank-clear')!.click());
        expect(document.activeElement).toBe(button);
      } else {
        act(() =>
          document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
          ),
        );
      }

      expect(document.body.classList.contains(`prank-${effect}`)).toBeFalse();
      expect(document.querySelector('.prank-clear')).toBeNull();
      act(() => button.click());
      act(() => jasmine.clock().tick(10000));
      expect(document.body.className).not.toContain('prank-');
      act(() => button.click());
      expect(button.getAttribute('aria-pressed')).toBe('true');
      act(() => button.click());
      expect(button.getAttribute('aria-pressed')).toBe('false');
      expect(document.body.className).not.toContain('prank-');
      act(() => jasmine.clock().tick(10000));
      expect(document.body.className).not.toContain('prank-');
    });
  }
});
