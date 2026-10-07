import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { CalendarDays, Clock, Info, Lock, MapPin } from 'lucide-react';
import { config, type Show } from '@/data/config';
import { getUpcomingShows, MONTHS, pad2, parseLocalDate, WEEKDAYS } from '@/utils/helpers';
import { useEmblaNav } from '@/hooks/hooks';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { CarouselControls } from './CarouselControls';
import { InstagramIcon } from './BrandIcons';
import { useAgendaShows } from '@/contexts/AgendaContext';

/** Tempo (ms) que cada show fica parado antes de rodar */
const AUTOPLAY_DELAY = 3500;

function ShowCard({ show }: { show: Show }) {
  const d = parseLocalDate(show.date);

  return (
    <article className="group relative h-full transition-[filter] duration-500 hover:drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]">
      <div className="ticket relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-ink-700 to-ink-800 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-gold-500/50">
        {/* brilho no hover */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,168,29,0.2),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Data */}
        <header className="relative flex h-[120px] shrink-0 items-center justify-between px-6">
          <div>
            <span className="font-display text-lg tracking-[0.3em] text-gold-400">{WEEKDAYS[d.getDay()]}</span>
            <h3 className="font-display text-6xl leading-[0.9] text-cream">
              {pad2(d.getDate())}
              <span className="text-gold-500">.</span>
              {pad2(d.getMonth() + 1)}
            </h3>
          </div>
          <div className="flex flex-col items-end font-display leading-none">
            <span className="text-2xl text-white/45">{MONTHS[d.getMonth()]}</span>
            <span className="text-lg text-white/25">{d.getFullYear()}</span>
          </div>
        </header>

        {/* Picote */}
        <div className="mx-6 border-t-2 border-dashed border-white/10" />

        {/* Detalhes */}
        <div className="relative flex flex-1 flex-col gap-2 px-6 pb-6 pt-5">
          <p className="flex items-start gap-2 text-[0.95rem] font-bold uppercase tracking-wide text-cream">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />
            {show.city}
          </p>
          <p className="pl-6 text-sm font-medium text-white/70">{show.venue}</p>
          {show.time && (
            <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <Clock className="size-4 text-gold-500" />
              {show.time}
            </p>
          )}
          {show.description && (
            <p className="mt-1 line-clamp-3 text-xs font-medium uppercase leading-relaxed tracking-wide text-white/45">
              {show.description}
            </p>
          )}

          <div className="mt-auto pt-5">
            {show.ticketUrl ? (
              <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
                <Info className="size-4" />
                Mais Informações
              </a>
            ) : show.privateEvent ? (
              <span className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 font-display tracking-[0.14em] text-white/45">
                <Lock className="size-4" />
                Evento fechado
              </span>
            ) : (
              <span className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/30 py-3 font-display tracking-[0.14em] text-gold-300/80">
                <CalendarDays className="size-4" />
                Ingressos em breve
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyAgenda() {
  return (
    <Reveal animation="zoomIn">
      <div className="glass mx-auto max-w-xl rounded-3xl p-10 text-center">
        <CalendarDays className="mx-auto size-10 text-gold-400" />
        <h3 className="mt-4 font-display text-3xl tracking-wide">Novas datas em breve</h3>
        <p className="mt-2 text-white/60">Acompanhe nosso Instagram para não perder nenhum show.</p>
        <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
          <InstagramIcon className="size-5" />
          Seguir no Instagram
        </a>
      </div>
    </Reveal>
  );
}

export function Agenda() {
  const allShows = useAgendaShows();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const shows = useMemo(() => getUpcomingShows(allShows, now), [allShows, now]);
  const plugins = useMemo(
    () => [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true })],
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, plugins);
  const resetTimer = useCallback(() => plugins[0].reset?.(), [plugins]);
  const { selected, count, tick, scrollTo, scrollPrev, scrollNext } = useEmblaNav(emblaApi, resetTimer);
  const [hover, setHover] = useState(false);
  const [hoverCycle, setHoverCycle] = useState(0);

  return (
    <section id="agenda" className="relative scroll-mt-16 overflow-hidden bg-ink-900 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,168,29,0.13),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Próximos shows" title="Agenda" />

        {shows.length === 0 ? (
          <EmptyAgenda />
        ) : (
          <>
            <Reveal animation="fadeIn" delay={300}>
              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                <span className="text-gold-400">{pad2(shows.length)}</span> datas confirmadas
              </p>
            </Reveal>

            <div
              ref={emblaRef}
              className="overflow-hidden"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => {
                setHover(false);
                setHoverCycle((c) => c + 1);
              }}
            >
              <div className="-ml-5 flex touch-pan-y py-4">
                {shows.map((show, i) => (
                  <div
                    key={`${show.date}-${show.venue}`}
                    className="min-w-0 shrink-0 grow-0 basis-[86%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Reveal animation="fadeInUp" delay={i < 4 ? 250 + i * 250 : 0} className="h-full">
                      <ShowCard show={show} />
                    </Reveal>
                  </div>
                ))}
              </div>
            </div>

            <CarouselControls
              count={count}
              selected={selected}
              onDot={scrollTo}
              onPrev={scrollPrev}
              onNext={scrollNext}
              progress={{ key: `${tick}-${hoverCycle}`, duration: AUTOPLAY_DELAY, paused: hover }}
            />

            <Reveal animation="fadeIn" delay={200}>
              <p className="mt-10 text-center text-sm text-white/55">
                Quer o {config.name} no seu evento?{' '}
                <a href="#contrate" className="font-bold text-gold-400 underline-offset-4 hover:underline">
                  Fale com a gente →
                </a>
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
