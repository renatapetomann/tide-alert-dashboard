import { describe, expect, it } from 'vitest';
import { parseTideFeed } from '@/lib/tide-data';

const feed = (observed: string | null) => ({ cols: [{ label: 'Topping' }, { label: 'Mare Obser. (MO)' }, { label: 'MA' }, { label: 'Residual' }, { label: 'Previsao MohidSC' }], rows: [{ c: [{ v: '06/10 20:30' }, { v: observed }, { v: '43' }, { v: '5.3' }, { v: '61' }] }] });
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