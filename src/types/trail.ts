import type { ImageSourcePropType } from 'react-native';

export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export type DifficultyFilter = 'All' | Difficulty;

export interface TrailCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * All physical measurements are stored in a single canonical unit system
 * (miles / feet) so fixtures stay simple. Display components convert to
 * the user's preferred unit system via `src/utils/units.ts`.
 */
export interface Trail {
  id: string;
  name: string;
  difficulty: Difficulty;
  distanceMiles: number;
  elevationGainFeet: number;
  estimatedTimeMinutes: number;
  description: string[];
  image: ImageSourcePropType;
  routeSeed: string;
  location: {
    trailheadName: string;
    coordinates: TrailCoordinates;
  };
}
