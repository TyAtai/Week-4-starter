export type Units = 'imperial' | 'metric';

export interface Preferences {
  units: Units;
  notificationsEnabled: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  units: 'imperial',
  notificationsEnabled: true,
};

export interface Profile {
  name: string;
  trailsHiked: number;
}
