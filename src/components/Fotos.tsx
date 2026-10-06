import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { config } from '@/data/config';
import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { InstagramIcon } from './BrandIcons';

/** Padrão do mosaico (se repete a cada 7 fotos e sempre fecha certinho) */
const SPANS = ['col-span-2 row-span-2', '', '', 'md:row-span-2', '', 'col-span-2', 'col-span-2 md:col-span-1'];

export function Fotos() {
  const photos = config.photos;
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % photos.length)), [photos.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, prev, next]);

  const current = index !== null ? photos[index] : null;

  return (
    <section id="fotos" className="relative scroll-mt-16 overflow-hidden bg-ink-900 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Galeria" title="Fotos" />

        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 grid-flow-dense md:auto-rows-[220px] md:grid-cols-4">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} animation="zoomIn" delay={(i % 7) * 120} className={cn('h-full', SPANS[i % SPANS.length])}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block size-full overflow-hidden rounded-2xl bg-ink-800"
                aria-label={`Ampliar foto: ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-gold-500/70" />
                <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-gold-500 text-ink-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <ZoomIn className="size-6" />
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left text-sm font-semibold text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.alt}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal animation="fadeInUp" className="mt-10 flex justify-center">
          <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <InstagramIcon className="size-5" />
            Mais fotos no Instagram
          </a>
        </Reveal>
      </div>

      {/* Lightbox */}
      {current && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/95 backdrop-blur-md"
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) {
              if (dx > 0) prev();
              else next();
            }
            touchX.current = null;
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Foto anterior"
            className="absolute left-3 z-10 hidden size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 sm:flex md:left-6"
          >
            <ChevronLeft className="size-6" />
          </button>

          <figure key={index} className="animate-lightbox mx-4 flex max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl" />
            <figcaption className="mt-4 flex items-center gap-4 text-sm text-white/70">
              <span className="font-display tracking-[0.2em] text-gold-400">
                {index + 1} / {photos.length}
              </span>
              {current.alt}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Próxima foto"
            className="absolute right-3 z-10 hidden size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 sm:flex md:right-6"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </section>
  );
}
