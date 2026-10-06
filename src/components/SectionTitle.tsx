import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';
import { Equalizer } from './Equalizer';

interface SectionTitleProps {
  kicker?: string;
  title: string;
  className?: string;
}

/** Título de seção com palavra gigante vazada ao fundo + animação bounceInDown (igual ao original) */
export function SectionTitle({ kicker, title, className }: SectionTitleProps) {
  return (
    <div className={cn('relative mb-12 flex flex-col items-center text-center md:mb-16', className)}>
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none whitespace-nowrap font-display text-[24vw] uppercase leading-none md:text-[10rem] lg:text-[12rem]"
      >
        {title}
      </span>

      <Reveal animation="bounceInDown" duration={1500} className="relative">
        {kicker && (
          <p className="mb-1 font-display text-sm uppercase tracking-[0.5em] text-gold-400 md:text-base">{kicker}</p>
        )}
        <h2 className="font-script text-6xl leading-tight text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] md:text-7xl">
          {title}
        </h2>
      </Reveal>

      <Reveal animation="zoomIn" delay={500} className="relative mt-3 flex items-center gap-3">
        <span className="h-px w-10 bg-linear-to-r from-transparent to-gold-500 md:w-16" />
        <Equalizer bars={4} className="h-4" />
        <span className="h-px w-10 bg-linear-to-l from-transparent to-gold-500 md:w-16" />
      </Reveal>
    </div>
  );
}
