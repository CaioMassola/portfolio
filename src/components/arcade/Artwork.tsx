import type { ArcadeGame, GameState } from '../../lib/arcade';

const blockColors = [
  '#111111',
  '#8b00ff',
  '#ffeb00',
  '#0055ff',
  '#72f52c',
  '#ff563d',
  '#00cdd7',
  '#ed62c1',
];

export function Capybara({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      shapeRendering="crispEdges"
    >
      <path
        fill="#15120f"
        d="M6 14h12V8h25V2h9v5h10v5h8v23H54v7H20v8H9V39H2V20h4z"
      />
      <path
        fill="#bb763e"
        d="M7 21h14V12h23V7h5v6h12v4h4v13H50v8H17v7h-4V34H7z"
      />
      <path
        fill="#e5a45f"
        d="M21 14h21v6H21zM9 23h7v9H9z"
      />
      <path
        fill="#171411"
        d="M52 17h5v5h-5zM60 26h6v4h-6zM35 36h8v10h-8z"
      />
    </g>
  );
}

export function GameArt({ kind }: { kind: ArcadeGame | 'tic' | 'memory' }) {
  return (
    <svg
      viewBox="0 0 400 220"
      aria-hidden="true"
      className={`arcade-art art-${kind}`}
      shapeRendering="crispEdges"
    >
      {kind === 'tic' ? (
        <g
          stroke="#111"
          strokeWidth="8"
          fill="none"
        >
          <path d="M165 30v160m70-160v160M95 83h210M95 137h210" />
          <path
            stroke="#fff7e3"
            d="m109 42 32 28m0-28-32 28m136 54 32 28m0-28-32 28"
          />
          <circle
            stroke="#72f52c"
            cx="201"
            cy="111"
            r="17"
          />
          <circle
            stroke="#72f52c"
            cx="131"
            cy="164"
            r="17"
          />
        </g>
      ) : kind === 'memory' ? (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g
              key={i}
              transform={`translate(${84 + (i % 3) * 80} ${24 + Math.floor(i / 3) * 92})`}
            >
              <rect
                x="5"
                y="5"
                width="64"
                height="76"
                fill="#111"
              />
              <rect
                width="64"
                height="76"
                fill={i === 1 || i === 4 ? '#72f52c' : '#8100ef'}
                stroke="#111"
                strokeWidth="4"
              />
              {i === 1 || i === 4 ? (
                <path
                  d="M18 30h10V20h10v10h10v10H38v10H28V40H18z"
                  fill="#111"
                />
              ) : (
                <path
                  d="M22 24h20v14H32v9m0 7v5"
                  stroke="#fff7e3"
                  strokeWidth="5"
                  fill="none"
                />
              )}
            </g>
          ))}
        </>
      ) : kind === 'runner' ? (
        <>
          <path
            fill="#fff6df"
            d="M32 48h15V32h32v16h16v16H32zM280 68h16V53h30v15h20v16h-66z"
          />
          <path
            fill="#6ff331"
            d="M0 185h400v22H0z"
          />
          <path
            fill="#17120c"
            d="M0 207h400v13H0z"
          />
          <g transform="translate(93 70) scale(1.7)">
            <Capybara />
          </g>
          <path
            fill="#ad6234"
            stroke="#111"
            strokeWidth="5"
            d="M295 132h45v53h-45z"
          />
          <path
            stroke="#111"
            strokeWidth="4"
            d="M295 148h45m-45 22h45"
          />
        </>
      ) : kind === 'snake' ? (
        <>
          <defs>
            <pattern
              id="arcade-grid-art"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M25 0H0V25"
                fill="none"
                stroke="#6bc3ff"
                strokeOpacity=".3"
              />
            </pattern>
          </defs>
          <rect
            width="400"
            height="220"
            fill="url(#arcade-grid-art)"
          />
          <path
            d="M70 78v78h100V80h80"
            fill="none"
            stroke="#111"
            strokeWidth="34"
          />
          <path
            d="M70 78v78h100V80h80"
            fill="none"
            stroke="#72f52c"
            strokeWidth="25"
          />
          <path
            fill="#72f52c"
            stroke="#111"
            strokeWidth="5"
            d="M235 57h48v44h-48z"
          />
          <path
            d="M250 69v9m18-9v9"
            stroke="#111"
            strokeWidth="6"
          />
          <path
            fill="#ff563d"
            stroke="#111"
            strokeWidth="4"
            d="M310 140h30v30h-30z"
          />
          <path
            stroke="#72f52c"
            strokeWidth="6"
            d="m325 140 6-12"
          />
        </>
      ) : (
        <>
          {[
            [1, 6, 1],
            [2, 6, 1],
            [3, 6, 1],
            [2, 5, 1],
            [4, 6, 2],
            [4, 5, 2],
            [5, 6, 2],
            [5, 5, 2],
            [6, 6, 3],
            [6, 5, 3],
            [6, 4, 3],
            [7, 6, 3],
            [8, 6, 5],
            [8, 5, 5],
            [9, 5, 5],
            [9, 4, 5],
            [5, 1, 1],
            [6, 1, 1],
            [7, 1, 1],
            [6, 2, 1],
          ].map(([x, y, c], i) => (
            <rect
              key={i}
              x={35 + x * 28}
              y={y * 28}
              width="28"
              height="28"
              fill={blockColors[c]}
              stroke="#111"
              strokeWidth="3"
            />
          ))}
        </>
      )}
    </svg>
  );
}

