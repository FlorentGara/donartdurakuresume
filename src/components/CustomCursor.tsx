import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [variant, setVariant] = useState<'default' | 'view' | 'link'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="view"]')) setVariant('view');
      else if (t.closest('a, button, [data-cursor="link"]')) setVariant('link');
      else setVariant('default');
    };

    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  const size = variant === 'view' ? 96 : variant === 'link' ? 48 : 16;
  const label = variant === 'view' ? 'VIEW' : '';

  return (
    <div
      className="pointer-events-none fixed z-[9998] hidden lg:flex items-center justify-center rounded-full mix-blend-difference transition-[width,height] duration-300 ease-out"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: variant === 'default' ? 'rgba(250,250,247,0.9)' : 'rgba(212,165,116,0.15)',
        border: variant !== 'default' ? '1px solid rgba(212,165,116,0.6)' : 'none',
        backdropFilter: variant !== 'default' ? 'blur(2px)' : 'none',
      }}
    >
      {label && (
        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{label}</span>
      )}
    </div>
  );
}
