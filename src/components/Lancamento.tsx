import { useState } from 'react';
import { Play } from 'lucide-react';
import { config } from '@/data/config';
import { pad2 } from '@/utils/helpers';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { StreamingButtons } from './StreamingButtons';
import { YouTubeIcon } from './BrandIcons';

/** Player "leve": mostra a capa e só carrega o YouTube ao clicar.
 *  Se não houver ID de vídeo configurado, abre o canal do grupo. */
function VideoPlayer() {
  const r = config.release;
  const [playing, setPlaying] = useState(false);
  const poster = r.poster || (r.youtubeId ? `https://i.ytimg.com/vi/${r.youtubeId}/hqdefault.jpg` : r.cover);
  const channel = config.streaming.youtube || config.social.youtube;

  return (
    <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
      {playing && r.youtubeId ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${r.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={r.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <a
          href={r.youtubeId ? undefined : channel}
          target={r.youtubeId ? undefined : '_blank'}
          rel={r.youtubeId ? undefined : 'noopener noreferrer'}
          onClick={r.youtubeId ? () => setPlaying(true) : undefined}
          className="absolute inset-0 size-full"
          aria-label={r.youtubeId ? `Assistir: ${r.title}` : `Assistir no YouTube: ${r.title}`}
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/30 to-ink-950/20" />

          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="animate-pulse-ring absolute size-20 rounded-full bg-gold-500/50 md:size-24" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-[0_0_40px_rgba(242,168,29,0.6)] transition-transform duration-300 group-hover:scale-110 md:size-24">
              <Play className="ml-1 size-9 fill-current" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-left md:p-7">
            <span>
              <span className="block font-display text-sm tracking-[0.35em] text-gold-400">ASSISTA NO YOUTUBE</span>
              <span className="block font-display text-2xl text-cream md:text-4xl">{r.song}</span>
            </span>
            <span className="hidden items-center gap-2 rounded-full bg-[#FF0033] px-3 py-1.5 text-xs font-bold text-white sm:flex">
              <YouTubeIcon className="size-4" />
              YouTube
            </span>
          </span>
        </a>
      )}
    </div>
  );
}

export function Lancamento() {
  const r = config.release;

  return (
    <section id="lancamento" className="relative scroll-mt-16 overflow-hidden py-24 md:py-32">
      {/* Fundo: capa desfocada */}
      <div aria-hidden="true" className="absolute inset-0">
        <img src={r.cover} alt="" loading="lazy" className="size-full scale-125 object-cover opacity-25 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-900 via-ink-900/70 to-ink-900" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Novo álbum" title="Lançamento" />

        <Reveal animation="fadeIn" delay={500}>
          <h3 className="mx-auto max-w-3xl text-center font-display text-2xl tracking-wide text-cream/90 md:text-4xl">{r.title}</h3>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_340px]">
          <Reveal animation="zoomIn" delay={300}>
            <VideoPlayer />
          </Reveal>

          <Reveal animation="fadeInRight" delay={600}>
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Capa + vinil girando */}
              <div className="relative mb-8 w-48 md:w-52">
                <div className="vinyl animate-spin-slow absolute inset-y-[5%] left-[34%] aspect-square">
                  <img
                    src={r.cover}
                    alt=""
                    className="absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink-950 object-cover"
                  />
                </div>
                <img
                  src={r.cover}
                  alt={`Capa de ${r.song}`}
                  loading="lazy"
                  className="relative z-10 aspect-square w-full rounded-xl object-cover shadow-[0_25px_50px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                />
              </div>

              <p className="font-display text-sm tracking-[0.4em] text-gold-400 uppercase">{r.label}</p>
              <h4 className="font-script text-4xl leading-tight text-cream">{r.song}</h4>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{r.text}</p>

              {/* Faixas do álbum */}
              {config.tracklist.length > 0 && (
                <div className="mt-6 w-full max-w-sm">
                  <p className="mb-2 font-display text-sm tracking-[0.3em] text-gold-400">FAIXAS</p>
                  <ol className="space-y-1.5">
                    {config.tracklist.map((track, i) => (
                      <li key={track} className="flex items-baseline gap-3 text-sm text-white/70">
                        <span className="w-5 shrink-0 text-right font-display text-gold-500/80">{pad2(i + 1)}</span>
                        <span className="min-w-0">{track}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <StreamingButtons compact baseDelay={700} className="mt-6 lg:justify-start" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
