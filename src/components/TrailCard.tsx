import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DifficultyBadge } from './DifficultyBadge';
import { StarButton } from './StarButton';
import { HikedBadge } from './HikedBadge';
import { colors, radii, shadow, spacing, typography } from '@/theme/tokens';
import { formatDistance, formatDistanceFromUser, formatDuration } from '@/utils/units';
import type { Trail } from '@/types/trail';
import type { Units } from '@/types/preferences';

interface TrailCardProps {
  trail: Trail;
  saved: boolean;
  hiked?: boolean;
  units: Units;
  distanceFromUserMiles?: number;
  onPress: () => void;
  onToggleSaved: () => void;
}

export function TrailCard({
  trail,
  saved,
  hiked = false,
  units,
  distanceFromUserMiles,
  onPress,
  onToggleSaved,
}: TrailCardProps) {
  const accessibilityLabelParts = [
    trail.name,
    `${trail.difficulty} difficulty`,
    formatDistance(trail.distanceMiles, units),
    formatDuration(trail.estimatedTimeMinutes),
  ];
  if (distanceFromUserMiles != null) {
    accessibilityLabelParts.push(formatDistanceFromUser(distanceFromUserMiles, units));
  }
  if (hiked) accessibilityLabelParts.push('hiked');
  if (saved) accessibilityLabelParts.push('saved');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabelParts.join(', ')}
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
        <View style={styles.badgeRow}>
          <DifficultyBadge difficulty={trail.difficulty} size="sm" />
          {hiked && <HikedBadge />}
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {formatDistance(trail.distanceMiles, units)} · {formatDuration(trail.estimatedTimeMinutes)}
          </Text>
        </View>
        {distanceFromUserMiles != null && (
          <View style={styles.metaRow}>
            <Ionicons name="navigate-outline" size={13} color={colors.primary} />
            <Text style={[styles.metaText, styles.distanceFromUser]}>
              {formatDistanceFromUser(distanceFromUserMiles, units)}
            </Text>
          </View>
        )}
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  distanceFromUser: {
    color: colors.primary,
    fontWeight: '600',
  },
});
