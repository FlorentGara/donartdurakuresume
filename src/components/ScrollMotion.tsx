import { useEffect } from 'react';

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.querySelector('main');
    if (!main) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const sections = Array.from(main.querySelectorAll<HTMLElement>('section[id]'), (section) => ({
        section,
        rect: section.getBoundingClientRect(),
      }));
      sections.forEach(({ section, rect }) => {
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
        const roundedProgress = progress.toFixed(3);
        if (section.style.getPropertyValue('--section-progress') !== roundedProgress) {
          section.style.setProperty('--section-progress', roundedProgress);
          section.style.setProperty('--scroll-offset', `${((0.5 - progress) * 36).toFixed(1)}px`);
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(main, { childList: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
