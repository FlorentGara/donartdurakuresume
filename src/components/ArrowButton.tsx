import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface ArrowButtonProps {
  children: string;
  variant?: 'primary' | 'ghost';
  href?: string;
  onClick?: () => void;
}

export default function ArrowButton({ children, variant = 'primary', href, onClick }: ArrowButtonProps) {
  const cls = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  return (
    <MagneticButton
      as={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      className={cls}
      strength={0.15}
    >
      <span>{children}</span>
      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
    </MagneticButton>
  );
}
