import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { config, type Photo } from '@/data/config';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { InstagramIcon } from './BrandIcons';

const WORDPRESS_SITE = 'https://cassinsite9.wordpress.com';
const WORDPRESS_CATEGORY_ID = 772; // categoria compartilhada FOTOS
const WORDPRESS_API_URL =
  `https://public-api.wordpress.com/wp/v2/sites/cassinsite9.wordpress.com/posts?categories=${WORDPRESS_CATEGORY_ID}&status=publish&per_page=100&_embed=wp:featuredmedia`;

// Mantém o mesmo álbum de destaque do mock aprovado; se ele for removido, usa o primeiro publicado.
const HOME_FEATURED_ALBUM_ID = 6;

type WordPressFeaturedMedia = {
  source_url?: string;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type WordPressPost = {
  id: number;
  status?: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  featured_media?: number;
  jetpack_featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: WordPressFeaturedMedia[];
  };
};

type GalleryPhoto = Photo;

type GalleryAlbum = {
  id: number;
  title: string;
  cover: string;
  photos: GalleryPhoto[];
};

type GalleryView = 'home' | 'albums' | 'album';

const fallbackPhotos: GalleryPhoto[] = config.photos.map((photo, index) => ({
  src: photo.src,
  alt: `Foto ${index + 1} do álbum Fotos`,
}));

const fallbackAlbum: GalleryAlbum = {
  id: 0,
  title: 'Fotos',
  cover: fallbackPhotos[0]?.src ?? '',
  photos: fallbackPhotos,
};

function textFromHtml(value: string): string {
  return new DOMParser()
    .parseFromString(value, 'text/html')
    .body.textContent?.replace(/\u00a0/g, ' ')
    .trim() || value;
}

function normalizeImageUrl(value: string): string {
  if (value.startsWith('data:') || /^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  try {
    return new URL(value, WORDPRESS_SITE).toString();
  } catch {
    return value;
  }
}

/**
 * Lê as imagens dos blocos Gallery do WordPress e Jetpack, sem depender do estilo
 * visual escolhido no editor (mosaico, colunas, círculos ou tiled gallery).
 */
function photosFromWordPress(content: string, albumTitle: string): GalleryPhoto[] {
  const document = new DOMParser().parseFromString(content, 'text/html');
  const images = Array.from(
    document.querySelectorAll(
      '.wp-block-gallery img, .wp-block-jetpack-tiled-gallery img, .tiled-gallery__gallery img, .gallery img'
    )
  );
  const seen = new Set<string>();
  const photos: GalleryPhoto[] = [];

  for (const image of images) {
    const rawSource =
      image.getAttribute('data-large-file') ||
      image.getAttribute('data-orig-file') ||
      image.getAttribute('data-url') ||
      image.getAttribute('src') ||
      '';
    if (!rawSource) continue;

    const src = normalizeImageUrl(rawSource);
    if (!src || seen.has(src)) continue;
    seen.add(src);

    // O nome de arquivo não é apresentado na interface; use texto alternativo neutro.
    photos.push({ src, alt: `Foto ${photos.length + 1} do álbum ${albumTitle}` });
  }

  return photos;
}

function featuredImageFromWordPress(post: WordPressPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes;
  return (
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    media?.source_url ||
    post.jetpack_featured_media_url ||
    ''
  );
}

function albumFromWordPress(post: WordPressPost): GalleryAlbum | null {
  if (!post.id || (post.status && post.status !== 'publish')) return null;
  const title = textFromHtml(post.title?.rendered ?? '').trim();
  const content = post.content?.rendered ?? '';
  if (!title || !content) return null;

  const photos = photosFromWordPress(content, title);
  // A categoria FOTOS reúne álbuns; só exibe posts que realmente têm uma galeria.
  if (photos.length === 0) return null;

  return {
    id: post.id,
    title,
    cover: featuredImageFromWordPress(post) || photos[0].src,
    photos,
  };
}

interface CoverLayersProps {
  src: string;
  alt: string;
}

/** Imagem integral na frente e a mesma imagem ampliada/desfocada por trás. */
function CoverLayers({ src, alt }: CoverLayersProps) {
  if (!src) return <span className="absolute inset-0 bg-ink-800" aria-hidden="true" />;

  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -inset-[8%] z-0 h-[116%] w-[116%] scale-110 object-cover opacity-85 blur-2xl brightness-50 transition-transform duration-1000 group-hover:scale-[1.15]"
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="relative z-10 block h-full w-full object-contain"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  );
}

