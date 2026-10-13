import { useEffect, useRef } from 'react';
import { Capybara } from './Artwork';

export default function ArcadeHeroArt() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current!;
    let visible = false;

    const update = () => {
      element.classList.toggle('is-playing', visible && !document.hidden);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );

    observer.observe(element);
    document.addEventListener('visibilitychange', update);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <div
      className="arcade-hero-art"
      ref={scene}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 330"
        shapeRendering="crispEdges"
      >
        <g className="arcade-art-controller">
          <path
            d="M90 58h190v30h30v110h-55v-40H115v40H60V88h30z"
            fill="#ffeb00"
            stroke="#111"
            strokeWidth="10"
          />
          <path
            d="M115 89h22v22h22v22h-22v22h-22v-22H93v-22h22z"
            fill="#111"
          />
          <path
            className="arcade-art-light"
            d="M225 93h20v20h-20z"
            fill="#8100ef"
            stroke="#111"
            strokeWidth="4"
          />
          <path
            className="arcade-art-light"
            d="M251 120h20v20h-20z"
            fill="#72f52c"
            stroke="#111"
            strokeWidth="4"
          />
          <path
            className="arcade-art-light"
            d="M225 147h20v20h-20z"
            fill="#0055ff"
            stroke="#111"
            strokeWidth="4"
          />
        </g>
        <g className="arcade-art-snake">
          <path
            d="M330 72V60h6V48h6V38h6v10h6v12h6v12z"
            fill="#111"
          />
          <path
            d="M335 73V65h6V53h2V43h2v10h4v12h6v8z"
            fill="#72f52c"
          />

          <path
            d="M345 70v60h65v85h-45"
            fill="none"
            stroke="#111"
            strokeWidth="31"
          />
          <path
            d="M345 70v60h65v85h-45"
            fill="none"
            stroke="#72f52c"
            strokeWidth="22"
          />
          <path
            d="M354 193h30v36h-30z"
            fill="#72f52c"
            stroke="#111"
            strokeWidth="5"
          />
          <rect
            x="360"
            y="200"
            width="6"
            height="6"
            fill="#111"
          />
        </g>
        <g transform="translate(96 204) scale(1.65)">
          <g className="arcade-art-capybara">
            <Capybara />
          </g>
        </g>
        <path
          className="arcade-art-block"
          d="M284 248h30v30h30v30h-60z"
          fill="#8100ef"
          stroke="#111"
          strokeWidth="5"
        />
        <path
          d="M440 33h18v18h-18zM40 238h15v15H40z"
          fill="#ffeb00"
        />
      </svg>
    </div>
  );
}
