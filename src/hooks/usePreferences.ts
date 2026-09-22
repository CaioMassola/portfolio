import { useEffect, useState } from 'react';

import { copy } from '../content';
import type { Language } from '../content';
import { readPreference, savePreference } from '../lib/storage';

export function usePreferences() {
  const [language, setLanguage] = useState<Language>(() => {
    const value = readPreference('cm-language');

    return value === 'en' || value === 'es' ? value : 'pt';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    readPreference('cm-theme') === 'light' ? 'light' : 'dark',
  );
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
    document.title = `Caio Massola | ${t.role}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', `Caio Massola. ${t.role}. ${t.intro}`);
    savePreference('cm-language', language);
  }, [language, t]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#060912' : '#edf5ff');
    savePreference('cm-theme', theme);
  }, [theme]);

  return { language, setLanguage, theme, setTheme, t };
}
