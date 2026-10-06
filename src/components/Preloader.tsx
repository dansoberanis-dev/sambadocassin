import { useEffect, useState } from 'react';
import { INTRO_DELAY } from '@/utils/helpers';
import { cn } from '@/utils/cn';
import { Equalizer } from './Equalizer';

/** Tela de abertura com efeito "cortina subindo" */
export function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), INTRO_DELAY - 300);
    const t2 = window.setTimeout(() => setGone(true), INTRO_DELAY + 800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
        leaving && '-translate-y-full'
      )}
    >
      <div className={cn('flex flex-col items-center transition-opacity duration-500', leaving && 'opacity-0')}>
        <Equalizer bars={7} className="h-12 gap-1.5" barClassName="w-1.5" />
        <img
          src="/images/logo-horizontal-samba-cassin.png"
          alt=""
          width={1638}
          height={446}
          fetchPriority="high"
          decoding="async"
          className="mt-6 h-auto w-[min(82vw,28rem)] drop-shadow-[0_0_22px_rgba(242,168,29,0.22)]"
        />
        <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
          <div className="animate-progress h-full w-full bg-gold-500" style={{ animationDuration: `${INTRO_DELAY - 300}ms` }} />
        </div>
      </div>
    </div>
  );
}
