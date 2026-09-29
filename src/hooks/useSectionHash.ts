import { useEffect, useRef } from 'react';

import type { Language } from '../content';
import { sectionIds, sectionIndex } from '../lib/sections';

export function useSectionHash(language: Language) {
  const initial = useRef(true);

  useEffect(() => {
    const syncHash = (scroll: boolean) => {
      const index = sectionIndex(window.location.hash);

      if (index === -1) return;

      const id = sectionIds[language][index];

      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(window.history.state, '', `#${id}`);
      }

      if (scroll) document.getElementById(id)?.scrollIntoView();
    };

    const onHashChange = () => syncHash(true);

    syncHash(initial.current);
    initial.current = false;
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, [language]);
}
