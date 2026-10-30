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

const DEFAULT_AGENDA_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQ7FtQ_8QZ51OVjmNdTGV8J9awIjeoXPgaUIYqfDwRZofJF56oxhmRnZXF-eUgD9hVtlYQfcj9-t2u/pub?gid=0&single=true&output=csv';
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

function formatDisplayText(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/[\u00a0\s]+/g, ' ')
    .trim()
    .toLocaleUpperCase('pt-BR');
}

/** Handles quoted commas, escaped quotes, BOM and CRLF/LF line endings. */
function parseCsvRows(csvText: string): string[][] {
  const text = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let insideQuotes = false;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];

    if (insideQuotes) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index++;
      } else if (character === '"') {
        insideQuotes = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"' && cell.length === 0) {
      insideQuotes = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && text[index + 1] === '\n') index++;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }

  if (insideQuotes) throw new Error('O CSV da Agenda contém aspas sem fechamento.');
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
  }

  return rows;
}

function parseDate(value: string): string | null {
  const normalized = decodeHtmlEntities(value).trim();
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

/** Converts common Brazilian inputs such as 19:00, 19h, 19h30 and 19:30. */
function normalizeTime(value: string): string | undefined {
  const trimmed = decodeHtmlEntities(value).trim();
  if (!trimmed) return undefined;

  const match = trimmed.toLowerCase().replace(/\s+/g, '').match(/^(\d{1,2})(?::|h)?(\d{2})?$/);
  if (!match) return formatDisplayText(trimmed);

  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (hours > 23 || minutes > 59) return formatDisplayText(trimmed);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

type HeaderIndexes = Map<string, number>;

function cellValue(row: string[], headers: HeaderIndexes, ...aliases: string[]): string {
  for (const alias of aliases) {
    const index = headers.get(normalizeHeader(alias));
    if (index !== undefined) return row[index] ?? '';
  }
  return '';
}

function normalizeTicketUrl(value: string): string | undefined {
  const trimmed = decodeHtmlEntities(value).trim();
  if (!trimmed || trimmed === '#') return undefined;

  let candidate = trimmed;
  if (candidate.startsWith('//')) {
    candidate = `https:${candidate}`;
  } else if (!/^[a-z][a-z\d+.-]*:/i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    if (!url.hostname || !url.hostname.includes('.')) return undefined;
    if (url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function parseCsvShows(csvText: string): PublishedShow[] {
  const [headerRow, ...dataRows] = parseCsvRows(csvText);
  if (!headerRow) throw new Error('O CSV publicado da Agenda está vazio.');

  const headers: HeaderIndexes = new Map(
    headerRow.map((header, index) => [normalizeHeader(header), index])
  );
  const requiredHeaders = ['DATA', 'CIDADE', 'LOCAL'];
  if (!requiredHeaders.every((header) => headers.has(header))) {
    throw new Error('O CSV precisa conter os cabeçalhos DATA, CIDADE e LOCAL.');
  }

  const shows = dataRows.flatMap((row) => {
    if (!row.some((value) => value.trim())) return [];

    const date = parseDate(cellValue(row, headers, 'DATA', 'DATE'));
    const city = formatDisplayText(cellValue(row, headers, 'CIDADE', 'CITY'));
    const venue = formatDisplayText(cellValue(row, headers, 'LOCAL', 'VENUE'));
    if (!date || !city || !venue) return [];

    const status = normalizeHeader(cellValue(row, headers, 'STATUS', 'SITUACAO', 'SITUATION'));
    if (CANCELLED_STATUSES.has(status)) return [];

    const time = normalizeTime(cellValue(row, headers, 'HORARIO', 'HORA', 'TIME'));
    const description = formatDisplayText(
      cellValue(row, headers, 'DESCRICAO', 'DESCRIPTION', 'OBSERVACAO', 'OBSERVATION')
    );
    const ticketUrl = normalizeTicketUrl(
      cellValue(row, headers, 'LINKINGRESSOS', 'LINKDEINGRESSOS', 'TICKETURL', 'LINK', 'INGRESSOS')
    );

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

  if (shows.length === 0) throw new Error('O CSV não contém shows com DATA, CIDADE e LOCAL válidos.');
  return shows;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ configured: false, shows: [] });
  }

  const configuredUrl = process.env.AGENDA_CSV_URL?.trim() || DEFAULT_AGENDA_CSV_URL;
  let csvUrl: URL;
  try {
    csvUrl = new URL(configuredUrl.replace(/&amp;/gi, '&'));
  } catch {
    console.error('Agenda CSV URL is invalid.');
    return res.status(500).json({ configured: false, shows: [] });
  }
  if (csvUrl.protocol !== 'https:') {
    console.error('Agenda CSV URL must use HTTPS.');
    return res.status(500).json({ configured: false, shows: [] });
  }
  // Bust the upstream cache so edits in Sheets reach the site on the next refresh.
  csvUrl.searchParams.set('_cb', String(Date.now()));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(csvUrl.toString(), {
      headers: { Accept: 'text/csv' },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Google Sheets agenda CSV request failed with status', response.status);
      return res.status(502).json({ configured: false, shows: [] });
    }

    const csvText = await response.text();
    if (!csvText.trim() || /^\s*</.test(csvText)) {
      console.error('Google Sheets agenda endpoint did not return CSV text.');
      return res.status(502).json({ configured: false, shows: [] });
    }

    const shows = parseCsvShows(csvText);
    return res.status(200).json({
      configured: true,
      shows,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google Sheets agenda request failed', error instanceof Error ? error.message : 'unknown error');
    return res.status(502).json({ configured: false, shows: [] });
  } finally {
    clearTimeout(timeout);
  }
}
