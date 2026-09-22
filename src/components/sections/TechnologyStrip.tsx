export default function TechnologyStrip() {
  return (
    <div className="technology-line">
      <div className="shell">
        {['React', 'TypeScript', 'Angular', 'React Native', 'Next.js', 'Node.js'].map(
          (tech) => (
            <span key={tech}>
              <span className="tech-star">✳</span>
              {tech}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
