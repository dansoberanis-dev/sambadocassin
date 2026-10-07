import { Heart, Mail } from 'lucide-react';
import { config } from '@/data/config';
import { NAV_LINKS, whatsappLink } from '@/utils/helpers';
import { SocialLinks, WhatsAppIcon } from './BrandIcons';
import { StreamingButtons } from './StreamingButtons';

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = config;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-950 pb-8 pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <img
              src="/images/logo-horizontal-samba-cassin.png"
              alt={config.name}
              width={1638}
              height={446}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto max-w-full object-contain object-left md:h-14"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">{config.footerText}</p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <h4 className="font-display text-lg tracking-[0.3em] text-gold-400">NAVEGAÇÃO</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-white/60 transition-colors hover:text-gold-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-[0.3em] text-gold-400">CONTATO</h4>
            <div className="mt-5 flex items-start gap-5">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contato pelo WhatsApp"
                className="group flex w-20 flex-col items-center gap-2 text-center text-white/60 transition-colors hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-400 transition-all duration-300 group-hover:border-gold-500/60 group-hover:bg-gold-500/20 group-hover:text-gold-300">
                  <WhatsAppIcon className="size-8" />
                </span>
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Enviar e-mail"
                className="group flex w-20 flex-col items-center gap-2 text-center text-white/60 transition-colors hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-400 transition-all duration-300 group-hover:border-gold-500/60 group-hover:bg-gold-500/20 group-hover:text-gold-300">
                  <Mail className="size-8" />
                </span>
                <span className="text-sm font-medium">E-mail</span>
              </a>
            </div>
          </div>
        </div>

        <div data-music-player-dock className="flex h-16 items-center md:hidden" aria-hidden="true" />

        <div className="mt-14 border-t border-white/10 pt-10">
          <p className="mb-5 text-center font-display text-sm tracking-[0.35em] text-white/40">OUÇA EM TODAS AS PLATAFORMAS</p>
          <StreamingButtons compact />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>
            © {year} {config.name}. Todos os direitos reservados.
          </p>
          <a
            href="https://daniel-soberanis.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center font-bold text-gold-500 transition-colors hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
          >
            Desenvolvido por: Daniel Soberanis
          </a>
          <p className="flex items-center gap-1.5">
            Feito com <Heart className="size-3.5 fill-samba text-samba" /> e muito samba
          </p>
        </div>
      </div>
    </footer>
  );
}
