import type { CSSProperties } from 'react';
import type { Copy, Language } from '../../content';

const groups = [
  [
    ['React', 'react'],
    ['Angular', 'angular'],
    ['TypeScript', 'typescript'],
    ['React Native', 'react'],
    ['Next.js', 'nextjs'],
  ],
  [
    ['Jest', 'jest'],
    ['Testing Library', 'testinglibrary'],
    ['Storybook', 'storybook'],
  ],
  [
    ['Node.js', 'nodejs'],
    ['Java', 'java'],
    ['MySQL', 'mysql'],
    ['AWS', 'amazonwebservices'],
    ['Docker', 'docker'],
    ['Git', 'git'],
  ],
];
const labels = {
  pt: {
    eyebrow: 'FERRAMENTAS & PRÁTICA',
    intro:
      'Da interface à entrega: as ferramentas que uso para construir, testar e evoluir aplicações.',
    groups: [
      [
        'Front-end & mobile',
        'Interfaces web e mobile, componentes reutilizáveis e integração com APIs.',
      ],
      [
        'Qualidade & design system',
        'Testes de comportamento, documentação de componentes e consistência visual.',
      ],
      [
        'Back-end & infraestrutura',
        'Serviços, bancos de dados, integrações em nuvem e ambientes de desenvolvimento.',
      ],
    ],
  },
  en: {
    eyebrow: 'TOOLS & PRACTICE',
    intro:
      'From interface to delivery: the tools I use to build, test and evolve applications.',
    groups: [
      [
        'Front-end & mobile',
        'Web and mobile interfaces, reusable components and API integration.',
      ],
      [
        'Quality & design systems',
        'Behavior testing, component documentation and visual consistency.',
      ],
      [
        'Back-end & infrastructure',
        'Services, databases, cloud integrations and development environments.',
      ],
    ],
  },
  es: {
    eyebrow: 'HERRAMIENTAS & PRÁCTICA',
    intro:
      'De la interfaz a la entrega: las herramientas que uso para construir, probar y evolucionar aplicaciones.',
    groups: [
      [
        'Front-end & móvil',
        'Interfaces web y móviles, componentes reutilizables e integración con APIs.',
      ],
      [
        'Calidad & sistemas de diseño',
        'Pruebas de comportamiento, documentación de componentes y consistencia visual.',
      ],
      [
        'Back-end & infraestructura',
        'Servicios, bases de datos, integraciones en la nube y entornos de desarrollo.',
      ],
    ],
  },
};

export default function Skills({ t, language }: { t: Copy; language: Language }) {
  const text = labels[language];

  return (
    <section
      id="technologies"
      className="shell skills technology-section"
      aria-labelledby="technology-title"
    >
      <header className="technology-heading reveal">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2 id="technology-title">{t.skillsTitle}</h2>
        <p>{text.intro}</p>
      </header>
      <div className="technology-groups">
        {groups.map((items, index) => (
          <article
            className="technology-group reveal"
            key={index}
          >
            <div className="technology-group-heading">
              <span
                className="technology-index"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <h3>{text.groups[index][0]}</h3>
              <p>{text.groups[index][1]}</p>
            </div>
            <ul className="technology-list">
              {items.map(([name, icon], itemIndex) => (
                <li
                  key={name}
                  style={{ '--item-delay': `${itemIndex * 65}ms` } as CSSProperties}
                >
                  <div className="technology-item">
                    <span className="technology-icon">
                      <img
                        src={`/technology-icons/${icon}.svg`}
                        alt=""
                        width="32"
                        height="32"
                        loading="lazy"
                      />
                    </span>
                    <span>{name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
