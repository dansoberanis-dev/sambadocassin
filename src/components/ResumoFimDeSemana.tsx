import { Play } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';

/** Cartão único, pronto para receber o compilado vertical da playlist do YouTube. */
export function ResumoFimDeSemana() {
  return (
    <section
      id="resumo-do-fim-de-semana"
      className="relative scroll-mt-16 overflow-hidden bg-ink-900 py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,168,29,0.10),transparent_62%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle kicker="Vídeo semanal" title="Resumo do fim de semana" />

        <Reveal animation="fadeInUp" className="mx-auto max-w-6xl">
          <article className="grid overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/[0.055] to-white/[0.015] shadow-[0_24px_60px_rgba(0,0,0,0.32)] lg:grid-cols-[minmax(0,390px)_1fr]">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[390px] overflow-hidden bg-ink-950">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,168,29,0.20),transparent_48%),linear-gradient(160deg,#21180f_0%,#0d0907_56%,#070504_100%)]"
              />
              <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
                <span
                  aria-hidden="true"
                  className="grid size-20 place-items-center rounded-full border border-gold-400/55 bg-gold-500/10 text-gold-300 shadow-[0_0_45px_rgba(242,168,29,0.16)]"
                >
                  <Play className="ml-1 size-8 fill-current" />
                </span>
                <p className="mt-7 font-display text-xs uppercase tracking-[0.32em] text-gold-300">
                  Vídeo semanal
                </p>
                <p className="mt-2 font-script text-4xl leading-tight text-cream md:text-5xl">
                  Resumo do fim de semana
                </p>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-white/5"
              />
            </div>

            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <p className="font-display text-sm uppercase tracking-[0.42em] text-gold-400 md:text-base">
                Samba do Cassin
              </p>
              <h3 className="mt-4 font-display text-3xl uppercase leading-[0.98] tracking-wide text-cream md:text-5xl">
                O melhor da roda, em um só vídeo.
              </h3>
              <span className="my-6 h-px w-16 bg-linear-to-r from-gold-500 to-transparent" />
              <p className="max-w-lg font-sans text-sm leading-relaxed text-cream/65 md:text-base">
                Este espaço receberá o compilado vertical do fim de semana. A playlist do YouTube será conectada aqui quando estiver pronta.
              </p>
              <p className="mt-6 font-display text-xs uppercase tracking-[0.24em] text-gold-300/70">
                Playlist do YouTube a conectar
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
