import { describe, expect, it } from 'vitest';
import { levelFromTide } from '@/lib/neighborhood-tide';

describe('Neighborhood level from real tide', () => {
  it('high tide raises only attention, never a flood risk', () => expect(levelFromTide('alta')).toBe('attention'));
  it('middle tide is normal', () => expect(levelFromTide('moderada')).toBe('normal'));
  it('low tide is normal', () => expect(levelFromTide('baixa')).toBe('normal'));
  it('no tide data shows no level', () => expect(levelFromTide(null)).toBeNull());
});
