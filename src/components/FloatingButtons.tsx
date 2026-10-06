import { ArrowUp } from 'lucide-react';
import { config } from '@/data/config';
import { whatsappLink } from '@/utils/helpers';
import { useScrolled } from '@/hooks/hooks';
import { cn } from '@/utils/cn';
import { WhatsAppIcon } from './BrandIcons';

/** Botão flutuante do WhatsApp + voltar ao topo */
export function FloatingButtons() {
  const show = useScrolled(700);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo"
        className={cn(
          'flex size-11 items-center justify-center rounded-full border border-gold-500/40 bg-ink-900/90 text-gold-400 backdrop-blur transition-all duration-500 hover:bg-gold-500 hover:text-ink-950',
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        )}
      >
        <ArrowUp className="size-5" />
      </button>

      <a
        href={whatsappLink(`Olá, vim pelo site, quero contratar o ${config.name}`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-110"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <WhatsAppIcon className="relative size-7" />
        <span className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full bg-cream px-4 py-2 text-sm font-bold text-ink-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
          Contrate o show! 🎶
        </span>
      </a>
    </div>
  );
}
