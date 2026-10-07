import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CarouselControlsProps {
  count: number;
  selected: number;
  onDot: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  /** Exibe as bolinhas de posição; pode ser desativado na Agenda. */
  showDots?: boolean;
  /** Barra de progresso do autoplay */
  progress?: { key: string; duration: number; paused: boolean };
}

function ArrowButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Anterior' : 'Próximo'}
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-cream transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950"
    >
      <Icon className="size-5" />
    </button>
  );
}

export function CarouselControls({ count, selected, onDot, onPrev, onNext, showDots = true, progress }: CarouselControlsProps) {
  if (count <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className={cn('flex items-center', progress ? 'gap-3 sm:gap-4' : 'gap-4')}>
        <ArrowButton dir="prev" onClick={onPrev} />
        {showDots && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onDot(i)}
                aria-label={`Ir para o item ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-500',
                  i === selected ? 'w-8 bg-gold-500 shadow-[0_0_12px_rgba(242,168,29,0.7)]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                )}
              />
            ))}
          </div>
        )}
        {progress && (
          <div className="h-0.5 w-28 overflow-hidden rounded-full bg-white/10 sm:w-44">
            {!progress.paused && (
              <div
                key={progress.key}
                className="animate-progress h-full w-full bg-linear-to-r from-gold-600 to-gold-300"
                style={{ animationDuration: `${progress.duration}ms` }}
              />
            )}
          </div>
        )}
        <ArrowButton dir="next" onClick={onNext} />
      </div>
    </div>
  );
}
