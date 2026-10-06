import { config, type Show } from '@/data/config';

/** Duração (ms) da tela de abertura — as animações da capa começam depois dela */
export const INTRO_DELAY = 1300;

/** Itens do menu (o id precisa ser igual ao id da seção) */
export const NAV_LINKS = [
  { id: 'capa', label: 'Capa' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'lancamento', label: 'Lançamento' },
  { id: 'discografia', label: 'Discografia' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'bio', label: 'Bio' },
  { id: 'contrate', label: 'Contrate' },
];

export const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
export const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Converte 'AAAA-MM-DD' em Date no fuso local (evita bug de fuso horário) */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Shows ordenados por data e horário, escondendo os que já começaram. */
export function getUpcomingShows(shows: Show[], now = new Date()): Show[] {
  const nowTime = now.getTime();
  return shows
    .filter((show) => !config.hidePastShows || getShowDateTime(show).getTime() >= nowTime)
    .sort((a, b) => getShowDateTime(a).getTime() - getShowDateTime(b).getTime());
}

/** Primeiro show que ainda não começou, considerando a data e a hora cadastradas. */
export function getNextShow(shows: Show[], now = new Date()): Show | undefined {
  const nowTime = now.getTime();
  return shows
    .filter((show) => getShowDateTime(show).getTime() >= nowTime)
    .sort((a, b) => getShowDateTime(a).getTime() - getShowDateTime(b).getTime())[0];
}

/** Data + horário do show (usado na contagem regressiva) */
export function getShowDateTime(show: Show): Date {
  const date = parseLocalDate(show.date);
  const match = show.time?.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  date.setHours(match ? Number(match[1]) : 20, match?.[2] ? Number(match[2]) : 0, 0, 0);
  return date;
}

export function formatDateBR(iso: string) {
  const d = parseLocalDate(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${config.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
