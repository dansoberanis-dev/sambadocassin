import { config } from '@/data/config';
import { cn } from '@/utils/cn';

type Size = 'sm' | 'md' | 'xl';

const SIZES: Record<Size, { kicker: string; main: string; line: string; img: string }> = {
  sm: { kicker: 'text-[0.55rem] tracking-[0.55em]', main: 'text-[1.7rem]', line: 'w-4', img: 'h-10' },
  md: { kicker: 'text-xs tracking-[0.55em]', main: 'text-5xl', line: 'w-6', img: 'h-20' },
  xl: {
    kicker: 'text-sm md:text-lg tracking-[0.6em]',
    main: 'text-[12vw] sm:text-7xl md:text-[5.5rem] lg:text-8xl xl:text-9xl',
    line: 'w-10 md:w-16',
    img: 'h-40 md:h-56',
  },
};

/**
 * Logo em texto. Se o grupo tiver um logo em imagem,
 * basta preencher `logoImage` no arquivo src/data/config.ts
 */
export function Logo({ size = 'md', align = 'center', className }: { size?: Size; align?: 'center' | 'left'; className?: string }) {
  const s = SIZES[size];

  if (config.logoImage) {
    return <img src={config.logoImage} alt={config.name} className={cn('w-auto', s.img, className)} />;
  }

  return (
    <span
      className={cn(
        'inline-flex flex-col leading-none',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {config.logoKicker && (
        <span className={cn('flex items-center gap-2 font-display uppercase text-gold-300/90', s.kicker)}>
          <span className={cn('h-px bg-current', s.line)} />
          {config.logoKicker}
          <span className={cn('h-px bg-current', s.line)} />
        </span>
      )}
      <span className={cn('text-gold-gradient glow-gold px-[0.08em] pb-[0.14em] font-script leading-[1.05] text-balance', s.main)}>
        {config.name}
      </span>
    </span>
  );
}
