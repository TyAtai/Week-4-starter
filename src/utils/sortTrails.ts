import type { Trail } from '@/types/trail';

export type SortOption = 'default' | 'distanceNearest';

/**
 * Applied *after* search and difficulty filtering (see `filterTrails` in
 * `src/utils/search.ts`) so all Explore controls compose together.
 *
 * When `sortOption` is `'distanceNearest'` but no distance data is available
 * (e.g. the user hasn't shared their location, or cleared it), this is a
 * deliberate no-op that returns the input order unchanged — the UI is
 * responsible for disabling the "Distance: Nearest" control in that case,
 * but this function stays safe even if it's ever called anyway.
 */
export function sortTrails(
  trails: Trail[],
  sortOption: SortOption,
  distanceMilesByTrailId: ReadonlyMap<string, number> | null
): Trail[] {
  if (sortOption !== 'distanceNearest' || !distanceMilesByTrailId) {
    return trails;
  }

  return [...trails].sort((a, b) => {
    const distanceA = distanceMilesByTrailId.get(a.id);
    const distanceB = distanceMilesByTrailId.get(b.id);

    if (distanceA == null && distanceB == null) return a.name.localeCompare(b.name);
    if (distanceA == null) return 1;
    if (distanceB == null) return -1;
    if (distanceA !== distanceB) return distanceA - distanceB;

    // Deterministic tie-break when two trails are equidistant.
    return a.name.localeCompare(b.name);
  });
}
