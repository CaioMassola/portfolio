import { projects, type Copy, type Language } from '../content';
import { github, linkedin, instagram, whatsapp } from './profile';
import { arcadeCopy } from '../components/arcade/copy';

export type TerminalGame = 'runner' | 'snake' | 'blocks' | 'tic' | 'memory';

export const terminalCommands = [
  'help',
  'about',
  'projects',
  'skills',
  'contact',
  'clear',
  'play runner',
  'play snake',
  'play blocks',
  'play tic',
  'play memory',
];

export const terminalCopy = {
  pt: {
    open: 'Expandir terminal',
    close: 'Fechar terminal',
    hint: 'Digite help para começar.',
    input: 'Comando',
    send: 'Executar',
    unknown: 'Comando desconhecido. Digite help.',
    opening: 'Abrindo',
    returned: 'Jogo fechado. De volta ao terminal. Digite help para ver os comandos.',
  },
  en: {
    open: 'Expand terminal',
    close: 'Close terminal',
    hint: 'Type help to get started.',
    input: 'Command',
    send: 'Run',
    unknown: 'Unknown command. Type help.',
    opening: 'Opening',
    returned: 'Game closed. Back to the terminal. Type help to see the commands.',
  },
  es: {
    open: 'Expandir terminal',
    close: 'Cerrar terminal',
    hint: 'Escribe help para empezar.',
    input: 'Comando',
    send: 'Ejecutar',
    unknown: 'Comando desconocido. Escribe help.',
    opening: 'Abriendo',
    returned: 'Juego cerrado. De vuelta al terminal. Escribe help para ver los comandos.',
  },
};

export type TerminalResult = {
  text: string;
  game?: TerminalGame;
  clear?: boolean;
};

export function runTerminal(
  command: string,
  language: Language,
  t: Copy,
): TerminalResult {
  const input = command.trim().toLowerCase().replace(/\s+/g, ' ');
  const c = terminalCopy[language];
  if (input === 'clear') return { text: '', clear: true };
  if (input === 'help') return { text: terminalCommands.join('\n') };
  if (input === 'about')
    return {
      text: JSON.stringify(
        {
          name: 'Caio Massola',
          role: arcadeCopy[language].role,
          summary: t.intro,
          currentWork: t.aboutSecond,
          background: t.aboutBackground,
          education: t.education,
        },
        null,
        2,
      ),
    };
  if (input === 'skills')
    return {
      text: JSON.stringify(
        {
          interfaces: ['React', 'TypeScript', 'Angular', 'React Native', 'Next.js'],
          quality: ['Jest', 'Testing Library', 'Storybook'],
          services: ['Node.js', 'Java', 'MySQL', 'AWS', 'Docker', 'Git'],
        },
        null,
        2,
      ),
    };
  if (input === 'projects')
    return {
      text: JSON.stringify(
        projects.map((project, index) => ({
          name: t.projectNames[index],
          description: t.projectDescriptions[index],
          technologies: project.tags,
          github: github + '/' + project.repo,
          demo: project.demo ?? null,
        })),
        null,
        2,
      ),
    };
  if (input === 'contact')
    return {
      text: JSON.stringify(
        { email: 'chmassola@gmail.com', whatsapp, github, linkedin, instagram },
        null,
        2,
      ),
    };
  const game = input.slice(5) as TerminalGame;
  if (
    input.startsWith('play ') &&
    ['runner', 'snake', 'blocks', 'tic', 'memory'].includes(game)
  )
    return { text: `${c.opening} ${arcadeCopy[language][game]}...`, game };

  return { text: c.unknown };
}
