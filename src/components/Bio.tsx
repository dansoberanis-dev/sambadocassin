import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { config, type Member } from '@/data/config';
import { initials } from '@/utils/helpers';
import { useInView } from '@/hooks/hooks';
import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { InstagramIcon } from './BrandIcons';

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

function MemberCard({ member }: { member: Member }) {
  const portrait = member.photo ? (
    <img
      src={member.photo}
      alt={`${member.name} — ${member.role}`}
      loading="lazy"
      className="size-full object-cover transition-all duration-700 group-hover:scale-110 md:grayscale md:group-hover:grayscale-0"
    />
  ) : (
    <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_25%,rgba(242,168,29,0.22),transparent_65%)] p-4 text-center">
      <span className="flex size-20 items-center justify-center rounded-full border-2 border-gold-500/50 bg-ink-950/60 font-display text-3xl tracking-widest text-gold-400 transition-transform duration-500 group-hover:scale-110">
        {initials(member.name)}
      </span>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">foto em breve</span>
    </div>
  );

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
      <div className="aspect-[3/4] overflow-hidden">
        {member.photo && member.instagram ? (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver foto de ${member.name} no Instagram`}
            className="block size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
          >
            {portrait}
          </a>
        ) : (
          portrait
        )}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="mb-2 block h-0.5 w-8 bg-gold-500 transition-all duration-500 group-hover:w-14" />
        <h4 className="font-display text-2xl leading-none tracking-wide text-cream md:text-[1.7rem]">{member.name}</h4>
        <p className="mt-1 font-script text-lg text-gold-400">{member.role}</p>
      </div>
      {member.instagram && (
        <a
          href={member.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir Instagram de ${member.name}`}
          className="absolute right-3 top-3 z-10 flex size-9 -translate-y-2 items-center justify-center rounded-full bg-ink-950/70 text-cream opacity-0 backdrop-blur transition-all duration-300 hover:bg-gold-500 hover:text-ink-950 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <InstagramIcon className="size-4" />
        </a>
      )}
    </article>
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
  const { bio, stats, members } = config;
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

        {/* Integrantes */}
        <div id="integrantes" className="mt-28">
          <Reveal animation="bounceInDown" duration={1400}>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.5em] text-gold-400">QUEM FAZ O SOM</p>
              <h3 className="font-script text-5xl text-cream md:text-6xl">Integrantes</h3>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
            {members.map((m, i) => {
              const lastOdd = i === members.length - 1 && members.length % 2 === 1;
              return (
                <Reveal
                  key={m.name}
                  animation="fadeInUp"
                  delay={i * 150}
                  className={cn(lastOdd && 'col-span-2 mx-auto w-1/2 md:col-span-1 md:mx-0 md:w-auto')}
                >
                  <MemberCard member={m} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
