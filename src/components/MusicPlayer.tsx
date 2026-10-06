import { useEffect, useRef, useState } from 'react';
import { Music2, Pause, Play } from 'lucide-react';

type Track = {
  title: string;
  src: string;
};

const TRACKS: Track[] = [
  { title: 'Clamor a Xangô', src: '/audio/clamor-a-xango.mp3' },
  { title: 'Íris de Oyá', src: '/audio/iris-de-oya.mp3' },
  { title: 'De Rezar e Sambar', src: '/audio/de-rezar-e-sambar.mp3' },
  { title: 'Quartinha Cheia', src: '/audio/quartinha-cheia.mp3' },
];

function randomTrackIndex() {
  return Math.floor(Math.random() * TRACKS.length);
}

/** Player compacto: escolhe uma faixa aleatória e tenta iniciar ao abrir o site. */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [trackIndex] = useState(randomTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [dockTop, setDockTop] = useState<number | null>(null);
  const track = TRACKS[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      })
      .catch(() => {
        // Navegadores podem bloquear a reprodução automática com som.
        setIsPlaying(false);
        setAutoplayBlocked(true);
      });

    return () => audio.pause();
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateDockPosition = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const dock = document.querySelector<HTMLElement>('[data-music-player-dock]');
        const footer = dock?.closest('footer');
        const player = playerRef.current;

        if (!isMobile || !dock || !footer || !player) {
          setDockTop(null);
          return;
        }

        const footerRect = footer.getBoundingClientRect();
        const footerIsVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;
        if (!footerIsVisible) {
          setDockTop(null);
          return;
        }

        const dockRect = dock.getBoundingClientRect();
        const playerHeight = player.getBoundingClientRect().height;
        setDockTop(dockRect.top + (dockRect.height - playerHeight) / 2);
      });
    };

    updateDockPosition();
    window.addEventListener('scroll', updateDockPosition, { passive: true });
    window.addEventListener('resize', updateDockPosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateDockPosition);
      window.removeEventListener('resize', updateDockPosition);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setAutoplayBlocked(false);
        setIsPlaying(true);
      } catch {
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  return (
    <div
      ref={playerRef}
      style={dockTop === null ? undefined : { top: `${dockTop}px`, bottom: 'auto' }}
      className={`fixed left-4 z-40 flex w-[68vw] max-w-72 min-w-0 items-center gap-2 rounded-full border border-white/10 bg-ink-950/90 p-2 pr-3 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.75)] backdrop-blur-md ${dockTop === null ? 'bottom-5' : ''}`}
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? `Pausar ${track.title}` : `Tocar ${track.title}`}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Pausar música' : 'Tocar música'}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-colors hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
      >
        {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
      </button>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-display text-sm tracking-wide text-cream">{track.title}</p>
        <p className="truncate text-[0.55rem] font-bold uppercase tracking-[0.16em] text-gold-400">
          {isPlaying ? 'Tocando agora' : autoplayBlocked ? 'Toque para ouvir' : 'Faixa aleatória'}
        </p>
      </div>
      <Music2 aria-hidden="true" className="size-4 shrink-0 text-gold-400/80" />
    </div>
  );
}
