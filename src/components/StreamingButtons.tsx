import type { ReactNode } from 'react';
import { config } from '@/data/config';
import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';
import { AppleMusicIcon, DeezerIcon, SpotifyIcon, YouTubeIcon } from './BrandIcons';

interface Platform {
  key: string;
  label: string;
  caption: string;
  url: string;
  icon: ReactNode;
}

function getPlatforms(): Platform[] {
  const s = config.streaming;
  const list: Platform[] = [
    { key: 'spotify', label: 'Spotify', caption: 'Ouça no', url: s.spotify, icon: <SpotifyIcon className="size-6 text-[#1DB954]" /> },
    { key: 'deezer', label: 'Deezer', caption: 'Ouça no', url: s.deezer, icon: <DeezerIcon className="size-6" /> },
    { key: 'youtube', label: 'YouTube', caption: 'Assista no', url: s.youtube, icon: <YouTubeIcon className="size-6 text-[#FF0033]" /> },
    { key: 'apple', label: 'Apple Music', caption: 'Ouça no', url: s.appleMusic, icon: <AppleMusicIcon className="size-6" /> },
  ];
  return list.filter((p) => p.url);
}

/** Botões das plataformas de música (como os ícones coloridos do site original) */
export function StreamingButtons({
  baseDelay = 0,
  className,
  compact,
  only,
}: {
  baseDelay?: number;
  className?: string;
  compact?: boolean;
  /** Ex.: only={['spotify', 'youtube']} mostra só essas plataformas */
  only?: string[];
}) {
  const platforms = getPlatforms().filter((p) => !only || only.includes(p.key));
  return (
    <ul className={cn('flex flex-wrap justify-center gap-3', className)}>
      {platforms.map((p, i) => (
        <li key={p.key}>
          <Reveal animation="fadeInUp" delay={baseDelay + i * 150}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex items-center gap-3 rounded-full border border-white/15 bg-ink-950/55 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/70 hover:bg-ink-950/85 hover:shadow-[0_12px_30px_-12px_rgba(242,168,29,0.6)]',
                compact ? 'py-1.5 pl-1.5 pr-4' : 'py-2 pl-2 pr-5'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-full bg-white/[0.06] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110',
                  compact ? 'size-9' : 'size-11'
                )}
              >
                {p.icon}
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white/50">{p.caption}</span>
                <span className="text-sm font-bold text-cream">{p.label}</span>
              </span>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
