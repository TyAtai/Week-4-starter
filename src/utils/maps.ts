import { Linking, Platform } from 'react-native';
import type { TrailCoordinates } from '@/types/trail';

/**
 * Builds candidate directions URLs for a trailhead. First-version behavior:
 * this opens the device's map app centered on driving/walking directions to
 * the *trailhead*, not turn-by-turn navigation along the trail route itself
 * (no route-navigation service is included in this prototype).
 */
export function buildTrailheadDirectionsUrls(
  coordinates: TrailCoordinates,
  label: string
): string[] {
  const { latitude, longitude } = coordinates;
  const encodedLabel = encodeURIComponent(label);
  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  if (Platform.OS === 'ios') {
    return [`maps://?daddr=${latitude},${longitude}&q=${encodedLabel}`, webFallback];
  }
  if (Platform.OS === 'android') {
    return [`geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`, webFallback];
  }
  return [webFallback];
}

export type OpenDirectionsResult = 'opened' | 'unsupported' | 'error';

export async function openTrailheadDirections(
  coordinates: TrailCoordinates,
  label: string
): Promise<OpenDirectionsResult> {
  const candidates = buildTrailheadDirectionsUrls(coordinates, label);
  for (const url of candidates) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return 'opened';
      }
    } catch {
      // Try the next candidate URL.
    }
  }
  return candidates.length > 0 ? 'unsupported' : 'error';
}
