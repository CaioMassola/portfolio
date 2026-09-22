import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');

    const change = () => setReduced(media.matches);

    media.addEventListener('change', change);

    return () => media.removeEventListener('change', change);
  }, []);

  return reduced;
}