interface HomeTileProps {
  album: GalleryAlbum;
  image: string;
  label: string;
  featured?: boolean;
  delay?: number;
  onOpen: (album: GalleryAlbum) => void;
}

function HomeTile({ album, image, label, featured = false, delay = 0, onOpen }: HomeTileProps) {
  return (
    <Reveal
      animation="zoomIn"
      delay={delay}
      className={featured ? 'col-span-2 row-span-1 h-[260px] md:col-span-1 md:row-span-2 md:h-full' : 'h-[150px] md:h-full'}
    >
      <button
        type="button"
        onClick={() => onOpen(album)}
        className="group relative block size-full overflow-hidden rounded-2xl bg-ink-800 text-left shadow-[0_16px_38px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
        aria-label={`Abrir álbum ${album.title}`}
      >
        <CoverLayers src={image} alt={`Imagem do álbum ${album.title}`} />
        <span className="pointer-events-none absolute inset-0 z-30 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-gold-500/70" />
        <span className="pointer-events-none absolute left-4 top-1/2 z-30 flex size-12 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-gold-500 text-ink-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 md:left-6 md:size-14">
          <ZoomIn className="size-5 md:size-6" />
        </span>
        <span className="pointer-events-none absolute bottom-4 left-4 z-30 flex flex-col gap-1 md:bottom-6 md:left-7">
          <span className="font-display text-[10px] uppercase tracking-[0.22em] text-gold-400 md:text-xs">{label}</span>
          <span className={`font-display uppercase leading-none tracking-wide text-cream ${featured ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'}`}>
            {album.title}
          </span>
        </span>
      </button>
    </Reveal>
  );
}

interface AlbumCardProps {
  album: GalleryAlbum;
  delay: number;
  onOpen: (album: GalleryAlbum) => void;
}

function AlbumCard({ album, delay, onOpen }: AlbumCardProps) {
  return (
    <Reveal animation="fadeInUp" delay={delay} className="h-full">
      <button
        type="button"
        onClick={() => onOpen(album)}
        className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.055] to-white/[0.015] text-left text-cream shadow-[0_14px_36px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-gold-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
        aria-label={`Abrir álbum ${album.title}`}
      >
        <span className="relative block h-[clamp(210px,30vw,350px)] w-full overflow-hidden bg-ink-950">
          <CoverLayers src={album.cover} alt={`Capa do álbum ${album.title}`} />
          <span className="pointer-events-none absolute bottom-5 left-5 z-30 font-display text-3xl uppercase tracking-wide text-cream drop-shadow-lg md:bottom-6 md:left-7 md:text-5xl">
            {album.title}
          </span>
        </span>
        <span className="flex w-full flex-1 items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
          <span className="min-w-0">
            <strong className="block truncate font-display text-xl uppercase tracking-wide text-cream md:text-2xl">{album.title}</strong>
            <span className="mt-1 block font-sans text-sm text-cream/60">Ver as fotos</span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950" aria-hidden="true">
            <ChevronRight className="size-5" />
          </span>
        </span>
      </button>
    </Reveal>
  );
}

