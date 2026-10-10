export const prankEffects = ['chaos', 'scribbles'] as const;

export type PrankEffect = (typeof prankEffects)[number];

export function pickPrank(previous: PrankEffect | null) {
  const choices = prankEffects.filter((effect) => effect !== previous);

  return choices[Math.floor(Math.random() * choices.length)];
}
