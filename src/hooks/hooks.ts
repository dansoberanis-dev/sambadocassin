import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

type EmblaApi = UseEmblaCarouselType[1];

/** Detecta quando um elemento aparece na tela (uma única vez) */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/** true quando a página foi rolada além de `threshold` px */
export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/** Destaca no menu a seção visível (scrollspy) */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** Contagem regressiva até uma data */
export function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const diff = target ? Math.max(0, target.getTime() - now) : 0;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: target !== null && diff === 0,
  };
}

/** Navegação (bolinhas / setas) dos carrosséis Embla */
export function useEmblaNav(api: EmblaApi, onUserNav?: () => void) {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
    };
    const onReInit = () => {
      setCount(api.scrollSnapList().length);
      onSelect();
    };
    onReInit();
    api.on('select', onSelect);
    api.on('reInit', onReInit);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onReInit);
    };
  }, [api]);

  const scrollTo = useCallback(
    (i: number) => {
      api?.scrollTo(i);
      onUserNav?.();
    },
    [api, onUserNav]
  );
  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    onUserNav?.();
  }, [api, onUserNav]);
  const scrollNext = useCallback(() => {
    api?.scrollNext();
    onUserNav?.();
  }, [api, onUserNav]);

  return { selected, count, scrollTo, scrollPrev, scrollNext };
}
