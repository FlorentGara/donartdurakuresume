import { useReveal } from '@/hooks/useReveal';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'clip';
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal();
  const base = variant === 'clip' ? 'reveal-clip' : 'reveal';

  return (
    <Tag
      ref={ref as never}
      className={`${base} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
