export type Mark = 'X' | 'O' | null;

export const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function winner(board: Mark[]) {
  return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

export function botMove(board: Mark[]) {
  const empty = board.flatMap((mark, index) => mark ? [] : [index]);

  for (const mark of ['O', 'X'] as const) {
    const move = empty.find((index) => {
      const next = [...board];

      next[index] = mark;

      return Boolean(winner(next));
    });

    if (move !== undefined) return move;
  }

  if (board[4] === null) return 4;

  return empty[Math.floor(Math.random() * empty.length)];
}
