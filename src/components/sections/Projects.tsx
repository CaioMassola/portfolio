import { projects } from '../../content';
import type { Copy } from '../../content';
import ProjectCard from '../projects/ProjectCard';

interface ProjectsProps {
  t: Copy;
  reduced: boolean;
}

export default function Projects({ t }: ProjectsProps) {
  return (
    <section
      className="projects-section section reveal"
      id="projetos"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.projectsLabel}</p>
            <h2>{t.projectsTitle}</h2>
            <p>{t.projectsIntro}</p>
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
