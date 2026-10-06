import { useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Play } from 'lucide-react';
import { config, type Album } from '@/data/config';
import { useEmblaNav } from '@/hooks/hooks';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { CarouselControls } from './CarouselControls';

/** Capa do álbum — imagem ou capa tipográfica gerada automaticamente */
function Cover({ album, small }: { album: Album; small?: boolean }) {
  if (album.cover) {
    return (
      <img
        src={album.cover}
        alt={small ? '' : `Capa de ${album.title}`}
        draggable={false}
        loading="lazy"
        className="size-full object-cover"
      />
    );
  }

  const [c1, c2] = album.palette ?? ['#7a1d12', '#f2a81d'];
  return (
    <div
      className="@container relative flex size-full flex-col justify-between overflow-hidden p-[8%]"
      style={{ background: `radial-gradient(circle at 75% 20%, ${c2}66, transparent 55%), linear-gradient(150deg, ${c1}, #0b0806 85%)` }}
    >
      <div
        className="absolute -right-[22%] -top-[22%] aspect-square w-[85%] rounded-full opacity-50"
        style={{ background: `repeating-conic-gradient(${c2}55 0 6deg, transparent 6deg 18deg)` }}
      />
      <div className="absolute -bottom-[30%] -left-[20%] aspect-square w-[70%] rounded-full border-[6px] opacity-25" style={{ borderColor: c2 }} />
      {!small && (
        <>
          <span className="relative font-script text-[9cqw] leading-none text-gold-200/90">{config.name}</span>
          <span className="relative font-display text-[15cqw] uppercase leading-[0.85] text-cream">{album.title}</span>
        </>
      )}
    </div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <a href={album.url} target="_blank" rel="noopener noreferrer" className="group block select-none">
      <div className="relative mr-[14%]">
        {/* Vinil que desliza para fora da capa */}
        <div className="vinyl absolute inset-[3%] translate-x-[8%] transition-[translate,rotate] duration-700 ease-out group-hover:translate-x-[34%] group-hover:rotate-[200deg]">
          <div className="absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-ink-950">
            <Cover album={album} small />
          </div>
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-950" />
        </div>

        {/* Capa */}
        <div className="relative z-10 aspect-square overflow-hidden rounded-lg shadow-[0_20px_40px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-1">
          <Cover album={album} />
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all duration-500 group-hover:bg-ink-950/50 group-hover:opacity-100">
            <span className="flex size-14 scale-75 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-transform duration-500 group-hover:scale-100">
              <Play className="ml-0.5 size-6 fill-current" />
            </span>
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-display text-xs tracking-[0.2em] text-gold-300 backdrop-blur">
            {album.type}
          </span>
        </div>
      </div>

      <div className="mt-5 pr-[14%]">
        <h3 className="font-display text-2xl tracking-wide text-cream transition-colors group-hover:text-gold-400">{album.title}</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
          {album.type} • {album.year}
        </p>
      </div>
    </a>
  );
}

export function Discografia() {
  const plugins = useMemo(() => [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })], []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, plugins);
  const resetTimer = useCallback(() => plugins[0].reset?.(), [plugins]);
  const { selected, count, scrollTo, scrollPrev, scrollNext } = useEmblaNav(emblaApi, resetTimer);

  return (
    <section id="discografia" className="relative scroll-mt-16 overflow-hidden bg-ink-950 py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Nossa música" title="Discografia" />

        <Reveal animation="fadeIn" delay={500} duration={1200}>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="-ml-6 flex touch-pan-y py-2">
              {config.albums.map((album) => (
                <div key={album.title} className="min-w-0 shrink-0 grow-0 basis-[78%] pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          </div>
          <CarouselControls count={count} selected={selected} onDot={scrollTo} onPrev={scrollPrev} onNext={scrollNext} />
        </Reveal>
      </div>
    </section>
  );
}
