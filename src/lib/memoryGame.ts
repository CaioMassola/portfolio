export const memoryTechnologies = [
  'react',
  'typescript',
  'angular',
  'java',
  'docker',
  'git',
] as const;

export function createMemoryDeck() {
  const deck = [...memoryTechnologies, ...memoryTechnologies];

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
