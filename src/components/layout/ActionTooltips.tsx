import { useEffect, useId } from 'react';

const targets =
  'button.icon-button, .section-navigation button, .hero-socials a, .project-links a.demo-link';

export default function ActionTooltips() {
  const id = useId();

  useEffect(() => {
    const tooltip = document.createElement('div');
    let active: HTMLElement | null = null;
    let dismissed: HTMLElement | null = null;
    let suspended = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    tooltip.id = id;
    tooltip.className = 'action-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.append(tooltip);

    const hide = () => {
      clearTimeout(timer);

      if (active) {
        const descriptions = (active.getAttribute('aria-describedby') ?? '')
          .split(/\s+/)
          .filter((value) => value && value !== id);

        if (descriptions.length)
          active.setAttribute('aria-describedby', descriptions.join(' '));
        else active.removeAttribute('aria-describedby');
      }

      active = null;
      tooltip.hidden = true;
    };

    const position = () => {
      if (!active) return;

      tooltip.textContent = active.getAttribute('aria-label') || '';

      const rect = active.getBoundingClientRect();
      const bounds = tooltip.getBoundingClientRect();
      const isNavigation = active.matches('.section-navigation button');
      const left = Math.max(
        8,
        Math.min(
          isNavigation
            ? rect.left - bounds.width - 8
            : rect.left + (rect.width - bounds.width) / 2,
          window.innerWidth - bounds.width - 8,
        ),
      );
      const top = isNavigation
        ? rect.top + (rect.height - bounds.height) / 2
        : rect.top >= bounds.height + 16
          ? rect.top - bounds.height - 8
          : rect.bottom + 8;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8))}px`;
    };

    const show = (element: HTMLElement) => {
      clearTimeout(timer);

      if (active !== element) {
        hide();
        active = element;
        tooltip.hidden = false;
        element.setAttribute(
          'aria-describedby',
          [element.getAttribute('aria-describedby'), id].filter(Boolean).join(' '),
        );
      }

      position();
    };

    const enter = (event: Event) => {
      if (suspended) return;
      if (event instanceof PointerEvent && event.pointerType === 'touch') return;

      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(targets)
          : null;

      if (element && element !== dismissed) show(element);
      else if (event.target === tooltip) clearTimeout(timer);
    };

    const leave = (event: Event) => {
      if (
        dismissed &&
        event.target instanceof Node &&
        dismissed.contains(event.target) &&
        !dismissed.contains((event as PointerEvent | FocusEvent).relatedTarget as Node | null)
      ) {
        dismissed = null;
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        const keepFocus =
          event.type !== 'pointerout' || !active?.matches('.theme-toggle');

        if (
          active?.matches(keepFocus ? ':hover, :focus' : ':hover') ||
          tooltip.matches(':hover')
        )
          return;

        hide();
      }, 150);
    };

    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        suspended = false;
        dismissed = null;
      }

      if (event.key === 'Escape') hide();
    };

    const suspend = () => {
      suspended = true;
      hide();
    };

    const visibilityChange = () => {
      if (document.hidden) suspend();
    };

    const pointerMove = (event: PointerEvent) => {
      if (!suspended || document.hidden || !document.hasFocus()) return;

      suspended = false;
      dismissed = null;
      enter(event);
    };

    const click = (event: MouseEvent) => {
      const element =
        event.target instanceof Element ? event.target.closest<HTMLElement>(targets) : null;

      if (element?.matches('.theme-toggle:hover')) {
        dismissed = null;
        show(element);

        return;
      }

      dismissed = element;
      hide();
    };

    const observer = new MutationObserver(position);

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label'],
      characterData: true,
    });
    document.addEventListener('pointerover', enter);
    document.addEventListener('pointerout', leave);
    document.addEventListener('focusin', enter);
    document.addEventListener('focusout', leave);
    document.addEventListener('keydown', keydown);
    document.addEventListener('click', click, true);
    document.addEventListener('pointermove', pointerMove);
    document.addEventListener('visibilitychange', visibilityChange);
    window.addEventListener('blur', suspend);
    window.addEventListener('pagehide', suspend);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);

    return () => {
      hide();
      observer.disconnect();
      tooltip.remove();
      document.removeEventListener('pointerover', enter);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('focusin', enter);
      document.removeEventListener('focusout', leave);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('click', click, true);
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('visibilitychange', visibilityChange);
      window.removeEventListener('blur', suspend);
      window.removeEventListener('pagehide', suspend);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [id]);

  return null;
}
