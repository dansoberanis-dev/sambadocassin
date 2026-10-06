import { cn } from '@/utils/cn';

/** Barrinhas de equalizador animadas */
export function Equalizer({ bars = 4, className, barClassName }: { bars?: number; className?: string; barClassName?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-flex h-4 items-end gap-[3px]', className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn('animate-eq h-full w-[3px] rounded-full bg-gold-400', barClassName)}
          style={{ animationDelay: `${-((i * 0.23) % 1)}s`, animationDuration: `${0.85 + (i % 3) * 0.2}s` }}
        />
      ))}
    </span>
  );
}
