import { z } from 'zod';

export const tideStations = [
  { id: 'florianopolis', name: 'Florianópolis', code: '2951', file: 'getDataMare3_2951.php', note: 'Estação de Florianópolis informada pela EPAGRI/CIRAM. Não é uma medição em cada bairro do Sul da Ilha.' },
  { id: 'imbituba', name: 'Imbituba', code: '2963', file: 'getDataMare6_2963.php', note: 'Estação de Imbituba, em outra cidade. Os valores não representam a maré nos bairros de Florianópolis.' },
] as const;
export type TideStationId = typeof tideStations[number]['id'];
export const tideSourceUrl = 'https://ciram.epagri.sc.gov.br/index.php/maregrafos/';
const feedSchema = z.object({
  cols: z.array(z.object({ label: z.string() })).min(5),
  rows: z.array(z.object({ c: z.array(z.object({ v: z.union([z.string(), z.number(), z.null()]) })).min(5) })).max(2000),
});
export type TideReading = { label: string; timestamp: string; observed: number | null; predicted: number | null };
export type TideStationData = { id: TideStationId; readings: TideReading[]; error: string | null };
export type TideResult = { checkedAt: string; stations: TideStationData[] };

export type TideKey = 'observed' | 'predicted';
export type TideLevel = 'alta' | 'moderada' | 'baixa';
export type TideTrend = 'subindo' | 'descendo' | 'estavel';
export type TideRange = { min: number; max: number };
export type TidePoint = { label: string; timestamp: string; value: number };
export type TideSummary = {
  value: number | null;
  label: string | null;
  timestamp: string | null;
  level: TideLevel | null;
  trend: TideTrend | null;
  range: TideRange | null;
  message: string;
};

const WINDOW_MS = 26 * 60 * 60 * 1000;
const TREND_MS = 45 * 60 * 1000;

const levelMessages: Record<TideLevel, string> = {
  alta: 'A água está mais alta que o comum nas últimas horas nesta estação.',
  moderada: 'A água está na faixa do meio das últimas horas nesta estação.',
  baixa: 'A água está mais baixa que o comum nas últimas horas nesta estação.',
};
const unknownMessage = 'Ainda não é possível dizer se a maré está alta, moderada ou baixa. Tente novamente em alguns minutos.';

function numeric(value: unknown): number | null {
  if (value === null || value === undefined || String(value).trim() === '' || String(value).trim() === 'null') return null;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= 2000 ? number : null;
}

export function parseTideFeed(raw: unknown, now: Date): TideReading[] {
  const feed = feedSchema.parse(raw);
  if (!feed.cols[1]?.label.includes('Obser') || !feed.cols[4]?.label.includes('Mohid')) throw new Error('Unexpected tide columns');
  return feed.rows.map(({ c }) => {
    const label = String(c[0]?.v ?? '');
    const match = /^(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/.exec(label);
    if (!match) throw new Error('Unexpected tide date');
    const [, day, month, hour, minute] = match;
    // The public graph omits the year; choose the closest year to the retrieval date.
    const candidates = [-1, 0, 1].map(offset => new Date(`${now.getUTCFullYear() + offset}-${month}-${day}T${hour}:${minute}:00-03:00`));
    const date = candidates.sort((a, b) => Math.abs(a.getTime() - now.getTime()) - Math.abs(b.getTime() - now.getTime()))[0];
    if (!date || !Number.isFinite(date.getTime())) throw new Error('Invalid tide date');
    return { label, timestamp: date.toISOString(), observed: numeric(c[1]?.v), predicted: numeric(c[4]?.v) };
  }).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function tidePoints(readings: TideReading[], key: TideKey): TidePoint[] {
  return readings.flatMap(reading => {
    const value = reading[key];
    return value === null ? [] : [{ label: reading.label, timestamp: reading.timestamp, value }];
  });
}

/** Smallest and largest level around a moment, so "high" and "low" compare with this station's own variation. */
export function tideRange(points: TidePoint[], anchorTs?: string, direction: 'before' | 'after' = 'before'): TideRange | null {
  let list = points;
  if (anchorTs) {
    const anchor = Date.parse(anchorTs);
    if (Number.isFinite(anchor)) {
      const within = points.filter(point => {
        const time = Date.parse(point.timestamp);
        if (!Number.isFinite(time)) return false;
        return direction === 'after' ? time >= anchor && time <= anchor + WINDOW_MS : time <= anchor && time >= anchor - WINDOW_MS;
      });
      if (within.length) list = within;
    }
  }
  if (!list.length) return null;
  const values = list.map(point => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (!(max > min) || max - min < 0.1) return null;
  return { min, max };
}

/** Plain-language position of one level inside the station's own recent variation. */
export function tideLevel(value: number | null, range: TideRange | null): TideLevel | null {
  if (value === null || !range || range.max <= range.min) return null;
  const ratio = (value - range.min) / (range.max - range.min);
  if (ratio >= 2 / 3) return 'alta';
  if (ratio <= 1 / 3) return 'baixa';
  return 'moderada';
}

export function tideSummary(readings: TideReading[], key: TideKey, anchorTs?: string): TideSummary {
  const points = tidePoints(readings, key);
  const anchor = anchorTs ? Date.parse(anchorTs) : NaN;
  const current = Number.isFinite(anchor)
    ? (points.filter(point => Date.parse(point.timestamp) <= anchor).at(-1) ?? points[0])
    : points.at(-1);
  const range = tideRange(points, current?.timestamp, key === 'predicted' ? 'after' : 'before');
  const level = tideLevel(current?.value ?? null, range);
  let trend: TideTrend | null = null;
  if (current) {
    const cutoff = Date.parse(current.timestamp) - TREND_MS;
    const earlier = points.filter(point => Date.parse(point.timestamp) <= cutoff).at(-1);
    if (earlier) {
      const delta = current.value - earlier.value;
      trend = delta > 1 ? 'subindo' : delta < -1 ? 'descendo' : 'estavel';
    }
  }
  return {
    value: current?.value ?? null,
    label: current?.label ?? null,
    timestamp: current?.timestamp ?? null,
    level,
    trend,
    range,
    message: level ? levelMessages[level] : unknownMessage,
  };
}
