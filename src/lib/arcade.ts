import { readPreference, savePreference } from './storage';

export type ArcadeGame = 'runner' | 'snake' | 'blocks';

export type Command = 'left' | 'right' | 'up' | 'down' | 'action';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  kind: ArcadeGame;
  score: number;
  over: boolean;
  ticks: number;
  snake: Point[];
  direction: Point;
  queued: Point;
  food: Point;
  grid: number[][];
  piece: Point[];
  next: number;
  color: number;
  position: Point;
  height: number;
  velocity: number;
  obstacles: Point[];
}

const shapes: Point[][] = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
  ],
  [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  [
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
];
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const randomPiece = () => Math.floor(Math.random() * shapes.length);

export function foodFor(snake: Point[]): Point {
  const free = Array.from({ length: 256 }, (_, i) => ({
    x: i % 16,
    y: Math.floor(i / 16),
  })).filter((p) => !snake.some((s) => same(p, s)));

  return free[Math.floor(Math.random() * free.length)] ?? { x: -1, y: -1 };
}

export function createGame(kind: ArcadeGame): GameState {
  const snake = [
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 },
  ];
  const index = randomPiece();

  return {
    kind,
    score: 0,
    over: false,
    ticks: 0,
    snake,
    direction: { x: 1, y: 0 },
    queued: { x: 1, y: 0 },
    food: foodFor(snake),
    grid: Array.from({ length: 18 }, () => Array<number>(10).fill(0)),
    piece: shapes[index].map((p) => ({ ...p })),
    next: randomPiece(),
    color: index + 1,
    position: { x: 3, y: 0 },
    height: 0,
    velocity: 0,
    obstacles: [{ x: 620, y: 32 }],
  };
}

export function fits(state: GameState, position: Point, piece = state.piece) {
  return piece.every((p) => {
    const x = p.x + position.x,
      y = p.y + position.y;

    return x >= 0 && x < 10 && y >= 0 && y < 18 && state.grid[y][x] === 0;
  });
}

function lock(state: GameState): GameState {
  const grid = state.grid.map((row) => [...row]);

  state.piece.forEach((p) => {
    grid[p.y + state.position.y][p.x + state.position.x] = state.color;
  });

  const rows = grid.filter((row) => row.some((cell) => cell === 0));
  const cleared = 18 - rows.length;
  while (rows.length < 18) rows.unshift(Array<number>(10).fill(0));
  const next = {
    ...state,
    grid: rows,
    score: state.score + [0, 100, 300, 500, 800][cleared],
    piece: shapes[state.next].map((p) => ({ ...p })),
    color: state.next + 1,
    next: randomPiece(),
    position: { x: 3, y: 0 },
  };

  return { ...next, over: !fits(next, next.position) };
}

function fall(state: GameState): GameState {
  const position = { ...state.position, y: state.position.y + 1 };

  return fits(state, position) ? { ...state, position } : lock(state);
}

export function commandGame(state: GameState, command: Command): GameState {
  if (state.over) return state;
  if (state.kind === 'runner')
    return state.height === 0 && (command === 'up' || command === 'action')
      ? { ...state, velocity: 11.5, height: 0.1 }
      : state;

  if (state.kind === 'snake') {
    const directions = {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
    };
    if (command === 'action') return state;
    const queued = directions[command];

    return queued.x === -state.direction.x && queued.y === -state.direction.y
      ? state
      : { ...state, queued };
  }

  if (command === 'down') return fall(state);

  if (command === 'action') {
    let next = state;
    while (fits(next, { ...next.position, y: next.position.y + 1 }))
      next = { ...next, position: { ...next.position, y: next.position.y + 1 } };

    return lock(next);
  }

  if (command === 'up') {
    const rotated = state.piece.map((p) => ({ x: -p.y, y: p.x }));
    const minX = Math.min(...rotated.map((p) => p.x)),
      minY = Math.min(...rotated.map((p) => p.y));
    const piece = rotated.map((p) => ({ x: p.x - minX, y: p.y - minY }));

    for (const shift of [0, -1, 1, -2, 2]) {
      const position = { ...state.position, x: state.position.x + shift };
      if (fits(state, position, piece)) return { ...state, position, piece };
    }

    return state;
  }

  const position = {
    ...state.position,
    x: state.position.x + (command === 'left' ? -1 : 1),
  };

  return fits(state, position) ? { ...state, position } : state;
}

export function stepGame(state: GameState): GameState {
  if (state.over) return state;
  const next = { ...state, ticks: state.ticks + 1 };
  if (state.kind === 'blocks') return fall(next);

  if (state.kind === 'snake') {
    const head = {
      x: state.snake[0].x + state.queued.x,
      y: state.snake[0].y + state.queued.y,
    };
    const eating = same(head, state.food);
    const body = eating ? state.snake : state.snake.slice(0, -1);
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= 16 ||
      head.y >= 16 ||
      body.some((p) => same(p, head))
    )
      return { ...next, over: true };
    const snake = [head, ...body];

    return {
      ...next,
      snake,
      direction: state.queued,
      food: eating ? foodFor(snake) : state.food,
      score: state.score + (eating ? 10 : 0),
      over: snake.length === 256,
    };
  }

  const velocity = state.velocity - 0.58;
  const height = Math.max(0, state.height + velocity);
  const speed = Math.min(10, 4 + state.ticks / 500);
  const obstacles = state.obstacles
    .map((p) => ({ ...p, x: p.x - speed }))
    .filter((p) => p.x > -35);
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 300)
    obstacles.push({
      x: 640 + Math.random() * 160,
      y: 28 + Math.floor(Math.random() * 15),
    });
  const over = obstacles.some((p) => p.x < 100 && p.x + 24 > 58 && height < p.y - 5);

  return {
    ...next,
    height,
    velocity: height === 0 ? 0 : velocity,
    obstacles,
    over,
    score: Math.floor(next.ticks / 6),
  };
}

export function intervalFor(state: GameState) {
  if (state.kind === 'runner') return 1000 / 60;
  if (state.kind === 'snake') return Math.max(70, 180 - state.score * 0.7);

  return Math.max(120, 650 - Math.floor(state.score / 500) * 70);
}

export function highScore(kind: ArcadeGame) {
  const value = Number(readPreference(`cm-arcade-${kind}`));

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function storeScore(kind: ArcadeGame, score: number) {
  const record = Math.max(highScore(kind), score);

  savePreference(`cm-arcade-${kind}`, String(record));

  return record;
}
