import { Download, Github, Linkedin, Instagram, GraduationCap } from 'lucide-react';
import type { Copy, Language } from '../../content';
import { github, linkedin, instagram } from '../../lib/profile';
import { sectionIds } from '../../lib/sections';

interface AboutProps {
  language: Language;
  t: Copy;
}
const cvByLanguage: Record<Language, string> = {
  pt: '/Caio-Massola-CV-PT.pdf',
  en: '/Caio-Massola-CV-EN.pdf',
  es: '/Caio-Massola-CV-ES.pdf',
};

export default function About({ t, language }: AboutProps) {
  return (
    <section
      className="shell about about-introduction section"
      id={sectionIds[language][1]}
    >
      <div className="hero-copy section-enter">
        <p className="eyebrow">{t.aboutLabel}</p>
        <h1>
          {t.headline[0]}
          <span className="hero-period">{t.headline[1]}</span>
        </h1>
        <p className="hero-description">{t.intro}</p>
        <p className="about-background">{t.aboutSecond}</p>
        <p className="about-background">{t.aboutBackground}</p>
        <div className="hero-actions">
          <a
            className="button primary"
            href={`#${sectionIds[language][3]}`}
          >
            {t.projectsCta}
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
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram
              size={19}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
      <div className="hero-visual section-enter">
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
      </div>
      <div
        className="education section-enter"
        role="group"
        aria-labelledby="education-label"
      >
        <GraduationCap
          size={32}
          aria-hidden="true"
        />
        <div>
          <p
            id="education-label"
            className="education-label"
          >
            {t.educationLabel}
          </p>
          <h2>{t.education}</h2>
          <span>{t.school}</span>
        </div>
      </div>
    </section>
  );
}
