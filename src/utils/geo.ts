import type { TrailCoordinates } from '@/types/trail';

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Straight-line ("as the crow flies") distance between two coordinates,
 * via the Haversine formula. Returns miles (this codebase's canonical
 * distance unit — see `src/utils/units.ts`).
 *
 * This is distance *to the trailhead*, not the trail's own length and not a
 * driving distance — callers must keep those concepts and labels separate.
 */
export function haversineDistanceMiles(a: TrailCoordinates, b: TrailCoordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(h)));

  return EARTH_RADIUS_MILES * c;
}
