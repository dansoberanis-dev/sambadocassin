import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { config, type Show } from '@/data/config';

type AgendaResponse = {
  configured?: boolean;
  shows?: Show[];
};

const AgendaContext = createContext<Show[]>(config.shows);

/**
 * Mantém a agenda sincronizada com a API da Vercel. Enquanto o feed não responde
 * (ou não está configurado em produção), usa config.shows como fallback.
 */
export function AgendaProvider({ children }: { children: ReactNode }) {
  const [shows, setShows] = useState<Show[]>(config.shows);

  useEffect(() => {
    let stopped = false;
    let activeRequest: AbortController | null = null;

    const refreshAgenda = async () => {
      activeRequest?.abort();
      const controller = new AbortController();
      activeRequest = controller;

      try {
        const response = await fetch('/api/agenda', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) return;

        const data = (await response.json()) as AgendaResponse;
        if (!stopped && data.configured === true && Array.isArray(data.shows)) {
          setShows(data.shows);
        }
      } catch {
        // Sem Vercel Functions no dev local, mantém a agenda já carregada como fallback.
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshAgenda();
    };

    void refreshAgenda();
    const interval = window.setInterval(() => void refreshAgenda(), 60_000);
    window.addEventListener('focus', refreshAgenda);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      stopped = true;
      activeRequest?.abort();
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshAgenda);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  return <AgendaContext.Provider value={shows}>{children}</AgendaContext.Provider>;
}

export function useAgendaShows() {
  return useContext(AgendaContext);
}
