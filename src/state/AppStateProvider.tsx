import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  loadPreferences,
  loadSavedTrailIds,
  loadSession,
  persistPreferences,
  persistSavedTrailIds,
  persistSession,
} from '@/lib/storage';
import { DEFAULT_PREFERENCES, type Preferences, type Units } from '@/types/preferences';

interface AppStateValue {
  isHydrated: boolean;
  savedIds: Set<string>;
  isSaved: (trailId: string) => boolean;
  toggleSaved: (trailId: string) => void;
  preferences: Preferences;
  setUnits: (units: Units) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  isLoggedIn: boolean;
  logOut: () => void;
  logIn: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ids, prefs, session] = await Promise.all([
        loadSavedTrailIds(),
        loadPreferences(),
        loadSession(),
      ]);
      if (cancelled) return;
      setSavedIds(new Set(ids));
      setPreferences(prefs);
      setIsLoggedIn(session.isLoggedIn);
      setIsHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isSaved = useCallback((trailId: string) => savedIds.has(trailId), [savedIds]);

  const toggleSaved = useCallback((trailId: string) => {
    setSavedIds((previous) => {
      const next = new Set(previous);
      if (next.has(trailId)) {
        next.delete(trailId);
      } else {
        next.add(trailId);
      }
      persistSavedTrailIds(Array.from(next));
      return next;
    });
  }, []);

  const setUnits = useCallback((units: Units) => {
    setPreferences((previous) => {
      const next = { ...previous, units };
      persistPreferences(next);
      return next;
    });
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setPreferences((previous) => {
      const next = { ...previous, notificationsEnabled: enabled };
      persistPreferences(next);
      return next;
    });
  }, []);

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
    persistSession({ isLoggedIn: false });
  }, []);

  const logIn = useCallback(() => {
    setIsLoggedIn(true);
    persistSession({ isLoggedIn: true });
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      isHydrated,
      savedIds,
      isSaved,
      toggleSaved,
      preferences,
      setUnits,
      setNotificationsEnabled,
      isLoggedIn,
      logOut,
      logIn,
    }),
    [
      isHydrated,
      savedIds,
      isSaved,
      toggleSaved,
      preferences,
      setUnits,
      setNotificationsEnabled,
      isLoggedIn,
      logOut,
      logIn,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export function useSavedTrails() {
  const { savedIds, isSaved, toggleSaved, isHydrated } = useAppState();
  return { savedIds, isSaved, toggleSaved, isHydrated };
}

export function usePreferences() {
  const { preferences, setUnits, setNotificationsEnabled, isHydrated } = useAppState();
  return { preferences, setUnits, setNotificationsEnabled, isHydrated };
}

export function useSession() {
  const { isLoggedIn, logOut, logIn, isHydrated } = useAppState();
  return { isLoggedIn, logOut, logIn, isHydrated };
}
