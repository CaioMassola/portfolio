import { Code2 } from 'lucide-react';

import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';

export default function Footer({ t, language }: { t: Copy; language: Language }) {
  return (
    <footer className="shell footer">
      <a
        className="brand"
        href={`#${sectionIds[language][0]}`}
      >
        <Code2 size={22} />
        <span>
          caio<span>massola</span>
          <b>.</b>
        </span>
      </a>
      <p>
        © {new Date().getFullYear()} Caio Massola. {t.footer}
      </p>
    </footer>
  );
}
