import {
  formatDistance,
  formatDistanceFromUser,
  formatDuration,
  formatElevation,
  milesToDisplay,
  feetToDisplay,
} from '@/utils/units';

describe('unit conversion', () => {
  it('keeps imperial values unchanged', () => {
    expect(milesToDisplay(10, 'imperial')).toBe(10);
    expect(feetToDisplay(1000, 'imperial')).toBe(1000);
  });

  it('converts miles to kilometers for metric', () => {
    expect(milesToDisplay(10, 'metric')).toBeCloseTo(16.0934, 3);
  });

  it('converts feet to meters for metric', () => {
    expect(feetToDisplay(1000, 'metric')).toBeCloseTo(304.8, 1);
  });

  it('formats distance with the correct unit label', () => {
    expect(formatDistance(4.2, 'imperial')).toBe('4.2 mi');
    expect(formatDistance(4.2, 'metric')).toBe('6.8 km');
  });

  it('formats elevation with the correct unit label', () => {
    expect(formatElevation(3450, 'imperial')).toBe('3,450 ft');
    expect(formatElevation(3450, 'metric')).toBe('1,052 m');
  });

  it('formats duration in hours and minutes', () => {
    expect(formatDuration(135)).toBe('2h 15m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(420)).toBe('7h 0m');
  });

  it('formats distance-from-user separately from trail length, with an "away" suffix', () => {
    expect(formatDistanceFromUser(2.34, 'imperial')).toBe('2.3 mi away');
    expect(formatDistanceFromUser(2.34, 'metric')).toBe('3.8 km away');
  });

  it('rounds distance-from-user to whole numbers past 10 units for readability', () => {
    expect(formatDistanceFromUser(42.6, 'imperial')).toBe('43 mi away');
  });
});
