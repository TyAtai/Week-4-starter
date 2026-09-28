import { sortTrails } from '@/utils/sortTrails';
import { filterTrails } from '@/utils/search';
import { trails, getTrailById } from '@/data/trails';

const cedarRidgeLoop = getTrailById('cedar-ridge-loop')!;
const willowCreekPath = getTrailById('willow-creek-path')!;
const sunsetBluff = getTrailById('sunset-bluff')!;

describe('sortTrails', () => {
  it('returns the input unchanged for the default sort option', () => {
    expect(sortTrails(trails, 'default', null)).toEqual(trails);
  });

  it('sorts nearest to farthest when a distance map is provided', () => {
    const subset = [cedarRidgeLoop, willowCreekPath, sunsetBluff];
    const distances = new Map<string, number>([
      [cedarRidgeLoop.id, 12],
      [willowCreekPath.id, 3],
      [sunsetBluff.id, 7],
    ]);

    const sorted = sortTrails(subset, 'distanceNearest', distances);

    expect(sorted.map((t) => t.id)).toEqual([willowCreekPath.id, sunsetBluff.id, cedarRidgeLoop.id]);
  });

  it('breaks ties deterministically by trail name', () => {
    const subset = [cedarRidgeLoop, willowCreekPath, sunsetBluff];
    const distances = new Map<string, number>([
      [cedarRidgeLoop.id, 5],
      [willowCreekPath.id, 5],
      [sunsetBluff.id, 5],
    ]);

    const sorted = sortTrails(subset, 'distanceNearest', distances);
    const expectedNameOrder = [...subset].sort((a, b) => a.name.localeCompare(b.name));

    expect(sorted.map((t) => t.name)).toEqual(expectedNameOrder.map((t) => t.name));
  });

  describe('when location is unavailable', () => {
    it('is a no-op (returns unsorted input) when distanceOption is requested but the distance map is null', () => {
      const subset = [cedarRidgeLoop, willowCreekPath, sunsetBluff];
      expect(sortTrails(subset, 'distanceNearest', null)).toEqual(subset);
    });
  });

  it('composes with search and difficulty filtering, applied after them', () => {
    const filtered = filterTrails(trails, 'e', 'Easy');
    const distances = new Map<string, number>();
    for (const trail of filtered) {
      distances.set(trail.id, trail.id === cedarRidgeLoop.id ? 1 : 50);
    }

    const result = sortTrails(filtered, 'distanceNearest', distances);

    expect(result.every((t) => t.difficulty === 'Easy')).toBe(true);
    expect(result.every((t) => t.name.toLowerCase().includes('e'))).toBe(true);
    expect(result[0].id).toBe(cedarRidgeLoop.id);
  });
});
