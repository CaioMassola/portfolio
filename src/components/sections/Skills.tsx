import type { Copy } from '../../content';

interface SkillsProps {
  t: Copy;
}

export default function Skills({ t }: SkillsProps) {
  return (
    <section className="shell skills reveal">
      <p>{t.skillsTitle}</p>
      <div>
        {[
          'React',
          'Angular',
          'TypeScript',
          'React Native',
          'Next.js',
          'Jest',
          'Testing Library',
          'Storybook',
          'AWS',
          'Node.js',
          'Java',
          'MySQL',
          'Git',
          'Docker',
        ].map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  );
}
