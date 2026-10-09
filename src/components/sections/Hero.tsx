import type { Copy } from '../../content';
import type { Language } from '../../content';

import { sectionIds } from '../../lib/sections';

interface HeroProps {
  t: Copy;
  language: Language;
  reduced: boolean;
}

export default function Hero({ language }: HeroProps) {
  return (
    <section
      className="hero hero-opening shell"
      id={sectionIds[language][0]}
    >
      <div
        className="hero-code"
        role="img"
        aria-label={'console.log("Hello World");'}
      >
        <code aria-hidden="true">
          <span className="hero-typed">
            {'console.log('}
            <span className="hero-string">{'"Hello World"'}</span>
            {');'}
          </span>
        </code>
      </div>
      <div
        className="hero-bottom"
        aria-hidden="true"
      />
    </section>
  );
}
