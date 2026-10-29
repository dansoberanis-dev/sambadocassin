type ApiRequest = { method?: string };

type ApiResponse = {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
};

type PublishedShow = {
  date: string;
  city: string;
  venue: string;
  time?: string;
  description?: string;
  ticketUrl?: string;
};

type WordPressPost = {
  id: number;
  status: string;
  modified?: string;
  categories: number[];
  content?: { rendered?: string };
};

const WORDPRESS_SITE = 'cassinsite9.wordpress.com';
const WORDPRESS_POST_ID = 68;
const WORDPRESS_AGENDA_CATEGORY_ID = 13502;
const WORDPRESS_API_URL = `https://public-api.wordpress.com/wp/v2/sites/${WORDPRESS_SITE}/posts/${WORDPRESS_POST_ID}`;
const CANCELLED_STATUSES = new Set(['CANCELADO', 'CANCELADA', 'CANCELLED', 'CANCELED', 'CANCEL']);

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  copy: '©',
  gt: '>',
  hellip: '…',
  ldquo: '“',
  lsquo: '‘',
  lt: '<',
  mdash: '—',
  nbsp: ' ',
  ndash: '–',
  quot: '"',
  rdquo: '”',
  reg: '®',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z][a-z\d]+);/gi, (entity, code: string) => {
    if (code.startsWith('#')) {
      const isHex = code[1]?.toLowerCase() === 'x';
      const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (!Number.isInteger(point) || point < 0 || point > 0x10ffff) return entity;
      try {
        return String.fromCodePoint(point);
      } catch {
        return entity;
      }
    }

    return NAMED_HTML_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

function normalizeHeader(value: string): string {
  return decodeHtmlEntities(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/** Formats only the rendered value; WordPress source data is left untouched. */
function formatDisplayText(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/[\u00a0\s]+/g, ' ')
    .trim()
    .toLocaleUpperCase('pt-BR');
}

function cellText(cellMarkup: string): string {
  const text = cellMarkup
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<br\b[^>]*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');

  return decodeHtmlEntities(text).replace(/[\u00a0\s]+/g, ' ').trim();
}

function extractFirstHref(cellMarkup: string): string | undefined {
  const anchor = cellMarkup.match(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/i);
  const href = anchor?.[1] ?? anchor?.[2] ?? anchor?.[3];
  return href ? decodeHtmlEntities(href).trim() : undefined;
}

function normalizeTicketUrl(value: string, fromAnchor = false): string | undefined {
  const trimmed = decodeHtmlEntities(value).trim();
  if (!trimmed || trimmed === '#') return undefined;

  let candidate = trimmed;
  if (candidate.startsWith('//')) {
    candidate = `https:${candidate}`;
  } else if (/^[a-z][a-z\d+.-]*:/i.test(candidate)) {
    // Keep an explicit scheme so unsupported protocols can be rejected below.
  } else if (fromAnchor && candidate.startsWith('/')) {
    candidate = `https://${WORDPRESS_SITE}${candidate}`;
  } else {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    if (!url.hostname || (!fromAnchor && !url.hostname.includes('.'))) return undefined;
    if (url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function parseDate(value: string): string | null {
  const normalized = value.trim();
  const iso = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const brazilian = normalized.match(/^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2,4}))?$/);

  let year: number;
  let month: number;
  let day: number;

  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (brazilian) {
    day = Number(brazilian[1]);
    month = Number(brazilian[2]);
    year = brazilian[3] ? Number(brazilian[3]) : getSaoPauloYear();
    if (year < 100) year += 2000;
  } else {
    return null;
  }

  const checked = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isInteger(year) ||
    checked.getUTCFullYear() !== year ||
    checked.getUTCMonth() !== month - 1 ||
    checked.getUTCDate() !== day
  ) {
    return null;
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getSaoPauloYear(): number {
  const year = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'year')?.value;

  return year ? Number(year) : new Date().getFullYear();
}

function getTableRows(renderedContent: string): string[][] {
  const tables = [...renderedContent.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table\s*>/gi)];
  const requiredHeaders = ['DATA', 'CIDADE', 'LOCAL'];

  for (const table of tables) {
    const rows = [...table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)].map((rowMatch) =>
      [...rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]\s*>/gi)].map((cellMatch) => cellMatch[1])
    );
    const headerRow = rows[0];
    if (!headerRow) continue;

    const headers = headerRow.map((header) => normalizeHeader(cellText(header)));
    if (requiredHeaders.every((header) => headers.includes(header))) return rows;
  }

  throw new Error('Não foi encontrada uma tabela publicada com os cabeçalhos DATA, CIDADE e LOCAL.');
}

