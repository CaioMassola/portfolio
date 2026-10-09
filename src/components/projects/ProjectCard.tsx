import { Github, ArrowUpRight } from 'lucide-react';

import { projects } from '../../content';
import type { Copy, Project } from '../../content';
import { github } from '../../lib/profile';
import ProjectArt from './ProjectArt';

interface ProjectCardProps {
  project: Project;
  index: number;
  t: Copy;
}

export default function ProjectCard({ project, index, t }: ProjectCardProps) {
  return (
    <article className="project-card">
      <a
        className="project-image-link"
        href={project.demo || `${github}/${project.repo}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.demo ? t.demo : t.projectLink}: ${t.projectNames[index]}`}
      >
        <ProjectArt id={project.id} />
      </a>
      <div className="project-body">
        <div className="project-meta">
          <span>{t.projectTypes[index]}</span>
          <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        </div>
        <h3>{t.projectNames[index]}</h3>
        <p>{t.projectDescriptions[index]}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-links">
          <a
            href={`${github}/${project.repo}`}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} />
            {t.projectLink}
          </a>
          {project.demo && (
            <a
              className="demo-link"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.demo}: ${t.projectNames[index]}`}
            >
              <ArrowUpRight size={19} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
