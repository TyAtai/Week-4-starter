import * as Location from 'expo-location';
import type { TrailCoordinates } from '@/types/trail';

export type LocationRequestResult =
  | { status: 'granted'; coordinates: TrailCoordinates }
  | { status: 'denied' }
  | { status: 'unavailable' }
  | { status: 'error'; message: string };

const REQUEST_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Requests foreground-only permission (never background) and returns the
 * user's current coordinates. Coordinates are returned to the caller only —
 * this function does not persist, log, or transmit them anywhere. Balanced
 * accuracy is used since trail-distance sorting only needs city-block-level
 * precision, not exact GPS precision.
 */
export async function requestCurrentLocation(): Promise<LocationRequestResult> {
  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return { status: 'unavailable' };
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      return { status: 'denied' };
    }

    const position = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      REQUEST_TIMEOUT_MS,
      'Finding your location took too long. Please try again.'
    );

    return {
      status: 'granted',
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unable to determine your location.',
    };
  }
}
