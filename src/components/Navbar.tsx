import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, pad2 } from '@/utils/helpers';
import { config } from '@/data/config';
import { useActiveSection, useScrolled } from '@/hooks/hooks';
import { cn } from '@/utils/cn';
import { SocialLinks } from './BrandIcons';

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

/** Marca quadrada no menu; o wordmark horizontal aparece no Hero e no preloader. */
function NavbarLogo() {
  return (
    <img
      src="/images/logo-samba-cassin.png"
      alt={config.name}
      width={64}
      height={64}
      decoding="async"
      className="size-14 object-contain md:size-16"
    />
  );
}

export function Navbar() {
  const scrolled = useScrolled(80);
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-white/5 bg-ink-950/85 py-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md'
            : 'border-b border-transparent py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <a
            href="#capa"
            aria-label="Voltar ao início"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <NavbarLogo />
          </a>

          <nav aria-label="Menu principal" className="hidden items-center lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={cn(
                    'group relative px-3 py-2 font-display text-lg tracking-[0.16em] transition-colors duration-300 xl:px-4',
                    isActive ? 'text-gold-400' : 'text-cream/80 hover:text-gold-300'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-300 xl:inset-x-4',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <SocialLinks size="sm" limit={3} className="hidden lg:flex" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-ink-950/40 text-cream backdrop-blur transition hover:border-gold-500 hover:text-gold-400 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Menu mobile em tela cheia */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-xl transition-all duration-500 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <NavbarLogo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="flex size-11 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:text-gold-400"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 font-display text-5xl tracking-wide transition-all duration-500',
                open ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0',
                active === link.id ? 'text-gold-400' : 'text-cream hover:text-gold-300'
              )}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="font-sans text-xs font-bold text-gold-500/70">{pad2(i + 1)}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-8 pb-10">
          <SocialLinks />
        </div>
      </div>
    </>
  );
}
