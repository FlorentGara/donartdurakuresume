import { useReveal } from '@/hooks/useReveal';

interface SectionHeaderProps {
  label: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`${align === 'center' ? 'text-center mx-auto' : ''} ${className}`}
    >
      <div
        className={`reveal ${visible ? 'is-visible' : ''} flex items-center gap-3 ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="section-header-rule h-px w-8 bg-accent/70" />
        <span className="text-label text-accent">{label}</span>
      </div>
      <h2
        className={`reveal reveal-heading ${visible ? 'is-visible' : ''} text-display text-4xl md:text-5xl lg:text-6xl mt-6 ${
          align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl'
        }`}
        style={{ transitionDelay: '120ms' }}
      >
        {title}
      </h2>
    </div>
  );
}
