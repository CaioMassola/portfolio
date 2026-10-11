import { act } from 'react';
import { createRoot } from 'react-dom/client';
import ArcadeTerminal from '../../src/components/arcade/ArcadeTerminal';
import { copy } from '../../src/content';
import { runTerminal, terminalCommands } from '../../src/lib/terminal';

describe('local terminal', () => {
  it('handles every command and treats unknown input as plain text', () => {
    for (const language of ['pt', 'en', 'es'] as const) {
      for (const command of terminalCommands)
        expect(runTerminal(command, language, copy[language])).toBeDefined();
      expect(runTerminal(' PLAY   SNAKE ', language, copy[language]).game).toBe('snake');
      expect(runTerminal('play invalid', language, copy[language]).game).toBeUndefined();
      expect(runTerminal('go invalid', language, copy[language]).game).toBeUndefined();
      expect(runTerminal('<script>', language, copy[language]).text).toContain('help');
    }
  });
  it('keeps history, completes commands, clears, closes and launches a game', () => {
    const host = document.createElement('div');

    document.body.append(host);

    const root = createRoot(host);
    const onPlay = jasmine.createSpy();

    spyOn(window, 'requestAnimationFrame').and.callFake((callback) => {
      callback(0);

      return 1;
    });

    const render = () =>
      act(() =>
        root.render(
          <ArcadeTerminal
            language="en"
            onPlay={onPlay}
          />,
        ),
      );
    const click = (selector: string) =>
      act(() => host.querySelector<HTMLButtonElement>(selector)!.click());
    const input = () => host.querySelector<HTMLInputElement>('input')!;
    const type = (value: string) =>
      act(() => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
          input(),
          value,
        );
        input().dispatchEvent(new Event('input', { bubbles: true }));
      });
    const key = (key: string, shiftKey = false) =>
      act(() =>
        input().dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            shiftKey,
            bubbles: true,
            cancelable: true,
          }),
        ),
      );
    const submit = () =>
      act(() =>
        host
          .querySelector('form')!
          .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
      );

    render();
    click('.arcade-terminal-heading button');
    submit();
    key('ArrowUp');
    key('Tab');
    type('hel');
    key('Tab');
    expect(input().value).toBe('help');
    submit();
    type('draft');
    key('ArrowUp');
    expect(input().value).toBe('help');
    key('ArrowDown');
    expect(input().value).toBe('draft');
    type('play');
    key('Tab');
    key('Tab', true);
    key('Escape');

    for (const command of [
      'about',
      'skills',
      'projects',
      'contact',
      'go about',
      'go skills',
      'bad',
    ]) {
      type(command);
      submit();
    }

    expect(host.querySelectorAll('.arcade-console-entry').length).toBe(8);
    type('clear');
    submit();
    expect(host.querySelectorAll('.arcade-console-entry').length).toBe(0);
    type('about');
    submit();
    type('play memory');
    submit();
    expect(onPlay).toHaveBeenCalledWith(
      'memory',
      host.querySelector('.arcade-terminal-heading button'),
      jasmine.any(Function),
    );
    act(() => onPlay.calls.mostRecent().args[2]());
    expect(host.querySelectorAll('.arcade-console-entry').length).toBe(2);
    expect(host.querySelector('.arcade-console-entry')!.textContent).toContain(
      'Caio Massola',
    );
    expect(host.querySelector('.arcade-console-log')!.textContent).not.toContain(
      'Opening',
    );
    type('projects');
    submit();
    expect(host.querySelector('.arcade-console a')).toBeNull();
    click('.arcade-player-heading button:not(.arcade-sound-toggle)');
    expect(host.querySelector('dialog')).toBeNull();
    act(() => root.unmount());
    host.remove();
  });
});
