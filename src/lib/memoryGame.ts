export const memoryTechnologies = [
  'react',
  'typescript',
  'angular',
  'java',
  'docker',
  'git',
] as const;

export const arcadeMemoryTechnologies = [
  ...memoryTechnologies,
  'nextjs',
  'nodejs',
  'mysql',
  'jest',
  'storybook',
  'amazonwebservices',
] as const;

export function createMemoryDeck(arcade = false) {
  const technologies = arcade ? arcadeMemoryTechnologies : memoryTechnologies;
  const deck = [...technologies, ...technologies];

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
