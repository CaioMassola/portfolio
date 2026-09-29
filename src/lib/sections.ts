import type { Language } from '../content';

export const sectionIds: Record<Language, readonly string[]> = {
  pt: ['inicio', 'sobre', 'experiencia', 'projetos', 'contato'],
  en: ['home', 'about', 'experience', 'projects', 'contact'],
  es: ['inicio', 'acerca', 'experiencia', 'proyectos', 'contacto'],
};

export function sectionIndex(hash: string) {
  for (const ids of Object.values(sectionIds)) {
    const index = ids.indexOf(hash.replace(/^#/, ''));

    if (index !== -1) return index;
  }

  return -1;
}
