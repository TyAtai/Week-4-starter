import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme/tokens';
import type { Difficulty } from '@/types/trail';

const DIFFICULTY_STYLES: Record<
  Difficulty,
  { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Easy: { bg: colors.difficultyEasyBg, fg: colors.difficultyEasy, icon: 'leaf' },
  Moderate: { bg: colors.difficultyModerateBg, fg: colors.difficultyModerate, icon: 'trail-sign' },
  Hard: { bg: colors.difficultyHardBg, fg: colors.difficultyHard, icon: 'flame' },
};

export function DifficultyBadge({ difficulty, size = 'md' }: { difficulty: Difficulty; size?: 'sm' | 'md' }) {
  const style = DIFFICULTY_STYLES[difficulty];
  const isSmall = size === 'sm';
  return (
    <View
      style={[styles.badge, { backgroundColor: style.bg }, isSmall && styles.badgeSmall]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name={style.icon} size={isSmall ? 11 : 12} color={style.fg} style={styles.icon} />
      <Text style={[styles.label, { color: style.fg }, isSmall && styles.labelSmall]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  badgeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
  labelSmall: {
    fontSize: 11,
  },
});
