import { useState } from 'react';
import { Code2, Globe2, Sun, Moon, Menu, X } from 'lucide-react';

import type { Copy, Language } from '../../content';

interface HeaderProps {
  t: Copy;
  language: Language;
  theme: 'dark' | 'light';
  setLanguage: (language: Language) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Header({
  t,
  language,
  theme,
  setLanguage,
  setTheme,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = ['sobre', 'experiencia', 'projetos', 'contato'];

  return (
    <header className="header">
      <div className="shell header-inner">
        <a
          className="brand"
          href="#inicio"
          aria-label="Caio Massola"
        >
          <Code2 size={25} />
          <span>
            caio<span>massola</span>
            <b>.</b>
          </span>
        </a>
        <nav
          className={menuOpen ? 'navigation open' : 'navigation'}
          aria-label={
            language === 'pt'
              ? 'Navegação'
              : language === 'es'
                ? 'Navegación'
                : 'Navigation'
          }
        >
          {t.nav.map((label, i) => (
            <a
              key={sections[i]}
              href={`#${sections[i]}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="preferences">
          <label className="language-control">
            <Globe2 size={16} />
            <span className="sr-only">{t.language}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label={t.language}
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </label>
          <span className="preference-divider" />
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t.light : t.dark}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            className="icon-button menu-toggle"
            aria-label={
              menuOpen
                ? language === 'pt'
                  ? 'Fechar menu'
                  : language === 'es'
                    ? 'Cerrar menú'
                    : 'Close menu'
                : language === 'es'
                  ? 'Menú'
                  : 'Menu'
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
