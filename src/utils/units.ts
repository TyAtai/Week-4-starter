import type { Units } from '@/types/preferences';

const MILES_TO_KM = 1.60934;
const FEET_TO_METERS = 0.3048;

export function milesToDisplay(miles: number, units: Units): number {
  return units === 'metric' ? miles * MILES_TO_KM : miles;
}

export function feetToDisplay(feet: number, units: Units): number {
  return units === 'metric' ? feet * FEET_TO_METERS : feet;
}

export function formatDistance(miles: number, units: Units): string {
  const value = milesToDisplay(miles, units);
  const unitLabel = units === 'metric' ? 'km' : 'mi';
  return `${value.toFixed(1)} ${unitLabel}`;
}

/**
 * Formats straight-line distance *from the user to a trailhead* — distinct
 * from `formatDistance`, which formats a trail's own length. Keeping these
 * as separate functions (and separate on-screen labels) avoids conflating
 * "how far you are from the trailhead" with "how long the trail is."
 */
export function formatDistanceFromUser(miles: number, units: Units): string {
  const value = milesToDisplay(miles, units);
  const unitLabel = units === 'metric' ? 'km' : 'mi';
  const rounded = value < 10 ? value.toFixed(1) : Math.round(value).toString();
  return `${rounded} ${unitLabel} away`;
}

export function formatElevation(feet: number, units: Units): string {
  const value = feetToDisplay(feet, units);
  const unitLabel = units === 'metric' ? 'm' : 'ft';
  return `${Math.round(value).toLocaleString()} ${unitLabel}`;
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export const unitLabels: Record<Units, { distance: string; elevation: string }> = {
  imperial: { distance: 'mi', elevation: 'ft' },
  metric: { distance: 'km', elevation: 'm' },
};
