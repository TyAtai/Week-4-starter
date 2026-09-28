import { haversineDistanceMiles } from '@/utils/geo';

describe('haversineDistanceMiles', () => {
  it('returns 0 for identical coordinates', () => {
    const point = { latitude: 40.7128, longitude: -74.006 };
    expect(haversineDistanceMiles(point, point)).toBeCloseTo(0, 5);
  });

  it('is symmetric regardless of argument order', () => {
    const a = { latitude: 37.8324, longitude: -122.4924 };
    const b = { latitude: 39.1911, longitude: -106.8175 };
    expect(haversineDistanceMiles(a, b)).toBeCloseTo(haversineDistanceMiles(b, a), 6);
  });

  it('matches the well-known ~69-mile-per-degree-of-latitude approximation', () => {
    const a = { latitude: 0, longitude: 0 };
    const b = { latitude: 1, longitude: 0 };
    const miles = haversineDistanceMiles(a, b);
    expect(miles).toBeGreaterThan(68.5);
    expect(miles).toBeLessThan(69.5);
  });

  it('matches the known great-circle distance between New York City and Los Angeles', () => {
    const nyc = { latitude: 40.7128, longitude: -74.006 };
    const la = { latitude: 34.0522, longitude: -118.2437 };
    const miles = haversineDistanceMiles(nyc, la);
    // Commonly-cited great-circle distance is ~2,451 miles.
    expect(miles).toBeGreaterThan(2400);
    expect(miles).toBeLessThan(2500);
  });
});
