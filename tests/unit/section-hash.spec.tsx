import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import type { Language } from '../../src/content';
import { useSectionHash } from '../../src/hooks/useSectionHash';
import { sectionIds, sectionIndex } from '../../src/lib/sections';

function Sections({ language }: { language: Language }) {
  useSectionHash(language);

  return <section id={sectionIds[language][1]} />;
}

describe('localized section hashes', () => {
  let host: HTMLDivElement;
  let root: Root;
  let originalUrl: string;

  beforeEach(() => {
    originalUrl = window.location.href;
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    history.replaceState(null, '', originalUrl);
  });

  it('recognizes every language and leaves unrelated anchors alone', () => {
    expect(sectionIndex('#about')).toBe(1);
    expect(sectionIndex('#acerca')).toBe(1);
    expect(sectionIndex('#sobre')).toBe(1);
    expect(sectionIndex('#main')).toBe(-1);
    expect(sectionIndex('')).toBe(-1);
  });

  it('normalizes old links on load and language changes without adding history entries', async () => {
    history.replaceState({ test: true }, '', '#sobre');

    const scroll = spyOn(HTMLElement.prototype, 'scrollIntoView');
    const historyLength = history.length;

    await act(async () => root.render(<Sections language="en" />));
    expect(location.hash).toBe('#about');
    expect(scroll).toHaveBeenCalledTimes(1);
    await act(async () => root.render(<Sections language="es" />));
    expect(location.hash).toBe('#acerca');
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(history.length).toBe(historyLength);
    expect(history.state).toEqual({ test: true });

    history.replaceState(null, '', '#acerca');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(scroll).toHaveBeenCalledTimes(2);
    history.replaceState(null, '', '#about');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(location.hash).toBe('#acerca');
    expect(scroll).toHaveBeenCalledTimes(3);
    history.replaceState(null, '', '#contact');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(location.hash).toBe('#contacto');
    expect(scroll).toHaveBeenCalledTimes(3);
    history.replaceState(null, '', '#main');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(location.hash).toBe('#main');
  });
});
