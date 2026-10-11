import { useEffect } from 'react';

export function useReveal(arcade: boolean) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );

    document.querySelectorAll('.reveal, .section-enter').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [arcade]);
}
