import { act } from 'react';
import { createRoot } from 'react-dom/client';
import ArcadePortfolio, {
  ArcadeFooter,
} from '../../src/components/arcade/ArcadePortfolio';
import { copy, projects } from '../../src/content';
import { github } from '../../src/lib/profile';

describe('arcade portfolio', () => {
  it('uses real profile data, switches toolkits and opens every project with a working fallback', () => {
    const host = document.createElement('div');

    document.body.append(host);

    const root = createRoot(host);

    try {
      for (const language of ['pt', 'en', 'es'] as const) {
        act(() =>
          root.render(
            <>
              <ArcadePortfolio
                language={language}
                t={copy[language]}
              />
              <ArcadeFooter language={language} />
            </>,
          ),
        );
        expect(host.querySelectorAll('section').length).toBe(5);
        expect(host.querySelector('.ap-education')!.textContent).toContain(
          copy[language].education,
        );
        expect(host.querySelector<HTMLAnchorElement>('[download]')!.href).toContain(
          `CV-${language.toUpperCase()}.pdf`,
        );

        const kitButtons = host.querySelectorAll<HTMLButtonElement>(
          '.ap-kit-picker button',
        );

        kitButtons.forEach((button, i) => {
          act(() => button.click());
          expect(button.getAttribute('aria-pressed')).toBe('true');
          expect(host.querySelectorAll('.ap-kit-content li').length).toBe([5, 3, 6][i]);
        });

        const selectors = host.querySelectorAll<HTMLButtonElement>(
          '.ap-project-picker button',
        );

        selectors.forEach((button, i) => {
          act(() => button.click());
          expect(button.getAttribute('aria-pressed')).toBe('true');
          expect(host.querySelector('.ap-project-detail h3')!.textContent).toBe(
            copy[language].projectNames[i],
          );
          expect(
            host
              .querySelector<HTMLAnchorElement>('.ap-project-image')!
              .getAttribute('href'),
          ).toBe(projects[i].demo || `${github}/${projects[i].repo}`);
        });
        expect(host.querySelectorAll('.ap-stages details').length).toBe(3);
        expect(host.querySelector('details[open]')!.textContent).toContain('SoftExpert');
      }
    } finally {
      act(() => root.unmount());
      host.remove();
    }
  });
});
