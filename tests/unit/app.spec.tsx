import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import App from '../../src/App';
import { readPreference, savePreference } from '../../src/lib/storage';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

interface MediaMock extends MediaQueryList {
  emit: (matches: boolean) => void;
}

let media: MediaMock;
let observerCallback: IntersectionObserverCallback;
let observed: Element[];
let root: Root;
let host: HTMLDivElement;

class ObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe(element: Element) {
    observed.push(element);
  }

  unobserve(element: Element) {
    observed = observed.filter((item) => item !== element);
  }

  disconnect() {
    observed = [];
  }
}

function makeMedia(initial = false): MediaMock {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  const value = {
    matches: initial,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type: string, callback: EventListenerOrEventListenerObject) => {
      listener = callback as (event: MediaQueryListEvent) => void;
    },
    removeEventListener: () => {
      listener = undefined;
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
    emit(matches: boolean) {
      value.matches = matches;
      listener?.({ matches } as MediaQueryListEvent);
    },
  };

  return value as MediaMock;
}

async function renderApp(language?: string, theme?: string, reduced = false) {
  localStorage.clear();
  if (language) localStorage.setItem('cm-language', language);
  if (theme) localStorage.setItem('cm-theme', theme);
  media = makeMedia(reduced);
  window.matchMedia = () => media;

  await act(async () => root.render(<App />));
}

function click(selector: string) {
  const element = host.querySelector<HTMLElement>(selector)!;

  act(() => element.click());
}

describe('portfolio application', () => {
  beforeEach(() => {
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    observed = [];
    window.IntersectionObserver = ObserverMock as unknown as typeof IntersectionObserver;
    document.head.innerHTML =
      '<meta name="description" content=""><meta name="theme-color" content="">';
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    localStorage.clear();
  });

  it('renders every section and exercises the Portuguese controls', async () => {
    await renderApp();

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(host.querySelectorAll('.project-card').length).toBe(4);
    expect(host.querySelectorAll('.project-shot img').length).toBe(4);
    expect(host.querySelectorAll('.skills span').length).toBeGreaterThan(10);
    expect(host.querySelectorAll('.timeline article').length).toBe(3);
    expect(host.querySelectorAll('.demo-link').length).toBe(3);
    expect(host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href')).toBe(
      '/Caio-Massola-CV-PT.pdf',
    );

    click('.theme-toggle');
    expect(document.documentElement.dataset.theme).toBe('light');
    click('.menu-toggle');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe(
      'Fechar menu',
    );
    expect(host.querySelector('.navigation')?.classList.contains('open')).toBeTrue();
    click('.navigation a');
    expect(host.querySelector('.navigation')?.classList.contains('open')).toBeFalse();

    act(() => media.emit(true));
    act(() => media.emit(false));

    const visible = observed[0];

    observerCallback(
      [
        { isIntersecting: false, target: visible },
        { isIntersecting: true, target: visible },
      ] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
    expect(visible.classList.contains('is-visible')).toBeTrue();
  });

  it('loads English with light theme and switches language and theme', async () => {
    await renderApp('en', 'light', true);

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Front-End Software Engineer');
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe('Menu');
    expect(host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href')).toBe(
      '/Caio-Massola-CV-EN.pdf',
    );
    click('.menu-toggle');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe(
      'Close menu',
    );
    click('.menu-toggle');

    click('.theme-toggle');
    expect(document.documentElement.dataset.theme).toBe('dark');

    const select = host.querySelector('select')!;

    select.value = 'es';
    await act(async () => select.dispatchEvent(new Event('change', { bubbles: true })));
    expect(document.documentElement.lang).toBe('es');
    expect(host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href')).toBe(
      '/Caio-Massola-CV-ES.pdf',
    );
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Navegación');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe('Menú');
    click('.menu-toggle');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe(
      'Cerrar menú',
    );
  });

  it('falls back to Portuguese and remains usable when storage is blocked', async () => {
    const get = spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    const set = spyOn(Storage.prototype, 'setItem').and.throwError('blocked');

    expect(readPreference('anything')).toBeNull();
    expect(() => savePreference('anything', 'value')).not.toThrow();
    await renderApp();
    expect(document.documentElement.lang).toBe('pt-BR');

    get.and.callThrough();
    set.and.callThrough();
  });

  it('falls back for unsupported saved preference values', async () => {
    await renderApp('unsupported', 'unsupported');
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('supports missing optional metadata', async () => {
    document.head.innerHTML = '';
    await renderApp('es', 'dark');
    expect(document.title).toContain('Ingeniero');
  });
});