export function Fotos() {
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([fallbackAlbum]);
  const [view, setView] = useState<GalleryView>('home');
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWordPressAlbums() {
      try {
        const response = await fetch(WORDPRESS_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`WordPress API respondeu ${response.status}`);

        const posts = (await response.json()) as WordPressPost[];
        if (!Array.isArray(posts)) throw new Error('A resposta da API WordPress não contém uma lista de posts.');

        const fetchedAlbums = posts
          .map(albumFromWordPress)
          .filter((album): album is GalleryAlbum => album !== null);

        if (fetchedAlbums.length > 0) setAlbums(fetchedAlbums);
      } catch (error) {
        if (!controller.signal.aborted) {
          // A galeria local existente permanece disponível se a API estiver indisponível.
          console.warn('Não foi possível carregar os álbuns do WordPress; usando as fotos locais.', error);
        }
      }
    }

    void loadWordPressAlbums();
    return () => controller.abort();
  }, []);

  const homeFeaturedAlbum = albums.find((album) => album.id === HOME_FEATURED_ALBUM_ID) ?? albums[0] ?? fallbackAlbum;
  const otherAlbums = albums.filter((album) => album.id !== homeFeaturedAlbum.id);
  const supportPhotos = homeFeaturedAlbum.photos.filter((photo) => photo.src !== homeFeaturedAlbum.cover);
  const rightTopAlbum = otherAlbums[0] ?? homeFeaturedAlbum;
  const rightTopImage = otherAlbums[0]?.cover ?? supportPhotos[0]?.src ?? homeFeaturedAlbum.cover;
  const rightBottomAlbum = otherAlbums[1] ?? homeFeaturedAlbum;
  const rightBottomImage = otherAlbums[1]?.cover ?? supportPhotos[1]?.src ?? supportPhotos[0]?.src ?? homeFeaturedAlbum.cover;

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) ?? null;
  const photos = selectedAlbum?.photos ?? [];
  const current = index !== null ? photos[index] ?? null : null;
  const photoCount = photos.length;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((currentIndex) => (currentIndex === null || photoCount === 0 ? currentIndex : (currentIndex - 1 + photoCount) % photoCount)),
    [photoCount]
  );
  const next = useCallback(
    () => setIndex((currentIndex) => (currentIndex === null || photoCount === 0 ? currentIndex : (currentIndex + 1) % photoCount)),
    [photoCount]
  );

  const goToView = (nextView: GalleryView) => {
    setView(nextView);
    if (nextView === 'home') setSelectedAlbumId(null);
    setIndex(null);
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const openAlbum = (album: GalleryAlbum) => {
    setSelectedAlbumId(album.id);
    setIndex(null);
    setView('album');
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, prev, next]);

  const openLightbox = (photoIndex: number) => setIndex(photoIndex);

  return (
    <section ref={sectionRef} id="fotos" className="relative scroll-mt-16 overflow-hidden bg-ink-900 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        {view === 'home' && (
          <>
            <SectionTitle kicker="Galeria" title="Fotos" />
            <div className="grid grid-cols-2 grid-rows-[260px_150px] gap-3 md:grid-cols-[1.55fr_1fr] md:grid-rows-[clamp(170px,22vw,250px)_clamp(170px,22vw,250px)]">
              <HomeTile album={homeFeaturedAlbum} image={homeFeaturedAlbum.cover} label="Álbum em destaque" featured delay={0} onOpen={openAlbum} />
              <HomeTile album={rightTopAlbum} image={rightTopImage} label="Álbum" delay={120} onOpen={openAlbum} />
              <HomeTile album={rightBottomAlbum} image={rightBottomImage} label={otherAlbums[1] ? 'Álbum' : 'Mais do álbum'} delay={240} onOpen={openAlbum} />
            </div>
            <Reveal animation="fadeInUp" className="mt-10 flex justify-center">
              <button type="button" onClick={() => goToView('albums')} className="btn-outline">
                Ver todos os álbuns <ChevronRight className="size-4" />
              </button>
            </Reveal>
            <Reveal animation="fadeInUp" delay={120} className="mt-5 flex justify-center">
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <InstagramIcon className="size-5" />
                Mais fotos no Instagram
              </a>
            </Reveal>
          </>
        )}

        {view === 'albums' && (
          <>
            <div className="mb-5">
              <button type="button" onClick={() => goToView('home')} className="btn-outline">
                <ChevronLeft className="size-4" /> Voltar às fotos
              </button>
            </div>
            <SectionTitle kicker="Galeria" title="Álbuns" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {albums.map((album, albumIndex) => (
                <AlbumCard key={album.id} album={album} delay={(albumIndex % 4) * 120} onOpen={openAlbum} />
              ))}
            </div>
            <Reveal animation="fadeInUp" className="mt-10 flex justify-center">
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <InstagramIcon className="size-5" />
                Mais fotos no Instagram
              </a>
            </Reveal>
          </>
        )}

        {view === 'album' && selectedAlbum && (
          <>
            <div className="mb-7 flex justify-start">
              <button type="button" onClick={() => goToView('albums')} className="btn-outline">
                <ChevronLeft className="size-4" /> Todos os álbuns
              </button>
            </div>
            <Reveal animation="bounceInDown" duration={1200} className="relative mb-12 text-center md:mb-16">
              <p className="mb-1 font-display text-sm uppercase tracking-[0.5em] text-gold-400 md:text-base">Galeria de fotos</p>
              <h2 className="font-script text-5xl leading-tight text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] md:text-7xl">
                {selectedAlbum.title}
              </h2>
              <span className="mx-auto mt-4 block h-px w-16 bg-linear-to-r from-transparent via-gold-500 to-transparent" />
            </Reveal>
            {photos.length > 0 ? (
              <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
                {photos.map((photo, photoIndex) => (
                  <Reveal key={`${selectedAlbum.id}-${photo.src}`} animation="zoomIn" delay={(photoIndex % 6) * 80} className="mb-3 break-inside-avoid md:mb-4">
                    <button
                      type="button"
                      onClick={() => openLightbox(photoIndex)}
                      className="group relative block h-auto w-full overflow-hidden rounded-2xl bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                      aria-label={`Ampliar foto do álbum ${selectedAlbum.title}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="block h-auto w-full object-contain transition-[filter] duration-500 group-hover:brightness-110"
                      />
                      <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-gold-500/70" />
                      <span className="pointer-events-none absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-gold-500 text-ink-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <ZoomIn className="size-6" />
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="text-center font-sans text-cream/60">Este álbum ainda não tem fotos publicadas.</p>
            )}
            <Reveal animation="fadeInUp" className="mt-10 flex justify-center">
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <InstagramIcon className="size-5" />
                Mais fotos no Instagram
              </a>
            </Reveal>
          </>
        )}
      </div>

      {/* Lightbox: preserva navegação por teclado/toque, sem data, nome de arquivo ou contador. */}
      {current && index !== null && selectedAlbum && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos do álbum ${selectedAlbum.title}`}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/95 px-4 py-16 backdrop-blur-md"
          onClick={close}
          onTouchStart={(event) => {
            touchX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchX.current === null) return;
            const dx = event.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) {
              if (dx > 0) prev();
              else next();
            }
            touchX.current = null;
          }}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              close();
            }}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-20 flex size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            aria-label="Foto anterior"
            className="absolute left-3 z-20 hidden size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 sm:flex md:left-6"
          >
            <ChevronLeft className="size-6" />
          </button>

          <figure className="animate-lightbox mx-4 flex max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[78vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" />
          </figure>

          <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[80vw] -translate-x-1/2 items-center justify-center gap-2 overflow-x-auto rounded-full bg-ink-950/70 px-3 py-2" role="group" aria-label="Navegação entre fotos">
            {photos.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Ir para foto ${dotIndex + 1}`}
                aria-current={index === dotIndex ? 'true' : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(dotIndex);
                }}
                className={`h-1.5 shrink-0 rounded-full transition-all ${index === dotIndex ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/40 hover:bg-white/80'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Próxima foto"
            className="absolute right-3 z-20 hidden size-12 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 sm:flex md:right-6"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </section>
  );
}
