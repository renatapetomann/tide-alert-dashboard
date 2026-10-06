import { createServerFn } from '@tanstack/react-start';
import { parseTideFeed, tideStations, type TideResult, type TideStationData } from './tide-data';

export const getPublicTides = createServerFn({ method: 'GET' }).handler(async (): Promise<TideResult> => {
  const now = new Date();
  const stations = await Promise.all(tideStations.map(async (station): Promise<TideStationData> => {
    try {
      const response = await fetch(`https://ciram.epagri.sc.gov.br/graficos/${station.file}`, { signal: AbortSignal.timeout(12000), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Tide source unavailable');
      const readings = parseTideFeed(await response.json(), now);
      if (!readings.length) throw new Error('Empty tide feed');
      return { id: station.id, readings, error: null };
    } catch {
      return { id: station.id, readings: [], error: 'Não foi possível consultar esta estação agora. Tente novamente ou consulte a EPAGRI/CIRAM.' };
    }
  }));
  return { checkedAt: now.toISOString(), stations };
});