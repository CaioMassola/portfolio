import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import App from '../../src/App';
import { usePreferences } from '../../src/hooks/usePreferences';
import { readPreference, savePreference } from '../../src/lib/storage';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

async function renderApp(language?: string, theme?: string) {
  localStorage.clear();
  if (language) localStorage.setItem('cm-language', language);
  if (theme) localStorage.setItem('cm-theme', theme);
  await act(async () => root.render(<App />));
}

function click(selector: string) {
  const element = host.querySelector<HTMLElement>(selector)!;

  act(() => element.click());
}

async function dispatchViewportEvent(type: 'scroll' | 'resize') {
  await act(async () => {
    window.dispatchEvent(new Event(type));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
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

  it('switches between classic and arcade and restores the saved mode', async () => {
    await renderApp();
    click('.arcade-toggle');
    expect(host.querySelector('.arcade-home')).not.toBeNull();
    expect(localStorage.getItem('cm-arcade')).toBe('on');
    click('.arcade-toggle');
    expect(host.querySelector('.hero-code')).not.toBeNull();
    click('.arcade-toggle');
    await act(async () => root.unmount());
    root = createRoot(host);
    await act(async () => root.render(<App />));
    expect(host.querySelector('.arcade-home')).not.toBeNull();
  });

  it('renders every section and exercises the Portuguese controls', async () => {
    await renderApp();

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(host.querySelectorAll('.project-card').length).toBe(5);
    expect(host.querySelectorAll('.project-shot img').length).toBe(5);
    expect(host.querySelectorAll('.skills span').length).toBeGreaterThan(10);
    expect(host.querySelectorAll('.timeline article').length).toBe(3);
    expect(host.querySelectorAll('.demo-link').length).toBe(3);
    expect(
      host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href'),
    ).toBe('/Caio-Massola-CV-PT.pdf');

    click('.theme-toggle');
    expect(document.documentElement.dataset.theme).toBe('light');
    click('.menu-toggle');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe(
      'Fechar menu',
    );
    expect(host.querySelector('.navigation')?.classList.contains('open')).toBeTrue();
    click('.navigation a');
    expect(host.querySelector('.navigation')?.classList.contains('open')).toBeFalse();

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

  it('navigates between the visible sections', async () => {
    const scrollIntoView = spyOn(HTMLElement.prototype, 'scrollIntoView');
    const scrollY = spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    const ids = ['inicio', 'sobre', 'technologies', 'experiencia', 'projetos', 'contato'];
    const bounds = spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.callFake(
      function (this: HTMLElement) {
        return { top: ids.indexOf(this.id) * 1000 } as DOMRect;
      },
    );

    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);
    spyOnProperty(document.documentElement, 'scrollHeight', 'get').and.returnValue(5000);

    await renderApp();
    await dispatchViewportEvent('scroll');

    const navigation = host.querySelector('.section-navigation')!;
    const [previous, next] = Array.from(navigation.querySelectorAll('button'));

    expect(previous.disabled).toBeTrue();
    next.click();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(scrollIntoView.calls.mostRecent().object.id).toBe('sobre');

    host.querySelector<HTMLElement>('#sobre')!.style.scrollMarginTop = '20px';
    document.documentElement.style.scrollPaddingTop = '105px';
    bounds.and.callFake(function (this: HTMLElement) {
      return { top: ids.indexOf(this.id) * 1000 - 875 } as DOMRect;
    });
    await dispatchViewportEvent('scroll');
    next.click();
    expect(scrollIntoView.calls.mostRecent().object.id).toBe('technologies');
    document.documentElement.style.scrollPaddingTop = '';
    bounds.and.returnValue({ top: 0 } as DOMRect);
    await dispatchViewportEvent('resize');

    expect(next.disabled).toBeTrue();
    previous.click();
    expect(scrollIntoView.calls.mostRecent().object.id).toBe('projetos');

    scrollY.and.returnValue(4200);
    await dispatchViewportEvent('scroll');
    expect(next.disabled).toBeTrue();
  });

  it('loads English with light theme and switches language and theme', async () => {
    await renderApp('en', 'light');

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Front-End Software Engineer');
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe('Menu');
    expect(
      host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href'),
    ).toBe('/Caio-Massola-CV-EN.pdf');
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
    expect(
      host.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href'),
    ).toBe('/Caio-Massola-CV-ES.pdf');
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Navegación');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe('Menú');
    click('.menu-toggle');
    expect(host.querySelector('.menu-toggle')?.getAttribute('aria-label')).toBe(
      'Cerrar menú',
    );
  });

  it('ignores the current language and switches without a visible section', async () => {
    function PreferencesControl() {
      const { language, setLanguage } = usePreferences();

      return (
        <button onClick={() => setLanguage(language === 'pt' ? 'pt' : 'es')}>
          {language}
        </button>
      );
    }

    localStorage.clear();
    await act(async () => root.render(<PreferencesControl />));
    click('button');
    expect(host.textContent).toBe('pt');
    await act(async () => root.unmount());
    localStorage.setItem('cm-language', 'en');
    root = createRoot(host);
    await act(async () => root.render(<PreferencesControl />));
    click('button');
    expect(host.textContent).toBe('es');
    expect(document.documentElement.lang).toBe('es');
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
