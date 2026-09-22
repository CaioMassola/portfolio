const projectImages = {
  trio: '/project-tic-tac-toe.png',
  api: '/project-tic-tac-toe-api-health.png',
  lol: '/project-lol-quiz.png',
  arena: '/project-arena.png',
} as const;

const projectImageLabels = {
  trio: 'Tela inicial do projeto Tic Tac Toe',
  api: 'Repositório do back-end Tic Tac Toe no GitHub',
  lol: 'Tela inicial do projeto LoL Quiz',
  arena: 'Partida do jogo Block Boost Arena',
} as const;

interface ProjectArtProps {
  id: keyof typeof projectImages;
}

export default function ProjectArt({ id }: ProjectArtProps) {
  return (
    <div className={`project-art project-shot art-${id}`}>
      <img
        src={projectImages[id]}
        alt={projectImageLabels[id]}
        loading="lazy"
      />
      <span className="project-shot-label">Imagem real do projeto</span>
    </div>
  );
}
