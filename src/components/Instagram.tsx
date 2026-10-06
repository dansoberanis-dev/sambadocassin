import { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { config } from '@/data/config';
import { initials } from '@/utils/helpers';
import { Reveal } from './Reveal';
import { InstagramIcon } from './BrandIcons';

type FeedPost = {
  id: string;
  image: string;
  url?: string;
  likes?: string;
  comments?: string;
};

type FeedResponse = {
  configured?: boolean;
  posts?: FeedPost[];
  profile?: {
    username?: string;
    followersCount?: number;
    mediaCount?: number;
  } | null;
};

function formatCompactCount(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function Instagram() {
  const { instagram, instagramHandle } = config.social;
  const [livePosts, setLivePosts] = useState<FeedPost[] | null>(null);
  const [liveStats, setLiveStats] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/instagram', { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as FeedResponse;
      })
      .then((data) => {
        if (!data?.configured) return;
        if (Array.isArray(data.posts)) setLivePosts(data.posts);

        const followers = data.profile?.followersCount;
        const media = data.profile?.mediaCount;
        if (typeof followers === 'number' && typeof media === 'number') {
          setLiveStats(`${formatCompactCount(media)} publicações • ${formatCompactCount(followers)} seguidores`);
        }
      })
      .catch(() => {
        // Em npm run dev sem Vercel Functions, mantém os cards de fallback do config.ts.
      });

    return () => controller.abort();
  }, []);

  const posts: FeedPost[] = livePosts ?? config.instagramPosts.map((post, i) => ({ id: `fallback-${i}`, ...post }));

  return (
    <section id="instagram" className="relative overflow-hidden bg-ink-900 py-24">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal animation="fadeInUp">
          <header className="mb-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="rounded-full bg-[conic-gradient(from_180deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[3px]">
                <div className="flex size-16 items-center justify-center rounded-full border-4 border-ink-900 bg-ink-800 font-script text-2xl text-gold-400">
                  {initials(config.name)}
                </div>
              </div>
              <div>
                <p className="font-display text-sm tracking-[0.35em] text-gold-400">SIGA NO INSTAGRAM</p>
                <h2 className="font-display text-3xl tracking-wide text-cream md:text-4xl">{instagramHandle}</h2>
                <p className="text-sm text-white/50">{liveStats ?? config.instagramStats}</p>
              </div>
            </div>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <InstagramIcon className="size-5" />
              Seguir
            </a>
          </header>
        </Reveal>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {posts.length === 0 ? (
            <p className="col-span-full rounded-xl border border-white/10 bg-ink-800/50 p-8 text-center text-sm text-white/60">
              Novas publicações aparecerão aqui em breve.
            </p>
          ) : (
            posts.map((post, i) => (
              <Reveal key={post.id || `${post.image}-${i}`} animation="zoomIn" delay={i * 120}>
                <a
                  href={post.url || instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-ink-800"
                  aria-label="Ver publicação no Instagram"
                >
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {post.likes || post.comments ? (
                    <span className="absolute inset-0 flex items-center justify-center gap-5 bg-ink-950/60 text-sm font-bold text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {post.likes && (
                        <span className="flex items-center gap-1.5">
                          <Heart className="size-5 fill-current" />
                          {post.likes}
                        </span>
                      )}
                      {post.comments && (
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="size-5 fill-current" />
                          {post.comments}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink-950/60 font-display tracking-[0.18em] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      VER PUBLICAÇÃO
                    </span>
                  )}
                  <InstagramIcon className="absolute right-2.5 top-2.5 size-5 text-white/85 drop-shadow" />
                </a>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
