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