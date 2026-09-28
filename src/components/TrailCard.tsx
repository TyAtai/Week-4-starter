import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DifficultyBadge } from './DifficultyBadge';
import { StarButton } from './StarButton';
import { colors, radii, shadow, spacing, typography } from '@/theme/tokens';
import { formatDistance, formatDuration } from '@/utils/units';
import type { Trail } from '@/types/trail';
import type { Units } from '@/types/preferences';

interface TrailCardProps {
  trail: Trail;
  saved: boolean;
  units: Units;
  onPress: () => void;
  onToggleSaved: () => void;
}

export function TrailCard({ trail, saved, units, onPress, onToggleSaved }: TrailCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trail.name}, ${trail.difficulty} difficulty, ${formatDistance(
        trail.distanceMiles,
        units
      )}, ${formatDuration(trail.estimatedTimeMinutes)}${saved ? ', saved' : ''}`}
      accessibilityHint="Opens trail details"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={trail.image}
        style={styles.image}
        accessible
        accessibilityLabel={`Photo of ${trail.name}`}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {trail.name}
        </Text>
        <DifficultyBadge difficulty={trail.difficulty} size="sm" />
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {formatDistance(trail.distanceMiles, units)} · {formatDuration(trail.estimatedTimeMinutes)}
          </Text>
        </View>
      </View>
      <StarButton trailName={trail.name} saved={saved} onToggle={onToggleSaved} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    gap: 6,
  },
  name: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
