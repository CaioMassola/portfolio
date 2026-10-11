import { act } from 'react';
import { createRoot } from 'react-dom/client';
import ArcadeHeroArt from '../../src/components/arcade/ArcadeHeroArt';

it('pauses the scene outside the viewport or hidden tab and cleans up', () => {
  let notify: IntersectionObserverCallback;
  const disconnect = jasmine.createSpy();

  spyOn(window, 'IntersectionObserver').and.callFake(function (callback) {
    notify = callback;

    return {
      observe: jasmine.createSpy(),
      disconnect,
    } as unknown as IntersectionObserver;
  });

  const hidden = spyOnProperty(document, 'hidden', 'get').and.returnValue(false);
  const host = document.createElement('div');

  document.body.append(host);

  const root = createRoot(host);

  act(() => root.render(<ArcadeHeroArt />));

  const scene = host.querySelector('.arcade-hero-art')!;
  const intersect = (isIntersecting: boolean) =>
    notify([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);

  intersect(true);
  expect(scene.classList.contains('is-playing')).toBeTrue();
  hidden.and.returnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(scene.classList.contains('is-playing')).toBeFalse();
  hidden.and.returnValue(false);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(scene.classList.contains('is-playing')).toBeTrue();
  intersect(false);
  expect(scene.classList.contains('is-playing')).toBeFalse();
  act(() => root.unmount());
  expect(disconnect).toHaveBeenCalled();
  host.remove();
});
