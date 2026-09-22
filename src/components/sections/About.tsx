import { GraduationCap, Check } from 'lucide-react';

import type { Copy } from '../../content';

interface AboutProps {
  t: Copy;
}

export default function About({ t }: AboutProps) {
  return (
    <section
      className="shell about section reveal"
      id="sobre"
    >
      <div>
        <p className="eyebrow">{t.aboutLabel}</p>
        <h2>
          {t.aboutTitle[0]}
          <br />
          <span>{t.aboutTitle[1]}</span>
        </h2>
        <div className="education">
          <GraduationCap size={24} />
          <div>
            <strong>{t.education}</strong>
            <span>{t.school}</span>
          </div>
        </div>
      </div>
      <div className="about-content">
        <p>{t.aboutText}</p>
        <p>{t.aboutSecond}</p>
        <div className="principles">
          <span>
            <Check size={15} /> Design Systems
          </span>
          <span>
            <Check size={15} /> Clean Code
          </span>
          <span>
            <Check size={15} /> {t.quality}
          </span>
        </div>
      </div>
    </section>
  );
}
