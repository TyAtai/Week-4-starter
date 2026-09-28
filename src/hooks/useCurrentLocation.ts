import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { requestCurrentLocation } from '@/lib/location';
import type { TrailCoordinates } from '@/types/trail';

export type LocationState =
  | { phase: 'idle' }
  | { phase: 'requesting' }
  | { phase: 'granted'; coordinates: TrailCoordinates }
  | { phase: 'denied' }
  | { phase: 'unavailable' }
  | { phase: 'error'; message: string };

/**
 * Session-only location state — intentionally *not* wired into
 * AppStateProvider/AsyncStorage. Precise location is kept in memory only for
 * the current app session and is cleared on restart, per the requirement to
 * never persist or transmit it.
 */
export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({ phase: 'idle' });

  const requestLocation = useCallback(async () => {
    setState({ phase: 'requesting' });
    AccessibilityInfo.announceForAccessibility('Finding your location.');

    const result = await requestCurrentLocation();

    if (result.status === 'granted') {
      setState({ phase: 'granted', coordinates: result.coordinates });
      AccessibilityInfo.announceForAccessibility('Location found. Trails now show distance from you.');
    } else if (result.status === 'denied') {
      setState({ phase: 'denied' });
      AccessibilityInfo.announceForAccessibility('Location access was denied.');
    } else if (result.status === 'unavailable') {
      setState({ phase: 'unavailable' });
      AccessibilityInfo.announceForAccessibility('Location services are unavailable on this device.');
    } else {
      setState({ phase: 'error', message: result.message });
      AccessibilityInfo.announceForAccessibility(result.message);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState({ phase: 'idle' });
    AccessibilityInfo.announceForAccessibility('Location cleared.');
  }, []);

  return { state, requestLocation, clearLocation };
}
