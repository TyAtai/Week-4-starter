import { parsePreferences, parseSavedTrailIds } from '@/lib/storage';
import { DEFAULT_PREFERENCES } from '@/types/preferences';

describe('parseSavedTrailIds', () => {
  it('accepts a well-formed string array', () => {
    expect(parseSavedTrailIds(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('de-duplicates ids', () => {
    expect(parseSavedTrailIds(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  it('rejects non-array values', () => {
    expect(parseSavedTrailIds('not-an-array')).toBeNull();
    expect(parseSavedTrailIds({ a: 1 })).toBeNull();
    expect(parseSavedTrailIds(null)).toBeNull();
    expect(parseSavedTrailIds(undefined)).toBeNull();
  });

  it('rejects an array with non-string entries', () => {
    expect(parseSavedTrailIds(['a', 42, 'c'])).toBeNull();
    expect(parseSavedTrailIds([{ id: 'a' }])).toBeNull();
  });

  it('accepts an empty array', () => {
    expect(parseSavedTrailIds([])).toEqual([]);
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
