import {
  commandGame,
  createGame,
  fits,
  foodFor,
  highScore,
  intervalFor,
  stepGame,
  storeScore,
} from '../../src/lib/arcade';
import type { Point } from '../../src/lib/arcade';

describe('arcade game rules', () => {
  afterEach(() => localStorage.clear());
  it('places food only on free cells, and handles a full board', () => {
    const occupied = Array.from({ length: 256 }, (_, i) => ({
      x: i % 16,
      y: Math.floor(i / 16),
    }));

    expect(foodFor(occupied)).toEqual({ x: -1, y: -1 });
    occupied.pop();
    expect(foodFor(occupied)).toEqual({ x: 15, y: 15 });
  });
  it('snake eats, grows, rejects reversal and advances without mutating', () => {
    let s = createGame('snake');
    const original = s.snake;

    expect(commandGame(s, 'left')).toBe(s);
    expect(commandGame(s, 'action')).toBe(s);
    s = { ...s, food: { x: 8, y: 8 } };
    s = stepGame(s);
    expect(s.score).toBe(10);
    expect(s.snake.length).toBe(4);
    expect(original.length).toBe(3);
    s = commandGame(s, 'up');
    s = stepGame(s);
    expect(s.snake[0]).toEqual({ x: 8, y: 7 });
    s = commandGame(s, 'left');
    s = stepGame(s);
    s = commandGame(s, 'down');
    s = stepGame(s);
    expect(s.over).toBeFalse();
  });
  it('snake detects every wall and self collision, allows moving into the old tail', () => {
    for (const [head, direction] of [
      [
        { x: 0, y: 4 },
        { x: -1, y: 0 },
      ],
      [
        { x: 15, y: 4 },
        { x: 1, y: 0 },
      ],
      [
        { x: 4, y: 0 },
        { x: 0, y: -1 },
      ],
      [
        { x: 4, y: 15 },
        { x: 0, y: 1 },
      ],
    ] as [Point, Point][]) {
      const s = { ...createGame('snake'), snake: [head], queued: direction };

      expect(stepGame(s).over).toBeTrue();
    }

    const s = {
      ...createGame('snake'),
      snake: [
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ],
      queued: { x: 1, y: 0 },
    };

    expect(stepGame(s).over).toBeTrue();
    expect(stepGame({ ...s, queued: { x: 0, y: 1 } }).over).toBeFalse();
  });
  it('snake completes the whole board and speed has a lower bound', () => {
    const snake = Array.from({ length: 255 }, (_, i) => ({
      x: i % 16,
      y: Math.floor(i / 16),
    }));

    snake.reverse();

    const s = stepGame({
      ...createGame('snake'),
      snake,
      food: { x: 15, y: 15 },
      queued: { x: 1, y: 0 },
    });

    expect(s.over).toBeTrue();
    expect(s.snake.length).toBe(256);
    expect(stepGame(s)).toBe(s);
    expect(commandGame(s, 'right')).toBe(s);
    expect(intervalFor({ ...s, score: 999 })).toBe(70);
  });
  it('runner jumps only from ground, lands and collides with obstacles', () => {
    let s = createGame('runner');

    expect(commandGame(s, 'left')).toBe(s);
    s = commandGame(s, 'up');
    expect(s.velocity).toBeGreaterThan(0);
    expect(commandGame(s, 'action')).toBe(s);
    for (let i = 0; i < 42; i++) s = stepGame({ ...s, obstacles: [{ x: 900, y: 30 }] });
    expect(s.height).toBe(0);
    expect(s.velocity).toBe(0);
    s = commandGame(s, 'action');
    expect(s.velocity).toBeGreaterThan(0);
    expect(
      stepGame({ ...s, height: 70, obstacles: [{ x: 80, y: 30 }] }).over,
    ).toBeFalse();
    expect(
      stepGame({ ...s, height: 0, velocity: 0, obstacles: [{ x: 80, y: 30 }] }).over,
    ).toBeTrue();
    expect(stepGame({ ...s, obstacles: [{ x: -40, y: 30 }] }).obstacles.length).toBe(1);
    expect(intervalFor(s)).toBeCloseTo(1000 / 60);
  });
  it('blocks move, rotate, reject invalid positions and land', () => {
    let s = createGame('blocks');

    s = {
      ...s,
      piece: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      position: { x: 0, y: 0 },
    };
    expect(commandGame(s, 'left')).toBe(s);
    s = commandGame(s, 'right');
    expect(s.position.x).toBe(1);
    s = commandGame(s, 'left');
    expect(s.position.x).toBe(0);
    s = commandGame(s, 'up');
    expect(Math.max(...s.piece.map((p) => p.y))).toBe(3);
    s = commandGame(s, 'down');
    expect(s.position.y).toBe(1);
    s = stepGame(s);
    expect(s.position.y).toBe(2);
    s = commandGame(s, 'action');
    expect(s.grid.flat().filter(Boolean).length).toBe(4);
    expect(fits(s, { x: 10, y: 0 })).toBeFalse();
    expect(fits(s, { x: 0, y: -1 })).toBeFalse();
    expect(fits(s, { x: 0, y: 18 })).toBeFalse();
    expect(intervalFor({ ...s, score: 10000 })).toBe(120);
  });
  it('blocks clear rows, score and end when spawn is occupied', () => {
    let s = createGame('blocks');

    s.grid[17] = Array(10).fill(1);
    s.grid[17][0] = 0;
    s = { ...s, piece: [{ x: 0, y: 0 }], position: { x: 0, y: 17 } };
    s = commandGame(s, 'down');
    expect(s.score).toBe(100);
    expect(s.grid[0].every((c) => c === 0)).toBeTrue();
    s = {
      ...s,
      grid: Array.from({ length: 18 }, () => Array(10).fill(0)),
      piece: [{ x: 0, y: 0 }],
      position: { x: 0, y: 17 },
    };
    s.grid[0] = Array(10).fill(1);
    s.grid[0][0] = 0;
    expect(commandGame(s, 'down').over).toBeTrue();
  });
  it('blocks kick a rotation away from the wall and reject fully blocked rotation', () => {
    const s = {
      ...createGame('blocks'),
      piece: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ],
      position: { x: 9, y: 0 },
    };

    // A four-wide rotation cannot fit using the available two-cell wall kicks.
    expect(commandGame(s, 'up')).toBe(s);

    const near = { ...s, position: { x: 8, y: 0 } };

    expect(commandGame(near, 'up').position.x).toBe(6);
  });
  it('record storage validates data and never lowers a previous record', () => {
    expect(highScore('runner')).toBe(0);
    localStorage.setItem('cm-arcade-runner', 'NaN');
    expect(highScore('runner')).toBe(0);
    localStorage.setItem('cm-arcade-runner', '-4');
    expect(highScore('runner')).toBe(0);
    expect(storeScore('runner', 12)).toBe(12);
    expect(storeScore('runner', 5)).toBe(12);
    expect(highScore('runner')).toBe(12);
  });
});
