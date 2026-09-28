import { toggleId } from '@/utils/idSet';
import { countHikedTrails } from '@/utils/hiked';

describe('toggleId (marking and unmarking a trail as hiked/saved)', () => {
  it('marks a trail as hiked by adding its id when absent', () => {
    const hiked = toggleId(new Set(), 'granite-peak-summit');
    expect(hiked.has('granite-peak-summit')).toBe(true);
    expect(countHikedTrails(hiked)).toBe(1);
  });

  it('unmarks a trail as hiked by removing its id when present (reversible)', () => {
    const marked = toggleId(new Set(), 'granite-peak-summit');
    const unmarked = toggleId(marked, 'granite-peak-summit');
    expect(unmarked.has('granite-peak-summit')).toBe(false);
    expect(countHikedTrails(unmarked)).toBe(0);
  });

  it('does not mutate the original set', () => {
    const original = new Set(['cedar-ridge-loop']);
    const next = toggleId(original, 'sunset-bluff');
    expect(original.has('sunset-bluff')).toBe(false);
    expect(next.has('sunset-bluff')).toBe(true);
  });

  it('keeps hiked and saved state independent — toggling one id in one set never affects another set', () => {
    const saved = toggleId(new Set(), 'twin-lakes-loop');
    const hiked = new Set<string>();
    expect(saved.has('twin-lakes-loop')).toBe(true);
    expect(hiked.has('twin-lakes-loop')).toBe(false);
  });
});
