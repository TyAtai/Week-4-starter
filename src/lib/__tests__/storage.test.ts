import { STORAGE_KEYS, parsePreferences, parseTrailIdList } from '@/lib/storage';
import { DEFAULT_PREFERENCES } from '@/types/preferences';

describe('parseTrailIdList', () => {
  it('accepts a well-formed string array', () => {
    expect(parseTrailIdList(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('de-duplicates ids', () => {
    expect(parseTrailIdList(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  it('rejects non-array values', () => {
    expect(parseTrailIdList('not-an-array')).toBeNull();
    expect(parseTrailIdList({ a: 1 })).toBeNull();
    expect(parseTrailIdList(null)).toBeNull();
    expect(parseTrailIdList(undefined)).toBeNull();
  });

  it('rejects an array with non-string entries', () => {
    expect(parseTrailIdList(['a', 42, 'c'])).toBeNull();
    expect(parseTrailIdList([{ id: 'a' }])).toBeNull();
  });

  it('accepts an empty array', () => {
    expect(parseTrailIdList([])).toEqual([]);
  });
});

describe('hiked trail ids (shares parseTrailIdList with saved trail ids)', () => {
  it('uses its own namespaced storage key, distinct from saved trail ids', () => {
    expect(STORAGE_KEYS.hikedTrailIds).not.toBe(STORAGE_KEYS.savedTrailIds);
    expect(STORAGE_KEYS.hikedTrailIds).toMatch(/^@trailmate\//);
  });

  it('parses a well-formed hiked-id payload the same way as saved ids', () => {
    expect(parseTrailIdList(['granite-peak-summit', 'cedar-ridge-loop'])).toEqual([
      'granite-peak-summit',
      'cedar-ridge-loop',
    ]);
  });

  it('falls back safely on malformed hiked-id storage data', () => {
    expect(parseTrailIdList({ corrupted: true })).toBeNull();
    expect(parseTrailIdList([1, 2, 3])).toBeNull();
    expect(parseTrailIdList('granite-peak-summit')).toBeNull();
  });
});

describe('parsePreferences', () => {
  it('accepts a well-formed preferences object', () => {
    expect(parsePreferences({ units: 'metric', notificationsEnabled: false })).toEqual({
      units: 'metric',
      notificationsEnabled: false,
    });
  });

  it('falls back to defaults for missing fields', () => {
    expect(parsePreferences({})).toEqual(DEFAULT_PREFERENCES);
  });

  it('falls back to defaults for an invalid units value', () => {
    expect(parsePreferences({ units: 'furlongs', notificationsEnabled: true })).toEqual({
      units: DEFAULT_PREFERENCES.units,
      notificationsEnabled: true,
    });
  });

  it('falls back to defaults for a non-boolean notificationsEnabled value', () => {
    expect(parsePreferences({ units: 'imperial', notificationsEnabled: 'yes' })).toEqual({
      units: 'imperial',
      notificationsEnabled: DEFAULT_PREFERENCES.notificationsEnabled,
    });
  });

  it('rejects malformed top-level values', () => {
    expect(parsePreferences('garbage')).toBeNull();
    expect(parsePreferences(null)).toBeNull();
    expect(parsePreferences(42)).toBeNull();
  });
});
