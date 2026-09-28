import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';
import type { LocationState } from '@/hooks/useCurrentLocation';

interface LocationBarProps {
  state: LocationState;
  onRequest: () => void;
  onClear: () => void;
}

export function LocationBar({ state, onRequest, onClear }: LocationBarProps) {
  if (state.phase === 'idle') {
    return (
      <Pressable
        onPress={onRequest}
        accessibilityRole="button"
        accessibilityLabel="Use my location"
        accessibilityHint="Requests permission to show and sort trails by distance from you. Your location is not stored or shared."
        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
      >
        <Ionicons name="locate-outline" size={16} color={colors.primary} style={styles.icon} />
        <Text style={styles.actionLabel}>Use My Location</Text>
      </Pressable>
    );
  }

  if (state.phase === 'requesting') {
    return (
      <View style={styles.statusRow} accessible accessibilityLiveRegion="polite">
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.statusText}>Finding your location…</Text>
      </View>
    );
  }

  if (state.phase === 'granted') {
    return (
      <View style={styles.statusRow}>
        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
        <Text style={styles.statusText}>Location set — trails show distance from you</Text>
        <Pressable
          onPress={onRequest}
          accessibilityRole="button"
          accessibilityLabel="Refresh my location"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="refresh" size={16} color={colors.primary} />
        </Pressable>
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear my location"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
    );
  }

  const message =
    state.phase === 'denied'
      ? 'Location access was denied. You can still browse and search trails — enable location access in your device settings to sort by distance.'
      : state.phase === 'unavailable'
        ? 'Location services are turned off on this device. Turn them on to sort trails by distance.'
        : state.message;

  return (
    <View style={styles.statusRow} accessible accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle-outline" size={16} color={colors.textSecondary} />
      <Text style={[styles.statusText, styles.statusTextFlex]} numberOfLines={3}>
        {message}
      </Text>
      <Pressable
        onPress={onRequest}
        accessibilityRole="button"
        accessibilityLabel="Try getting my location again"
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
      >
        <Text style={styles.retryLabel}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: minTouchSize - 8,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  icon: {
    marginRight: spacing.sm,
  },
  actionLabel: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusTextFlex: {
    flex: 1,
  },
  iconButton: {
    width: minTouchSize - 12,
    height: minTouchSize - 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    minHeight: minTouchSize - 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
  },
  retryLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