type HeaderIndexes = Map<string, number>;

function getCellMarkup(row: string[], headers: HeaderIndexes, ...names: string[]): string {
  for (const name of names) {
    const index = headers.get(normalizeHeader(name));
    if (index !== undefined) return row[index] ?? '';
  }
  return '';
}

function parseShows(renderedContent: string): PublishedShow[] {
  const [headerRow, ...dataRows] = getTableRows(renderedContent);
  if (!headerRow) throw new Error('A tabela publicada está vazia.');

  const headers: HeaderIndexes = new Map(
    headerRow.map((header, index) => [normalizeHeader(cellText(header)), index])
  );

  const shows = dataRows.flatMap((row) => {
    if (!row.some((cell) => cellText(cell))) return [];

    const date = parseDate(cellText(getCellMarkup(row, headers, 'DATA', 'DATE')));
    const city = formatDisplayText(cellText(getCellMarkup(row, headers, 'CIDADE', 'CITY')));
    const venue = formatDisplayText(cellText(getCellMarkup(row, headers, 'LOCAL', 'VENUE')));
    if (!date || !city || !venue) return [];

    const status = normalizeHeader(cellText(getCellMarkup(row, headers, 'STATUS', 'SITUACAO', 'SITUATION')));
    if (CANCELLED_STATUSES.has(status)) return [];

    const time = formatDisplayText(cellText(getCellMarkup(row, headers, 'HORARIO', 'TIME')));
    const description = formatDisplayText(
      cellText(getCellMarkup(row, headers, 'DESCRICAO', 'DESCRIPTION', 'OBSERVACAO', 'OBSERVATION'))
    );
    const ticketCell = getCellMarkup(row, headers, 'LINKINGRESSOS', 'TICKETURL', 'LINK');
    const linkedUrl = normalizeTicketUrl(extractFirstHref(ticketCell) ?? '', true);
    const ticketUrl = linkedUrl ?? normalizeTicketUrl(cellText(ticketCell));

    return [
      {
        date,
        city,
        venue,
        ...(time ? { time } : {}),
        ...(description ? { description } : {}),
        ...(ticketUrl ? { ticketUrl } : {}),
      },
    ];
  });

  if (shows.length === 0) throw new Error('A tabela publicada não contém nenhum show com DATA, CIDADE e LOCAL válidos.');
  return shows;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ configured: false, shows: [] });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  const url = new URL(WORDPRESS_API_URL);
  url.searchParams.set('_fields', 'id,status,modified,categories,content');
  // Evita servir uma cópia anterior da tabela após Cassin publicar alterações.
  url.searchParams.set('_cb', String(Date.now()));

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('WordPress agenda request failed with status', response.status);
      return res.status(502).json({ configured: false, shows: [] });
    }

    const post = (await response.json()) as WordPressPost;
    if (post.id !== WORDPRESS_POST_ID || post.status !== 'publish') {
      console.error('WordPress agenda post is missing or not published.');
      return res.status(502).json({ configured: false, shows: [] });
    }
    if (!Array.isArray(post.categories) || !post.categories.includes(WORDPRESS_AGENDA_CATEGORY_ID)) {
      console.error('WordPress agenda post is not assigned to the AGENDA category.');
      return res.status(502).json({ configured: false, shows: [] });
    }

    const renderedContent = post.content?.rendered;
    if (!renderedContent) {
      console.error('WordPress agenda post has no rendered content.');
      return res.status(502).json({ configured: false, shows: [] });
    }

    const shows = parseShows(renderedContent);
    return res.status(200).json({
      configured: true,
      shows,
      updatedAt: post.modified ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error('WordPress agenda request failed', error instanceof Error ? error.message : 'unknown error');
    return res.status(502).json({ configured: false, shows: [] });
  } finally {
    clearTimeout(timeout);
  }
}
