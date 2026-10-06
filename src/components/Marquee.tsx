import { Star } from 'lucide-react';
import { config } from '@/data/config';
import { cn } from '@/utils/cn';

function Track({ items, reverse, className }: { items: string[]; reverse?: boolean; className?: string }) {
  return (
    <div className={cn('flex w-max', reverse ? 'animate-marquee-reverse' : 'animate-marquee')}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {items.map((text, i) => (
            <span key={`${copy}-${i}`} className={cn('flex items-center font-display text-2xl tracking-[0.2em] md:text-3xl', className)}>
              <span className="px-6">{text}</span>
              <Star className="size-4 fill-current" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Faixas cruzadas com texto correndo */
export function Marquee() {
  const items = [...config.marquee, ...config.marquee];

  return (
    <div aria-hidden="true" className="pointer-events-none relative z-10 -my-8 overflow-hidden py-10">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2deg] bg-ink-700 py-3">
        <Track items={items} reverse className="text-cream/25" />
      </div>
      <div className="relative -mx-[5%] -rotate-[2deg] bg-linear-to-r from-gold-600 via-gold-400 to-gold-600 py-3 shadow-[0_10px_40px_-10px_rgba(242,168,29,0.55)]">
        <Track items={items} className="text-ink-950" />
      </div>
    </div>
  );
}
