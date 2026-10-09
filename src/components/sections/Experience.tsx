import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';

interface ExperienceProps {
  language: Language;
  t: Copy;
}

export default function Experience({ t, language }: ExperienceProps) {
  return (
    <section
      className="shell section experience career-section"
      id={sectionIds[language][2]}
      aria-labelledby="career-title"
    >
      <header className="career-heading reveal">
        <p className="eyebrow">{t.experienceLabel}</p>
        <h2 id="career-title">{t.experienceTitle}</h2>
      </header>
      <div className="timeline career-timeline">
        {t.jobs.map((job, i) => (
          <article
            className="career-step reveal"
            key={job.company + i}
          >
            <span
              className="career-marker"
              aria-hidden="true"
            >
              0{i + 1}
            </span>
            <div className="career-card">
              <div className="career-date">
                <span>{job.date}</span>
                {i === 0 && <b>{t.current}</b>}
              </div>
              <span className="career-company">{job.company}</span>
              <h3>{job.role}</h3>
              <p>{job.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
