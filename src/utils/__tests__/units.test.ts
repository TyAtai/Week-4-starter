import { formatDistance, formatDuration, formatElevation, milesToDisplay, feetToDisplay } from '@/utils/units';

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
});
