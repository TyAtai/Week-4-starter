import { filterTrails, matchesQuery } from '@/utils/search';
import { trails } from '@/data/trails';

describe('matchesQuery', () => {
  it('matches case-insensitively', () => {
    const trail = trails.find((t) => t.id === 'cedar-ridge-loop')!;
    expect(matchesQuery(trail, 'CEDAR')).toBe(true);
    expect(matchesQuery(trail, 'cedar ridge')).toBe(true);
  });

  it('ignores leading and trailing whitespace', () => {
    const trail = trails.find((t) => t.id === 'cedar-ridge-loop')!;
    expect(matchesQuery(trail, '   cedar ridge   ')).toBe(true);
  });

  it('treats an empty or whitespace-only query as matching everything', () => {
    const trail = trails[0];
    expect(matchesQuery(trail, '')).toBe(true);
    expect(matchesQuery(trail, '   ')).toBe(true);
  });

  it('returns false for non-matching names', () => {
    const trail = trails.find((t) => t.id === 'cedar-ridge-loop')!;
    expect(matchesQuery(trail, 'granite')).toBe(false);
  });
});

describe('filterTrails', () => {
  it('combines search and difficulty filtering', () => {
    const results = filterTrails(trails, 'e', 'Hard');
    expect(results.length).toBeGreaterThan(0);
    for (const trail of results) {
      expect(trail.difficulty).toBe('Hard');
      expect(trail.name.toLowerCase()).toContain('e');
    }
  });

  it('returns an empty array when nothing matches both filters', () => {
    const results = filterTrails(trails, 'zzzzz-no-such-trail', 'All');
    expect(results).toHaveLength(0);
  });

  it('"All" difficulty filter returns every trail matching the query', () => {
    const results = filterTrails(trails, '', 'All');
    expect(results).toHaveLength(trails.length);
  });
});
