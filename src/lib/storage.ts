import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PREFERENCES, type Preferences, type Units } from '@/types/preferences';

export const STORAGE_KEYS = {
  savedTrailIds: '@trailmate/saved-trail-ids/v1',
  hikedTrailIds: '@trailmate/hiked-trail-ids/v1',
  preferences: '@trailmate/preferences/v1',
  session: '@trailmate/session/v1',
} as const;

const VALID_UNITS: Units[] = ['imperial', 'metric'];

/**
 * Pure validator: turns arbitrary parsed JSON into a safe, de-duplicated
 * string[] or null. Shared by both the saved-trail-ids and hiked-trail-ids
 * stores, since both are namespaced lists of trail ids with identical shape
 * and identical malformed-data handling.
 */
export function parseTrailIdList(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  if (!raw.every((item) => typeof item === 'string')) return null;
  return Array.from(new Set(raw));
}

/** Pure validator: turns arbitrary parsed JSON into a safe Preferences or null. */
export function parsePreferences(raw: unknown): Preferences | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const candidate = raw as Partial<Preferences>;
  const units = VALID_UNITS.includes(candidate.units as Units)
    ? (candidate.units as Units)
    : DEFAULT_PREFERENCES.units;
  const notificationsEnabled =
    typeof candidate.notificationsEnabled === 'boolean'
      ? candidate.notificationsEnabled
      : DEFAULT_PREFERENCES.notificationsEnabled;
  return { units, notificationsEnabled };
}

async function readJSON(key: string): Promise<unknown | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] Failed to read "${key}"`, error);
    return null;
  }
}

async function writeJSON(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to write "${key}"`, error);
    return false;
  }
}

export async function loadSavedTrailIds(): Promise<string[]> {
  const raw = await readJSON(STORAGE_KEYS.savedTrailIds);
  return parseTrailIdList(raw) ?? [];
}

export async function persistSavedTrailIds(ids: string[]): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.savedTrailIds, ids);
}

export async function loadHikedTrailIds(): Promise<string[]> {
  const raw = await readJSON(STORAGE_KEYS.hikedTrailIds);
  return parseTrailIdList(raw) ?? [];
}

export async function persistHikedTrailIds(ids: string[]): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.hikedTrailIds, ids);
}

export async function loadPreferences(): Promise<Preferences> {
  const raw = await readJSON(STORAGE_KEYS.preferences);
  return parsePreferences(raw) ?? DEFAULT_PREFERENCES;
}

export async function persistPreferences(preferences: Preferences): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.preferences, preferences);
}

export async function loadSession(): Promise<{ isLoggedIn: boolean }> {
  const raw = await readJSON(STORAGE_KEYS.session);
  if (
    typeof raw === 'object' &&
    raw !== null &&
    typeof (raw as { isLoggedIn?: unknown }).isLoggedIn === 'boolean'
  ) {
    return { isLoggedIn: (raw as { isLoggedIn: boolean }).isLoggedIn };
  }
  return { isLoggedIn: true };
}

export async function persistSession(session: { isLoggedIn: boolean }): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.session, session);
}
