import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Language } from '../../content';
import { pickPrank, type PrankEffect } from '../../lib/pranks';

const labels = {
  pt: { button: 'Não clique', message: 'Eu avisei 😅', clear: 'Limpar bagunça' },
  en: { button: 'Don’t click', message: 'I warned you 😅', clear: 'Clean up the mess' },
  es: {
    button: 'No hagas clic',
    message: 'Te lo advertí 😅',
    clear: 'Limpiar el desastre',
  },
};
const crayons = ['#fa3353', '#ffc62e', '#3c69ff', '#24be65', '#b347dc', '#ff8730'];
// Fixed artwork keeps the drawing stable while the language or other UI changes.
const scribbles = Array.from({ length: 42 }, (_, stroke) =>
  Array.from({ length: 22 }, (_, point) => {
    const x = 500 + Math.sin(stroke * 2.3 + point * 1.9) * 560;
    const y = 400 + Math.cos(stroke * 1.7 + point * 2.7) * 460;

    return `${point === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' '),
);

export default function PrankButton({ language }: { language: Language }) {
  const [active, setActive] = useState<PrankEffect | null>(null);
  const previous = useRef<PrankEffect | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const text = labels[language];

  useEffect(() => {
    if (!active) return;

    const triggerElement = trigger.current;
    const className = `prank-${active}`;
    const stop = () => setActive(null);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        stop();
      }
    };

    document.body.classList.add(className);
    document.addEventListener('keydown', onKey, true);

    const timer = setTimeout(stop, 10000);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove(className);
      document.removeEventListener('keydown', onKey, true);
      if (active === 'scribbles') triggerElement?.focus({ preventScroll: true });
    };
  }, [active]);

  return (
    <>
      <button
        ref={trigger}
        className="prank-button"
        aria-label={text.button}
        aria-pressed={Boolean(active)}
        onClick={() => {
          if (active) {
            setActive(null);

            return;
          }

          const effect = pickPrank(previous.current);

          previous.current = effect;
          setActive(effect);
        }}
      >
        ?
      </button>
      {createPortal(
        <>
          {active === 'chaos' && (
            <svg
              className="prank-cracks"
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g className="crack-lines">
                <path d="M365 310 L316 249 281 228 234 156 192 139 140 58 90 0 M365 310 L391 235 373 192 419 108 401 57 426 0 M365 310 L458 274 500 284 572 229 633 222 704 155 790 128 880 40 1000 0 M365 310 L473 351 531 340 618 389 703 370 773 421 879 403 1000 460 M365 310 L410 396 396 441 450 523 438 573 502 664 482 722 523 800 M365 310 L312 408 277 427 247 518 201 546 161 657 112 689 62 800 M365 310 L251 343 207 328 125 367 79 350 0 390 M365 310 L238 265 194 278 118 220 58 232 0 190" />
                <path d="M316 249 L278 299 251 343 312 408 410 396 458 274 391 235 316 249 M281 228 L238 265 M278 299 L337 277 389 279 416 328 381 367 329 359 309 322 337 277 M329 359 L312 408 M389 279 L391 235 M416 328 L473 351 M234 156 L322 171 373 192 M207 328 L216 409 247 518 M450 523 L541 482 618 389 M500 284 L527 190 572 229 M703 370 L712 289 633 222 M161 657 L261 633 332 700 438 573 M140 58 L84 111 118 220 M482 722 L620 678 716 800" />
                <path d="M810 585 L758 503 773 421 M810 585 L871 522 879 403 M810 585 L923 609 1000 571 M810 585 L846 678 830 732 869 800 M810 585 L733 643 690 637 620 678 M810 585 L879 576 901 642 846 678 778 680 753 619 810 585 M923 609 L941 705 1000 751 M758 503 L678 497 618 389 M871 522 L949 465 1000 460" />
              </g>
              <path
                className="crack-shards"
                d="M365 310 L337 277 309 322 Z M365 310 L416 328 381 367 Z M810 585 L879 576 846 678 Z M316 249 L281 228 278 299 Z"
              />
            </svg>
          )}
          {active === 'scribbles' && (
            <div
              className="prank-scribble-overlay"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 1000 800"
                preserveAspectRatio="none"
              >
                {scribbles.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    stroke={crayons[index % crayons.length]}
                  />
                ))}
              </svg>
            </div>
          )}
          <div
            className="prank-message"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {active ? text.message : ''}
          </div>
          {active === 'scribbles' && (
            <button
              className="prank-clear"
              autoFocus
              onClick={() => setActive(null)}
            >
              {text.clear}
            </button>
          )}
        </>,
        document.body,
      )}
    </>
  );
}
