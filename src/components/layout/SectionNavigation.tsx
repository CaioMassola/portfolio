import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { Language } from '../../content';

const sectionIds = ['inicio', 'sobre', 'experiencia', 'projetos', 'contato'];

const labels: Record<Language, { previous: string; next: string }> = {
  pt: { previous: 'Seção anterior', next: 'Próxima seção' },
  en: { previous: 'Previous section', next: 'Next section' },
  es: { previous: 'Sección anterior', next: 'Siguiente sección' },
};

export default function SectionNavigation({ language }: { language: Language }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = sectionIds
          .map((id) => document.getElementById(id))
          .filter((section): section is HTMLElement => Boolean(section));

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setActiveIndex(sections.length - 1);

          return;
        }

        const marker = 120;
        let current = 0;

        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top <= marker) current = index;
        });
        setActiveIndex(current);
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  const goTo = (index: number) => {
    document.getElementById(sectionIds[index])?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav
      className="section-navigation"
      aria-label={language === 'pt' ? 'Navegação entre seções' : language === 'es' ? 'Navegación entre secciones' : 'Section navigation'}
    >
      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label={labels[language].previous}
      >
        <ArrowUp size={19} />
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === sectionIds.length - 1}
        aria-label={labels[language].next}
      >
        <ArrowDown size={19} />
      </button>
    </nav>
  );
}
