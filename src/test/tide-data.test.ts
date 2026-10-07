import { describe, expect, it } from 'vitest';
import { parseTideFeed, tideSummary, tidePhrase, type TideReading } from '@/lib/tide-data';

const feed = (observed: string | null) => ({ cols: [{ label: 'Topping' }, { label: 'Mare Obser. (MO)' }, { label: 'MA' }, { label: 'Residual' }, { label: 'Previsao MohidSC' }], rows: [{ c: [{ v: '06/10 20:30' }, { v: observed }, { v: '43' }, { v: '5.3' }, { v: '61' }] }] });

const series = (start: number, step: number, count: number): TideReading[] => Array.from({ length: count }, (_, i) => ({
  label: `${String(Math.floor((i * 15) / 60)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
  timestamp: new Date(Date.parse('2026-10-06T00:00:00.000Z') + i * 15 * 60 * 1000).toISOString(),
  observed: start + i * step,
  predicted: null,
}));

describe('Public tide data', () => {
  it('preserves station centimetres and converts Brasília time', () => {
    expect(parseTideFeed(feed('48.30'), new Date('2026-10-06T23:50:00Z'))[0]).toEqual({ label: '06/10 20:30', timestamp: '2026-10-06T23:30:00.000Z', observed: 48.3, predicted: 61 });
  });
  it('never converts a missing reading to zero', () => {
    expect(parseTideFeed(feed('null'), new Date('2026-10-06T23:50:00Z'))[0]?.observed).toBeNull();
    expect(parseTideFeed(feed(null), new Date('2026-10-06T23:50:00Z'))[0]?.observed).toBeNull();
  });
  it('rejects changed source columns', () => {
    const data = feed('48.3'); data.cols[1] = { label: 'Different measurement' };
    expect(() => parseTideFeed(data, new Date())).toThrow();
  });
  it('handles the year boundary using the nearest year', () => {
    const data = feed('48.3');
    const row = data.rows[0];
    if (!row) throw new Error('Missing test row');
    row.c[0] = { v: '31/12 23:45' };
    expect(parseTideFeed(data, new Date('2027-01-01T03:00:00Z'))[0]?.timestamp).toBe('2027-01-01T02:45:00.000Z');
  });
});

describe('Everyday tide wording', () => {
  it('says the water is rising when the newest measurement is high and climbing', () => {
    expect(tidePhrase(tideSummary(series(20, 0.7, 96), 'observed'))).toMatchObject({ title: 'A maré está quase no ponto mais alto', plain: 'A água está subindo e já está alta nesta estação.' });
  });
  it('says the water is falling when the newest measurement is low and dropping', () => {
    expect(tidePhrase(tideSummary(series(90, -0.7, 96), 'observed'))).toMatchObject({ title: 'A maré ainda está baixando', plain: 'A água está descendo e já está baixa.' });
  });
  it('never invents a state without a measurement', () => {
    const empty: TideReading[] = [{ label: '06/10 20:30', timestamp: '2026-10-06T23:30:00.000Z', observed: null, predicted: null }];
    const phrase = tidePhrase(tideSummary(empty, 'observed'));
    expect(phrase.title).toBe('Ainda não é possível dizer como está a maré');
    expect(tideSummary(series(50, 0, 96), 'observed').level).toBeNull();
  });
});
