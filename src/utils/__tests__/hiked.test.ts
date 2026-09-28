import { countHikedTrails } from '@/utils/hiked';

describe('countHikedTrails', () => {
  it('counts a Set of hiked ids', () => {
    expect(countHikedTrails(new Set(['a', 'b', 'c']))).toBe(3);
  });

  it('counts a plain array of hiked ids', () => {
    expect(countHikedTrails(['a', 'b'])).toBe(2);
  });

  it('de-duplicates ids when given an array with repeats', () => {
    expect(countHikedTrails(['a', 'a', 'b'])).toBe(2);
  });

  it('returns 0 for an empty set or array', () => {
    expect(countHikedTrails(new Set())).toBe(0);
    expect(countHikedTrails([])).toBe(0);
  });
});
