import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { config } from '@/data/config';
import { useInView } from '@/hooks/hooks';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';

/** Número que "conta" até o valor quando aparece na tela */
function Counter({ value, prefix = '', suffix = '', duration = 2000 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

/** Prioriza a foto de bio configurada e mantém alternativas como fallback. */
const BIO_SOURCES = [
  config.bioImage,
  'images/cassinbio.jpg',
  'images/cassinbio.jpeg',
  'images/cassinbio.webp',
  'https://images.pexels.com/photos/38485789/pexels-photo-38485789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'images/banda.jpg',
];

export function Bio() {
  const { bio, stats } = config;
  const [bioIndex, setBioIndex] = useState(0);
  const bioSrc = BIO_SOURCES[Math.min(bioIndex, BIO_SOURCES.length - 1)];

  return (
    <section id="bio" className="relative scroll-mt-16 overflow-hidden bg-ink-950 py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 size-[36rem] rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Nossa história" title="Bio" />

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Foto do grupo */}
          <Reveal animation="fadeInLeft">
            <div className="relative mx-auto max-w-xl pb-6">
              <div aria-hidden="true" className="absolute -right-3 -top-3 bottom-3 left-6 rounded-3xl border-2 border-gold-500/40 md:-right-5 md:-top-5" />
              <img
                src={bioSrc}
                alt={`${config.name} reunido`}
                loading="lazy"
                onError={() => setBioIndex((i) => (i < BIO_SOURCES.length - 1 ? i + 1 : i))}
                className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
              />
              <div className="absolute -bottom-1 -left-2 rotate-[-5deg] rounded-2xl bg-linear-to-br from-gold-300 to-gold-600 px-6 py-4 text-ink-950 shadow-xl md:-left-6">
                <span className="block font-display text-sm tracking-[0.3em]">DESDE</span>
                <span className="block font-display text-5xl leading-none">{config.since}</span>
              </div>
            </div>
          </Reveal>

          {/* Texto */}
          <div>
            <Reveal animation="fadeInRight">
              <h3 className="font-display text-4xl leading-none tracking-wide text-cream md:text-5xl">{bio.title}</h3>
              <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-white/65">
                {bio.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <blockquote className="mt-7 flex gap-3 border-l-2 border-gold-500 pl-5">
                <Quote className="size-6 shrink-0 text-gold-500" />
                <p className="font-script text-2xl leading-snug text-gold-300">{bio.quote}</p>
              </blockquote>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} animation="zoomIn" delay={200 + i * 150}>
                  <div className="h-full rounded-2xl border border-white/10 bg-ink-800/70 p-4 text-center transition-colors duration-300 hover:border-gold-500/40">
                    <p className="font-display text-4xl leading-none text-gold-400 md:text-5xl">
                      <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </p>
                    <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/50">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
