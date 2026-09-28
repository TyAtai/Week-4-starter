export const colors = {
  background: '#F6F5F1',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEDE7',
  border: '#E4E1D9',
  textPrimary: '#20291F',
  textSecondary: '#5B6660',
  textInverse: '#FFFFFF',
  primary: '#1F6D42',
  primaryDark: '#144A2D',
  primaryLight: '#DCEEE1',
  accentGold: '#F0A93B',
  difficultyEasy: '#3E8E49',
  difficultyEasyBg: '#E3F2E4',
  difficultyModerate: '#DD9A2E',
  difficultyModerateBg: '#FBEBD3',
  difficultyHard: '#D0473C',
  difficultyHardBg: '#FBE0DD',
  danger: '#D0473C',
  overlay: 'rgba(20, 30, 22, 0.45)',
  mapLand: '#D8CEB2',
  mapForest: '#B6CDA0',
  mapRoute: '#1F6D42',
  mapMarker: '#3E8FD8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 0.2 },
  heading: { fontSize: 20, fontWeight: '700' as const },
  subheading: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  small: { fontSize: 12, fontWeight: '500' as const },
};

export const shadow = {
  card: {
    shadowColor: '#1A231C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export const minTouchSize = 44;
