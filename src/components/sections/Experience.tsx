import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';

interface ExperienceProps {
  language: Language;
  t: Copy;
}

export default function Experience({ t, language }: ExperienceProps) {
  return (
    <section
      className="shell section experience reveal"
      id={sectionIds[language][2]}
    >
      <p className="eyebrow">{t.experienceLabel}</p>
      <h2>{t.experienceTitle}</h2>
      <div className="timeline">
        {t.jobs.map((job, i) => (
          <article key={job.company + job.date}>
            <div className="timeline-date">
              <span className="timeline-dot" />
              {job.date}
              {i === 0 && <b>{t.current}</b>}
            </div>
            <div className="job">
              <span className="company">{job.company}</span>
              <h3>{job.role}</h3>
              <p>{job.description}</p>
            </div>
            <span className="job-index">0{i + 1}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
