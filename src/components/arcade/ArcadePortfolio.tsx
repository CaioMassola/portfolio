import { useState } from 'react';
import {
  Download,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { projects, type Copy, type Language } from '../../content';
import { github, instagram, linkedin, whatsapp } from '../../lib/profile';
import { sectionIds } from '../../lib/sections';
import { portfolioCopy } from './portfolioCopy';

const kits = [
  [
    ['React', 'react'],
    ['TypeScript', 'typescript'],
    ['Angular', 'angular'],
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
const images = [
  '/project-tic-tac-toe.png',
  '/project-tic-tac-toe-api-health.png',
  '/project-lol-quiz.png',
  '/project-arena.png',
  '/project-price-alert-bot.png',
];

export default function ArcadePortfolio({
  language,
  t,
}: {
  language: Language;
  t: Copy;
}) {
  const c = portfolioCopy[language];
  const ids = sectionIds[language];
  const [kit, setKit] = useState(0);
  const [selected, setSelected] = useState(0);
  const project = projects[selected];

  return (
    <div className="arcade-portfolio">
      <section
        className="ap-section ap-about"
        id={ids[1]}
        aria-labelledby="ap-about-title"
      >
        <div className="ap-shell">
          <p className="ap-kicker">{c.player}</p>
          <div className="ap-player-layout">
            <div className="ap-player-card">
              <div className="ap-player-tag">
                P1 <span>CAIO MASSOLA</span>
              </div>
              <img
                src="/caio.jpeg"
                alt="Caio Massola"
                width="1075"
                height="1301"
                loading="lazy"
              />
              <p>{c.role}</p>
            </div>
            <div className="ap-player-copy">
              <h2 id="ap-about-title">{c.about}</h2>
              <p className="ap-lead">{c.intro}</p>
              <p>{c.bio}</p>
              <span className="ap-experience">{c.experience}</span>
              <a
                className="ap-button"
                href={`/Caio-Massola-CV-${language.toUpperCase()}.pdf`}
                download
              >
                <Download size={18} />
                {c.cv}
              </a>
            </div>
          </div>
          <div className="ap-education">
            <GraduationCap size={38} />
            <div>
              <span>{c.education}</span>
              <h3>{t.education}</h3>
              <p>{t.school}</p>
            </div>
            <b aria-hidden="true">✓</b>
          </div>
        </div>
      </section>
      <section
        className="ap-section ap-skills"
        id="technologies"
        aria-labelledby="ap-kit-title"
      >
        <div className="ap-shell">
          <p className="ap-kicker">{c.kit}</p>
          <h2 id="ap-kit-title">{c.kitTitle}</h2>
          <p className="ap-lead">{c.kitIntro}</p>
          <div
            className="ap-kit-picker"
            role="group"
            aria-label={c.kitTitle}
          >
            {c.groups.map((name, i) => (
              <button
                key={i}
                aria-pressed={kit === i}
                aria-controls="ap-kit-content"
                onClick={() => setKit(i)}
              >
                <span>0{i + 1}</span>
                {name}
              </button>
            ))}
          </div>
          <div
            className="ap-kit-content"
            id="ap-kit-content"
          >
            <div>
              <span className="ap-kicker">LOADOUT 0{kit + 1}</span>
              <h3>{c.groups[kit]}</h3>
              <p>{c.groupText[kit]}</p>
            </div>
            <ul>
              {kits[kit].map(([name, icon]) => (
                <li key={name}>
                  <img
                    src={`/technology-icons/${icon}.svg`}
                    alt=""
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section
        className="ap-section ap-career"
        id={ids[2]}
        aria-labelledby="ap-career-title"
      >
        <div className="ap-shell">
          <p className="ap-kicker">{c.career}</p>
          <h2 id="ap-career-title">{c.careerTitle}</h2>
          <p className="ap-lead">{c.careerIntro}</p>
          <ol className="ap-stages">
            {[...t.jobs].reverse().map((job, i) => (
              <li key={i}>
                <span
                  className="ap-stage-number"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <details open={i === 2}>
                  <summary>
                    <span className="ap-stage-meta">
                      {c.stage} 0{i + 1} · {job.date}
                    </span>
                    <span className="ap-stage-title">{job.role}</span>
                    <span className="ap-stage-company">
                      {job.company} {i === 2 && <b>{c.current}</b>}
                    </span>
                    <Plus
                      className="ap-expand"
                      size={22}
                    />
                  </summary>
                  <p>{c.careerNotes[i]}</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        className="ap-section ap-projects"
        id={ids[3]}
        aria-labelledby="ap-projects-title"
      >
        <div className="ap-shell">
          <p className="ap-kicker">{c.projects}</p>
          <h2 id="ap-projects-title">{c.projectsTitle}</h2>
          <p className="ap-lead">{c.projectsIntro}</p>
          <div
            className="ap-project-picker"
            role="group"
            aria-label={c.projectsTitle}
          >
            {projects.map((item, i) => (
              <button
                key={item.id}
                aria-pressed={selected === i}
                aria-controls="ap-project-screen"
                onClick={() => setSelected(i)}
              >
                <span>0{i + 1}</span>
                {t.projectNames[i]}
              </button>
            ))}
          </div>
          <article
            className="ap-project-screen"
            id="ap-project-screen"
          >
            <a
              className="ap-project-image"
              href={project.demo || `${github}/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.demo ? c.open : c.source}: ${t.projectNames[selected]}`}
            >
              <img
                src={images[selected]}
                alt={t.projectNames[selected]}
                width="960"
                height="540"
                loading="lazy"
              />
            </a>
            <div className="ap-project-detail">
              <span className="ap-kicker">
                {c.objective} / 0{selected + 1}
              </span>
              <h3>{t.projectNames[selected]}</h3>
              <p>{c.projectNotes[selected]}</p>
              <ul className="ap-tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="ap-project-links">
                {project.demo ? (
                  <a
                    className="ap-button"
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.open}
                  </a>
                ) : (
                  <span>{c.sourceOnly}</span>
                )}
                <a
                  href={`${github}/${project.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} />
                  {c.source}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section
        className="ap-section ap-contact"
        id={ids[4]}
        aria-labelledby="ap-contact-title"
      >
        <div className="ap-shell ap-coop">
          <div>
            <p className="ap-kicker">{c.contact}</p>
            <h2 id="ap-contact-title">{c.contactTitle}</h2>
            <p className="ap-lead">{c.contactText}</p>
          </div>
          <div className="ap-contact-options">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={30} />
              <span>{c.chat}</span>
            </a>
            <a href="mailto:chmassola@gmail.com">
              <Mail size={30} />
              <span>
                {c.mail}
                <small>chmassola@gmail.com</small>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ArcadeFooter({ language }: { language: Language }) {
  const c = portfolioCopy[language];

  return (
    <footer className="ap-footer">
      <div className="ap-shell">
        <p>{c.footer}</p>
        <a
          className="ap-button"
          href={`#${sectionIds[language][0]}`}
        >
          {c.again}
        </a>
        <nav aria-label="Social">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} />
            GitHub
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={18} />
            Instagram
          </a>
        </nav>
        <small>© {new Date().getFullYear()} Caio Massola</small>
      </div>
    </footer>
  );
}
