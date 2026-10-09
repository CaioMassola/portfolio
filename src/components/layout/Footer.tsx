import { Code2, Github, Linkedin, Instagram } from 'lucide-react';

import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';
import { github, linkedin, instagram } from '../../lib/profile';

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
      <div className="footer-socials">
        <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} aria-hidden="true" />LinkedIn</a>
        <a href={github} target="_blank" rel="noreferrer"><Github size={18} aria-hidden="true" />GitHub</a>
        {instagram && <a href={instagram} target="_blank" rel="noreferrer"><Instagram size={18} aria-hidden="true" />Instagram</a>}
      </div>
      <p>
        © {new Date().getFullYear()} Caio Massola. {t.footer}
      </p>
    </footer>
  );
}
