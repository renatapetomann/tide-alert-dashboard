import type { TideLevel } from './tide-data';
import type { Level } from './scenarios';

/** Approximate centres of each neighborhood, for the OpenStreetMap view only. */
export const neighborhoodCoords: Record<string, [number, number]> = {
  'Campeche': [-27.676, -48.488],
  'Pântano do Sul': [-27.781, -48.509],
  'Armação': [-27.749, -48.505],
  'Rio Tavares': [-27.645, -48.478],
  'Ribeirão da Ilha': [-27.718, -48.563],
  'Costa de Dentro': [-27.773, -48.528],
};

/**
 * Tide alone never confirms flooding, so a real tide reading can raise at most an "attention" notice.
 * Unknown tide → null (no level shown, nothing invented).
 */
export function levelFromTide(tide: TideLevel | null): Level | null {
  if (!tide) return null;
  return tide === 'alta' ? 'attention' : 'normal';
}

export const tideWords: Record<TideLevel, string> = { alta: 'Maré alta', moderada: 'Maré no meio', baixa: 'Maré baixa' };
