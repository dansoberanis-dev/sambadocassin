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

type CsvHeaders = Map<string, number>;

// Fonte temporária autorizada pelo usuário para Production e Preview (a mesma publicada/testada no Preview).
// Em dev local, sem VERCEL_ENV, mantém-se o fallback local. Substituir pelo CSV oficial do Cassin quando compartilhado.
const TEMPORARY_AGENDA_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT54ytQ0YDO3ZU-prjxh_9SpM4T-obDlVMPN_lcHOd_OBDr7zGSmBjsDyuxQRjy1IFxgcDTCOb4Y2cy/pub?gid=0&single=true&output=csv';

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/** Parser CSV simples com suporte a vírgulas, aspas escapadas e quebras de linha entre aspas. */
function parseCsv(input: string): string[][] {
  const text = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ',') {
      row.push(field.trim());
      field = '';
    } else if (char === '\n' || char === '\r') {
      row.push(field.trim());
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      field = '';
      if (char === '\r' && text[i + 1] === '\n') i += 1;
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell !== '')) rows.push(row);
  }

  return rows;
}

function parseDate(value: string): string | null {
  const normalized = value.trim();
  const brazilian = normalized.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  const iso = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  let year: number;
  let month: number;
  let day: number;

  if (brazilian) {
    day = Number(brazilian[1]);
    month = Number(brazilian[2]);
    year = Number(brazilian[3]);
  } else if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    return null;
  }

  const checked = new Date(Date.UTC(year, month - 1, day));
  if (checked.getUTCFullYear() !== year || checked.getUTCMonth() !== month - 1 || checked.getUTCDate() !== day) {
    return null;
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getCell(row: string[], headers: CsvHeaders, ...names: string[]): string {
  for (const name of names) {
    const index = headers.get(normalizeHeader(name));
    if (index !== undefined) return row[index]?.trim() ?? '';
  }
  return '';
}

function normalizeTicketUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizePublishedCsvUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.hostname === 'docs.google.com' && /\/pubhtml\/?$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/pubhtml\/?$/i, '/pub');
      url.searchParams.set('output', 'csv');
      if (!url.searchParams.has('single')) url.searchParams.set('single', 'true');
    }
    return url.toString();
  } catch {
    return value;
  }
}

function parseShows(csv: string): PublishedShow[] {
  const [headerRow, ...dataRows] = parseCsv(csv);
  if (!headerRow) throw new Error('A planilha CSV não contém cabeçalho.');

  const headers: CsvHeaders = new Map(headerRow.map((header, index) => [normalizeHeader(header), index]));
  const requiredHeaders = ['DATA', 'CIDADE', 'LOCAL'];
  if (requiredHeaders.some((header) => !headers.has(header))) {
    throw new Error('Cabeçalhos obrigatórios ausentes: DATA, CIDADE e LOCAL.');
  }

  return dataRows.flatMap((row) => {
    const date = parseDate(getCell(row, headers, 'DATA', 'DATE'));
    const city = getCell(row, headers, 'CIDADE', 'CITY');
    const venue = getCell(row, headers, 'LOCAL', 'VENUE');
    const status = normalizeHeader(getCell(row, headers, 'STATUS', 'SITUACAO', 'SITUATION'));

    if (!date || !city || !venue) return [];
    if (['CANCELADO', 'CANCELADA', 'CANCELLED', 'CANCELED', 'CANCEL'].includes(status)) return [];

    const time = getCell(row, headers, 'HORARIO', 'TIME');
    const description = getCell(row, headers, 'DESCRICAO', 'DESCRIPTION', 'OBSERVACAO', 'OBSERVATION');
    const ticketUrl = normalizeTicketUrl(getCell(row, headers, 'LINKINGRESSOS', 'TICKETURL', 'LINK'));

    return [{
      date,
      city,
      venue,
      ...(time ? { time } : {}),
      ...(description ? { description } : {}),
      ...(ticketUrl ? { ticketUrl } : {}),
    }];
  });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ configured: false, shows: [] });
  }

  const configuredCsvUrl = process.env.AGENDA_CSV_URL?.trim();
  const vercelEnvironment = process.env.VERCEL_ENV;
  const useTemporaryCsv = vercelEnvironment === 'preview' || vercelEnvironment === 'production';
  const selectedCsvUrl = configuredCsvUrl || (useTemporaryCsv ? TEMPORARY_AGENDA_CSV_URL : '');
  const csvUrl = selectedCsvUrl ? normalizePublishedCsvUrl(selectedCsvUrl) : '';
  if (!csvUrl) {
    return res.status(200).json({ configured: false, shows: [] });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(csvUrl, {
      headers: { Accept: 'text/csv' },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Google Sheets agenda request failed with status', response.status);
      return res.status(502).json({ configured: false, shows: [] });
    }

    const csv = await response.text();
    const shows = parseShows(csv);
    return res.status(200).json({ configured: true, shows, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Agenda feed request failed', error instanceof Error ? error.message : 'unknown error');
    return res.status(502).json({ configured: false, shows: [] });
  } finally {
    clearTimeout(timeout);
  }
}
