import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Ticket } from 'lucide-react';
import { config } from '@/data/config';
import { getNextShow, getShowDateTime, INTRO_DELAY, pad2, parseLocalDate, WEEKDAYS } from '@/utils/helpers';
import { Reveal } from './Reveal';
import { Equalizer } from './Equalizer';
import { StreamingButtons } from './StreamingButtons';

/** Partículas douradas subindo (poeira de luz do palco) */
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 9 + Math.random() * 12,
        delay: -Math.random() * 20,
        drift: (Math.random() - 0.5) * 140,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="animate-float absolute -bottom-3 rounded-full bg-gold-300 shadow-[0_0_10px_2px_rgba(252,194,61,0.6)]"
          style={
            {
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              '--drift': `${d.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Card "Próximo show"; avança sozinho quando chega a data e a hora do evento. */
function NextShow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const next = useMemo(() => getNextShow(config.shows, new Date(now)), [now]);
  const target = useMemo(() => (next ? getShowDateTime(next) : null), [next]);

  if (!next || !target) return null;

  const d = parseLocalDate(next.date);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  const done = diff === 0;
  const units = [
    { value: days, label: 'dias' },
    { value: hours, label: 'horas' },
    { value: minutes, label: 'min' },
    { value: seconds, label: 'seg' },
  ];

  return (
    <div className="glass flex flex-col items-center gap-5 rounded-2xl px-5 py-5 md:flex-row md:justify-between md:px-7">
      <div className="min-w-0 text-center md:text-left">
        <p className="flex items-center justify-center gap-2 font-display text-sm tracking-[0.35em] text-gold-400 md:justify-start">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-gold-500" />
          </span>
          PRÓXIMO SHOW
        </p>
        <p className="mt-1 font-display text-2xl tracking-wide text-cream">
          {WEEKDAYS[d.getDay()]} {pad2(d.getDate())}.{pad2(d.getMonth() + 1)} — {next.city}
        </p>
        <p className="truncate text-xs font-medium uppercase tracking-widest text-white/50">{next.venue}</p>
      </div>

      {done ? (
        <p className="font-script text-4xl text-gold-400">É hoje!</p>
      ) : (
        <div className="flex gap-2">
          {units.map((u) => (
            <div key={u.label} className="flex w-[3.7rem] flex-col items-center rounded-xl border border-white/10 bg-ink-950/60 py-2">
              <span className="font-display text-3xl leading-none tabular-nums text-gold-300">{pad2(u.value)}</span>
              <span className="mt-1 text-[0.58rem] font-bold uppercase tracking-widest text-white/50">{u.label}</span>
            </div>
          ))}
        </div>
      )}

      <a href="#agenda" className="btn-outline shrink-0">
        <Ticket className="size-4" /> Ver agenda
      </a>
    </div>
  );
}

/** Usa primeiro a imagem configurada e mantém alternativas caso algum arquivo falte. */
const HERO_SOURCES = [config.heroImage, 'images/cassin3.jpg', 'images/cassin3.jpeg', 'images/cassin3.png', 'images/cassin3.webp', 'images/hero.jpg'];

export function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSrc = HERO_SOURCES[Math.min(heroIndex, HERO_SOURCES.length - 1)];

  return (
    <section id="capa" className="relative flex min-h-svh items-center justify-center overflow-hidden pb-28 pt-28">
      {/* Fundo com efeito Ken Burns */}
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={heroSrc}
          alt=""
          fetchPriority="high"
          onError={() => setHeroIndex((i) => (i < HERO_SOURCES.length - 1 ? i + 1 : i))}
          className="animate-kenburns size-full object-cover object-[50%_50%] md:object-[50%_46%]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/80 via-ink-950/50 to-ink-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(7,5,4,0.85)_80%)]" />
      </div>

      {/* Canhões de luz */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-spot-left absolute -top-24 left-[10%] h-[130%] w-40 bg-linear-to-b from-gold-300/30 via-gold-400/5 to-transparent blur-2xl md:w-56" />
        <div className="animate-spot-right absolute -top-24 right-[10%] h-[130%] w-40 bg-linear-to-b from-gold-300/25 via-gold-400/5 to-transparent blur-2xl md:w-56" />
      </div>

      <Particles />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-5 text-center">
        <Reveal animation="fadeInDown" delay={INTRO_DELAY}>
          <span className="inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-ink-950/40 px-4 py-1.5 font-display text-sm tracking-[0.4em] text-gold-300 backdrop-blur-sm">
            <Equalizer bars={3} className="h-3" />
            SITE OFICIAL
          </span>
        </Reveal>

        <Reveal animation="flipInX" delay={INTRO_DELAY + 250} duration={1300} className="mt-5">
          <h1 className="flex flex-col items-center gap-2">
            {config.logoKicker && (
              <span className="flex items-center gap-2 font-display text-sm tracking-[0.6em] text-gold-300/90 md:text-lg">
                <span className="h-px w-10 bg-current md:w-16" />
                {config.logoKicker}
                <span className="h-px w-10 bg-current md:w-16" />
              </span>
            )}
            <img
              src="images/logo-horizontal-samba-cassin.png"
              alt={config.name}
              fetchPriority="high"
              className="mx-auto h-auto w-[min(92vw,58rem)] drop-shadow-[0_0_22px_rgba(242,168,29,0.22)]"
            />
          </h1>
        </Reveal>

        <Reveal animation="fadeIn" delay={INTRO_DELAY + 800} duration={1400}>
          <p className="mt-3 max-w-2xl font-display text-xl tracking-[0.3em] text-cream/85 md:text-2xl">{config.tagline}</p>
        </Reveal>

        <StreamingButtons baseDelay={INTRO_DELAY + 1000} className="mt-9" only={['spotify', 'youtube']} />

        <Reveal animation="fadeInUp" delay={INTRO_DELAY + 1700} className="mt-10 w-full max-w-3xl">
          <NextShow />
        </Reveal>
      </div>

      {/* Indicador de rolagem */}
      <a
        href="#agenda"
        aria-label="Rolar para a agenda"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/60 transition-colors hover:text-gold-400"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-current pt-2">
          <span className="animate-scroll-wheel h-2 w-1 rounded-full bg-current" />
        </span>
        <span className="font-display text-xs tracking-[0.3em]">ROLE</span>
      </a>
    </section>
  );
}