export function GameBoard({ state }: { state: GameState }) {
  if (state.kind === 'runner')
    return (
      <svg
        className="arcade-board runner-board"
        viewBox="0 0 640 260"
        aria-hidden="true"
      >
        <rect
          width="640"
          height="260"
          fill="#8100ef"
        />
        <path
          fill="#fff6df"
          d="M190 60h20V45h40v15h20v15h-80zM465 85h15V70h35v15h20v15h-70z"
        />
        <path
          fill="#72f52c"
          d="M0 210h640v22H0z"
        />
        <path
          fill="#111"
          d="M0 232h640v28H0z"
        />
        <Capybara
          x={42}
          y={160 - state.height}
        />
        {state.obstacles.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x}
              y={210 - p.y}
              width="24"
              height={p.y}
              fill="#ffeb00"
              stroke="#111"
              strokeWidth="3"
            />
            <path
              d={`M${p.x + 5} ${214 - p.y}v${p.y - 8}`}
              stroke="#d78715"
              strokeWidth="4"
            />
          </g>
        ))}
      </svg>
    );
  if (state.kind === 'snake')
    return (
      <svg
        className="arcade-board snake-board"
        viewBox="0 0 320 320"
        aria-hidden="true"
      >
        <rect
          width="320"
          height="320"
          fill="#0046dc"
        />
        {Array.from({ length: 17 }, (_, i) => (
          <path
            key={i}
            d={`M${i * 20} 0V320M0 ${i * 20}H320`}
            stroke="#ffffff15"
          />
        ))}
        {state.snake.map((p, i) => (
          <rect
            key={i}
            x={p.x * 20 + 1}
            y={p.y * 20 + 1}
            width="18"
            height="18"
            fill={i === 0 ? '#ffeb00' : '#72f52c'}
          />
        ))}
        <rect
          x={state.food.x * 20 + 2}
          y={state.food.y * 20 + 2}
          width="16"
          height="16"
          fill="#ff563d"
          stroke="#fff6df"
        />
      </svg>
    );

  return (
    <svg
      className="arcade-board blocks-board"
      viewBox="0 0 200 360"
      aria-hidden="true"
    >
      <rect
        width="200"
        height="360"
        fill="#11131b"
      />
      {state.grid.flatMap((row, y) =>
        row.map((c, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * 20}
            y={y * 20}
            width="20"
            height="20"
            fill={blockColors[c]}
            stroke="#ffffff18"
          />
        )),
      )}
      {state.piece.map((p, i) => (
        <rect
          key={i}
          x={(p.x + state.position.x) * 20}
          y={(p.y + state.position.y) * 20}
          width="20"
          height="20"
          fill={blockColors[state.color]}
          stroke="#111"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
