import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  MapPin,
} from 'lucide-react';

import type { Copy } from '../../content';
import type { Language } from '../../content';
import { github, linkedin } from '../../lib/profile';

interface HeroProps {
  t: Copy;
  language: Language;
  reduced: boolean;
}

const cvByLanguage: Record<Language, string> = {
  pt: '/Caio-Massola-CV-PT.pdf',
  en: '/Caio-Massola-CV-EN.pdf',
  es: '/Caio-Massola-CV-ES.pdf',
};

export default function Hero({ t, language }: HeroProps) {
  return (
    <section
      className="hero shell"
      id="inicio"
    >
      <div className="hero-copy">
        <p className="eyebrow">
          <span /> {t.hello}
        </p>
        <p className="hero-name">Caio Massola</p>
        <h1>
          <span className="headline-line">{t.headline[0]}</span>
          <br />
          <span className="headline-line headline-accent">{t.headline[1]}</span>
        </h1>
        <div className="role">
          <span /> {t.role}
        </div>
        <p className="hero-description">{t.intro}</p>
        <div className="hero-actions">
          <a
            className="button primary"
            href="#projetos"
          >
            {t.projectsCta}
            <ArrowUpRight size={18} />
          </a>
          <a
            className="button secondary"
            href={cvByLanguage[language]}
            download
          >
            {t.cv}
            <Download size={16} />
          </a>
        </div>
        <div className="hero-socials">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github size={19} />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={19} />
          </a>
          <div />
          <span>
            <MapPin size={14} />
            {t.location}
          </span>
        </div>
      </div>
      <div className="hero-visual">
        <span className="portrait-number">01 / 04</span>
        <div className="portrait-frame">
          <img
            src="/caio.jpeg"
            alt="Caio Massola"
            width="1075"
            height="1301"
            fetchPriority="high"
          />
          <div className="portrait-shade" />
          <div className="portrait-label">
            <span>CAIO MASSOLA</span>
            <span>FRONT-END ENGINEER ↗</span>
          </div>
          <span className="portrait-corner" />
        </div>
        <p className="portrait-note">Front-end engineer<br />São Paulo — BR</p>
      </div>
      <div className="hero-bottom">
        <span>{t.scroll}</span>
        <div>
          <span>
            06+ <small>{t.years}</small>
          </span>
          <i />
          <span>
            100% <small>{t.focus}</small>
          </span>
        </div>
      </div>
    </section>
  );
}
