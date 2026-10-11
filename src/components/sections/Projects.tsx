import { projects } from '../../content';
import type { Copy, Language } from '../../content';
import { sectionIds } from '../../lib/sections';
import ProjectCard from '../projects/ProjectCard';

interface ProjectsProps {
  language: Language;
  t: Copy;
}

export default function Projects({ t, language }: ProjectsProps) {
  return (
    <section
      className="shell projects-section section"
      id={sectionIds[language][3]}
    >
      <div>
        <div className="section-heading section-enter">
          <div>
            <p className="eyebrow">{t.projectsLabel}</p>
            <h2>{t.projectsTitle}</h2>
          </div>
        </div>
        <div className="project-carousel">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
