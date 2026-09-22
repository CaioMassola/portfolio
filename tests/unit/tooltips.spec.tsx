import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import ActionTooltips from '../../src/components/layout/ActionTooltips';

let host: HTMLDivElement;
let root: Root;
let button: HTMLButtonElement;
let tooltip: HTMLElement;

function hover(element: EventTarget, pointerType = 'mouse') {
  element.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType }));
}

function escape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
}

describe('icon action tooltips', () => {
  beforeEach(async () => {
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    await act(async () =>
      root.render(
        <>
          <button
            className="icon-button"
            aria-label="Change theme"
          />
          <a
            className="button"
            href="#projects"
          >
            View projects
          </a>
          <ActionTooltips />
        </>,
      ),
    );
    button = host.querySelector('button')!;
    tooltip = document.querySelector('[role="tooltip"]')!;
    jasmine.clock().install();
  });

  afterEach(async () => {
    jasmine.clock().uninstall();
    await act(async () => root.unmount());
    host.remove();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens only for icon controls, preserves descriptions and dismisses with Escape', () => {
    hover(host.querySelector('a')!);
    expect(tooltip.hidden).toBeTrue();
    hover(button, 'touch');
    expect(tooltip.hidden).toBeTrue();
    document.dispatchEvent(new Event('focusin'));
    button.setAttribute('aria-describedby', 'existing');
    button.focus();
    expect(tooltip.textContent).toBe('Change theme');
    expect(button.getAttribute('aria-describedby')).toContain('existing');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(tooltip.hidden).toBeFalse();
    escape();
    expect(tooltip.hidden).toBeTrue();
    expect(button.getAttribute('aria-describedby')).toBe('existing');
    expect(document.activeElement).toBe(button);
    button.removeAttribute('aria-describedby');
    hover(button);
    hover(button);
    expect(tooltip.hidden).toBeFalse();
    escape();
    expect(button.hasAttribute('aria-describedby')).toBeFalse();
  });

  it('allows pointer travel to the tooltip and keeps it while focused or hovered', () => {
    const buttonMatches = spyOn(button, 'matches').and.returnValue(false);
    const tooltipMatches = spyOn(tooltip, 'matches').and.returnValue(false);

    hover(button);
    button.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
    hover(tooltip);
    jasmine.clock().tick(200);
    expect(tooltip.hidden).toBeFalse();
    buttonMatches.and.returnValue(true);
    button.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    jasmine.clock().tick(200);
    expect(tooltip.hidden).toBeFalse();
    buttonMatches.and.returnValue(false);
    tooltipMatches.and.returnValue(true);
    tooltip.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
    jasmine.clock().tick(200);
    expect(tooltip.hidden).toBeFalse();
    tooltipMatches.and.returnValue(false);
    tooltip.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
    jasmine.clock().tick(200);
    expect(tooltip.hidden).toBeTrue();
    document.dispatchEvent(new Event('pointerout'));
    jasmine.clock().tick(200);
    expect(tooltip.hidden).toBeTrue();
  });

  it('updates labels and positions above or below the control within viewport edges', async () => {
    spyOn(tooltip, 'getBoundingClientRect').and.returnValue({
      width: 120,
      height: 40,
    } as DOMRect);

    const bounds = spyOn(button, 'getBoundingClientRect').and.returnValue({
      left: -20,
      top: 0,
      bottom: 30,
      width: 20,
    } as DOMRect);

    hover(button);
    expect(tooltip.style.left).toBe('8px');
    expect(tooltip.style.top).toBe('38px');
    bounds.and.returnValue({
      left: window.innerWidth,
      top: 100,
      bottom: 130,
      width: 20,
    } as DOMRect);
    button.setAttribute('aria-label', 'New label');
    await Promise.resolve();
    expect(tooltip.textContent).toBe('New label');
    expect(tooltip.style.top).toBe('52px');
    expect(parseFloat(tooltip.style.left)).toBe(window.innerWidth - 128);
    button.removeAttribute('aria-label');
    await Promise.resolve();
    expect(tooltip.textContent).toBe('');
    button.removeAttribute('aria-describedby');
    window.dispatchEvent(new Event('resize'));
    expect(tooltip.hidden).toBeTrue();
    button.setAttribute('aria-label', 'Restored');
    await Promise.resolve();
    expect(tooltip.hidden).toBeTrue();
    hover(button);
    window.dispatchEvent(new Event('scroll'));
    expect(tooltip.hidden).toBeTrue();
    hover(button);
  });
});
