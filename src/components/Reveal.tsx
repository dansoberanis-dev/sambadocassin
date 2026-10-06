import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type RevealAnimation =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'zoomIn'
  | 'bounceIn'
  | 'bounceInDown'
  | 'flipInX';

interface RevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  /** atraso em ms (igual ao data-wow-delay) */
  delay?: number;
  /** duração em ms (igual ao data-wow-duration) */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Anima o conteúdo quando ele entra na tela.
 * Mesma ideia do WOW.js + Animate.css usados no site do Péricles.
 */
export function Reveal({ children, animation = 'fadeInUp', delay = 0, duration = 1000, className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && ['is-visible', animation], className)}
      style={{ ...style, '--reveal-delay': `${delay}ms`, '--reveal-duration': `${duration}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
